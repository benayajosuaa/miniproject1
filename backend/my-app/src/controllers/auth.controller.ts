import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import prisma from "../lib/prisma";
import { ApiError } from "../utils/apiError";

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {   
        // ambil data pada frontend
        const {email, password} = req.body ?? {}

        // check apakah ada email atau password
        if(!email.toString().trim() || !email || !password || !password.toString().trim()){
            throw new ApiError(400, "Email and password are required")
        }
        
        const emailString = email.toString().trim()
        const passwordString = password.toString()

        // inisiasi variabel user 
        const user = await prisma.user.findUnique({
            where : {email : emailString},
            select: {
                id: true,
                name: true, 
                email: true,
                role:true,
                password: true,
            }
        })

        // check apakah ada user tersebut
        if(!user){
            throw new ApiError(401, "Invalid credentials")
        }

        // verifikasi password menggunakan bcrypt
        const isPasswordValid = await bcrypt.compare(passwordString, user.password)

        // check apakah password valid atau gk 
        if(!isPasswordValid){
            throw new ApiError(401, "Invalid credential")
        }

        // check ENV
        const JWT_SECRET = process.env.JWT_SECRET
        if(!JWT_SECRET){
            throw new ApiError(500, "Server misconfigured")
        }

        const payload = { id: user.id, email: user.email, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

        // kirim response — jangan sertakan hashed password
        return res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
            token,
            user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            },
        },
        });

    } catch (error){
        next(error)
    }
}