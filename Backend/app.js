const express = require("express");
const app = express();
const mongoose = require("mongoose");
const productRouter = require("./Routes/products");
const userRouter = require("./Routes/users");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next()
});

app.use("/products", productRouter);
app.use("/users", userRouter);

const db_name = "Wbase";
const db_url = `mongodb+srv://ziadshafiq7:qwer1234QWER@cluster0.wbady4f.mongodb.net/${db_name}`;

const connectionOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose
  .connect(db_url, connectionOptions)
  .then(() => console.log("mongoDB connected"))
  .catch((e) => {
    console.log(e);
  });

app.use(function (req, res, next) {
  return res.status(404).send("404");
});
app.listen(3000, () => console.log("server started"));
