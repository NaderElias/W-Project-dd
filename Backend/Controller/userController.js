const userModel = require("../Models/userModel");
const sessionModel = require("../Models/sessionModel");
const securityModel = require("../Models/securityModel");
//not sure to add workFlowModel or not

const jwt = require("jsonwebtoken");
const secertKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

const userController = {
    register: async (req, res) => {
        try {
            //get the data from the request body
            //not sure about the profile
            const { username, password, salt, role, profile } = req.body;

            //check if the user already exists
            //!!! not sure about the username should i use profile email
            const existingUser = await userModel.findOne({ username: username });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }
            //hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            //create a new user
            const newUser = new userModel({
                username,
                password: hashedPassword,
                salt,
                role,
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
            //should i add the profile for email ?
            const {username , password} = req.body;
            //find the user by username
            const user = await userModel.findOne({username: username});
            //if user not found
            if(!user){
                return res.status(404).json({message: "User not found"});
            }
            //compare the password
            const isMatch = await bcrypt.compare(password, user.password);
            //if password not match
            if(!isMatch){
                return res.status(405).json({message: "Invalid credentials"});
            }
            //generate the access token
            const currentDateTime = new Date();
            const expirationDateTime = new Date(+currentDateTime +1800000); //expires in 3 minutes
            const accessToken = jwt.sign({
                user: {userId: user._id, username: user.username, role: user.role}},
                secertKey,
                {
                    expiresIn: 3*60*60,
                }
            );
            let newSession = new sessionModel({
                userId: user._id,
                accessToken: accessToken,
                expirationDateTime: expirationDateTime,
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
            await sessionModel.deleteOne({accessToken: accessToken});
            return res
            .clearCookie("accessToken")
            .status(200)
            .json({message: "User logged out successfully"});
        } catch (error) {
            console.error("Error in userController.logout: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
};
module.exports = userController;


                
            

