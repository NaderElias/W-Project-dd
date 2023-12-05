const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
const cron = require("node-cron");
const { spawn } = require("child_process");
const sessionModel = require("./Models/sessionModel");

//always comment what you don't use
const ticketRouter = require("./Routes/tickets");
const userRouter = require("./Routes/users");
const authRouter = require("./Routes/auth");
const automationRouter = require("./Routes/automation");
const brandingRouter = require("./Routes/branding");
const chatRouter = require("./Routes/chats");
const knowledgeBaseRouter = require("./Routes/knowledgeBase");
const reportsRouter = require("./Routes/reportsAnalytics");

require("dotenv").config();
const authenticationMiddleware = require("./Middleware/authenticationMiddleware");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	next();
});

app.use(cookieParser());

app.use(
	cors({
		origin: process.env.ORIGIN,
		methods: ["GET", "POST", "DELETE", "PUT"],
		credentials: true,
	})
);

const db_name = process.env.DB_NAME;
const db_url = `${process.env.DB_URL}/${db_name}`;
const ARCHIVE = process.env.ARCHIVE;

const connectionOptions = {
	useUnifiedTopology: true,
	useNewUrlParser: true,
};

function backupMongoDB() {
	const child = spawn("mongodump", [
		`--archive=${ARCHIVE}`,
		`--uri=${db_url}`,
		"--gzip",
	]);
	child.stdout.on("data", (data) => {
		console.log(`stdout: ${data}`);
	});
	child.stderr.on("data", (data) => {
		console.error(`stderr: ${data}`);
	});
	child.on("error", (error) => {
		console.error(`error: ${error.message}`);
		child.on("exit", code, (signal) => {
			if (code) {
				console.log(`process exit with code ${code} and signal ${signal}`);
			} else if (signal) {
				console.log(`process killed with signal ${signal}`);
			} else {
				console.log("backup process complete");
			}
		});
	});
}

cron.schedule("0 0 * * * *", () => {
	backupMongoDB();
});

// always comment what you don't use
app.use("/api", authRouter);
app.use(authenticationMiddleware);
app.use("/api/tickets", ticketRouter);
app.use("/api/users", userRouter);
app.use("/api/automation", automationRouter);
app.use("/api/branding", brandingRouter);
//app.use("/api/chats", chatRouter);
//app.use("/api/knowledgeBase", knowledgeBaseRouter);
app.use("/api/reports", reportsRouter);

mongoose
	.connect(db_url, connectionOptions)
	.then(() => {
		console.log("mongoDB connected");
		cron.schedule("0 0 * * *", () => {
			sessionModel
				.deleteMany({ "timeStamps.expiredAt": { $lt: Date.now() } })
				.then(() => console.log("deleted sessions"));
		});
	})
	.catch((e) => {
		console.log(e);
	});

app.use(function (req, res, next) {
	return res.status(404).send("404");
});
app.listen(3000, () => console.log("server started"));
