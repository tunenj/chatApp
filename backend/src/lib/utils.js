import jwt from "jsonwebtoken"
import { ENV } from "../lib/env.js"

export const generateToken = (userId,res) => {
    const token = jwt.sign({userId:userId}, ENV.JWT_SECRET, {
        expiresIn: "7d",
    })

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        httpOnly: true, // prevent XSS attacks: cross-site scripting
        sameSite: "strict", // CSRF atacks
        secure: ENV.NODE_ENV === "development" ? false : true,
    });

    return token;
};

// http://localhost
//https://dsmakmk.com