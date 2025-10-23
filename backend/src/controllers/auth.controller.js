import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"
import { ENV } from "../lib/env.js"

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body

    if ( !email || !password){
        return res.status(400).json({ message:"Email and Password are required" });
    }

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }

        // check if emails valid: regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({email});
        if(user) return res.status(400).json({message:"Email already exists"})

        // 123456 => Sdnjassdkasj_?dmsknk
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullName,
            email,
            password: hashPassword
        })

        if(newUser){
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,     
            });

            // todo: send a welcome email to user
            try {
                await sendWelcomeEmail(newUser.email, newUser.fullName, ENV.CLIENT_URL);
            } catch (error) {
                console.error("Failed to send welcome email:", error);
            }
        }else{
            res.status(400).json({message: "Invalid user data"})
        }
    } catch (error) {
        console.log("Error in signup controller:", error)
        res.status(500).json({message:"Internal server error"})
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password){
        return res.status(400).json({ message: "Email and passwoord are required" });
    }

    try {
        const user = await User.findOne({ email });
        if(!user) 
            return res.status(400).json({ message:"invalid credentials" })
            // never tell the client which one is incorrect: password or email

        const isPasswordCorrect = await bcrypt.compare(password,user.password)
        if(!isPasswordCorrect) return  res.status(400).json({message:"invalid credentials"});

        generateToken(user._id,res)

         res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,     
            });
    } catch (error) {
        console.error("Error in login controller",error)
        res.status(500).json({message:"Internal server error"})
    }
};


export const logout = (_, res) => {
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:"Logged out successfully"})
};