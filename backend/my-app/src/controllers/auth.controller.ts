import type { Request, Response } from "express";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import prisma from "../lib/prisma";

export const loginController = async (req: Request, res: Response) => {
    try {   
        // ambil data pada frontend
        const {email, password} = req.body
        // check apakah ada data pada frontend
        const user = await prisma.user.findUnique({
            where: {email}
        })
        // => jika tidak ada user email
        if(!user){
            return res.status(404).json({
                message:"Email not Found"
            })
        }

        // kalau ada usernya maka : 
        const isPasswordValid = await bcrypt.compare(password, user.password)
        // => jika password salah 
        if(!isPasswordValid){
            return res.status(401).json({
                message:"Wrong Password"
            })
        }

        // jika semua pass, untuk password dan juga username maka buas jwt-nya
        const JWT_SECRET = process.env.JWT_SECRET
        if(!JWT_SECRET){
            console.error("JWT_secret is missing")
            return res.status(500).json({ message: "Server misconfigured" })
        }

        const token = jwt.sign(
            {id: user.id, email:user.email, role:user.role},
            JWT_SECRET,
            {expiresIn: "1d"}
        )

        // kirim status berhasil 
        res.json({
            message:"Login Success", 
            token, 
            user: {
                id : user.id,
                name : user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error : any){
        console.error("Login Error", error)
        res.status(500).json({
            message: "Server error"
        })
    }
}