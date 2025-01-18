const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const registerUser = async(req, res)=>{
    try {
        const {email, name, password} = req.body;
        const userExists = await userModel.findOne({ email });
        if (userExists) {
          return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = new userModel({
            email,
            password,
            name
        });
        await newUser.save();

        return res.status(201).json({
            "message":"User registration successful"
        })
    } catch (error) {
        return res.status(500).json({
            "message":"User registration successful"
        })
    }
}

const userLogin = async (req, res)=>{
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({email});
        //Check is user exists
        if(!user)
        {
            return res.status(404).json({
                "message":"User not found"
            }
            )
        }
        //Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare( password, user.password);
        if(!isPasswordCorrect)
        {
            return res.status(400).json({
                "message":"Invalid credentials"
            })
        }

        const token  =  jwt.sign({email},process.env.JWT_SECRET, {expiresIn:"1d"});
        return res.status(200).json({
            "message":"User logged in successfully",
            token

        })
    } catch (error) {
        return res.status(500).json({
            "message":"internal sever error"
        })
    }
}

const getUserData = async (req, res)=>{
    try {
        const {email} = req.body;
        const user  = await userModel.findOne({email});
        if(!user)
        {
            return res.status(404).json({
                "message":"User doesn't exists"
            })
        }

        const userData = {...user._doc, password:""}
        return res.status(200).json({
            "message":"User data fetched successfully",
            userData
        })
    } catch (error) {
        return res.status(500).json({
            "message":"internal sever error"
        })
    }
}

module.exports = {registerUser, userLogin, getUserData}