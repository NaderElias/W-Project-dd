const userModel = require("../Models/userModel");
const sessionModel = require("../Models/sessionModel");
const securityModel = require("../Models/securityModel");
//not sure to add workFlowModel or not

require('dotenv').config();
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

const userController = {
    register: async (req, res) => {
        try {
            //get the data from the request body
            //not sure about the profile
            const { email, password, profile } = req.body;

            //check if the user already exists
            const existingUser = await userModel.findOne({ email: email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }
            //hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            //create a new user
            const newUser = new userModel({
                email,
                password: hashedPassword,
                profile,
            });
            //save the user to the database
            await newUser.save();
            //send a success message
            res.status(201).json({ message: "User registered successfully" });
            
        } catch (error) {
            console.error("Error in userController.register: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
    login : async (req, res) => {
        try {
            const {email, password} = req.body;
            //find the user by email
            const user = await userModel.findOne({email: email});
            //if user not found
            if(!user){
                return res.status(400).json({message: "Invalid credentials"});
            }
            //compare the password
            const isMatch = await bcrypt.compare(password, user.password);
            //if password not match
            if(!isMatch){
                return res.status(400).json({message: "Invalid credentials"});
            }
            const session = await sessionModel.findOne({userID: user._id});
            console.log("session|| "+ session)
            let n;
            if(session){
                n = await sessionModel.findByIdAndDelete(session._id)
            }
            console.log("n|| "+ n)
            //generate the access token
            const currentDateTime = new Date();
            const expirationDateTime = new Date(+currentDateTime +1800000); //expires in 30 minutes
            const accessToken = jwt.sign({
                user: {userId: user._id, role: user.role}},
                secretKey,
                {
                    expiresIn: 3*60*60,
                }
            );
            let timeStamps = {
                createdAt: currentDateTime,
                expiredAt: expirationDateTime
            }
            let newSession = new sessionModel({
                userID: user._id,
                token: accessToken,
                timeStamps: timeStamps,
            });
            await newSession.save();
            return res
            .cookie ("accessToken", accessToken,{
                expirationDateTime: expirationDateTime,
                withCredentials: true,
                httpOnly: true,
                sameSite: "none",  //should be none for cross origin
            })
            .status(200)
            .json({message: "User logged in successfully",user: user});
        } catch (error) {
            console.error("Error in userController.login: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
    //not sure about the logout 
    logout: async (req, res) => {
        try {
            const accessToken = req.cookies.accessToken;
            const session = await sessionModel.findOne({token: accessToken});
    
            if (session) {
                await sessionModel.deleteOne({token: accessToken});
                return res
                .clearCookie("accessToken")
                .status(200)
                .json({message: "User logged out successfully"});
            } else {
                return res.status(400).json({message: "User is already logged out"});
            }
        } catch (error) {
            console.error("Error in userController.logout: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
};
module.exports = userController;


                
            

