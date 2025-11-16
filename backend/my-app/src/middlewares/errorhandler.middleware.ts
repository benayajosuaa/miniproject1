import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/apiError";

export const errorHandler = (err: any, req: Request, res:Response, _next:NextFunction) => {
    // tangkap eror secara global 
    console.error("Error caught by middleware", err)

    // jika eror berasal dari API 
    if(err instanceof ApiError){
        return res.status(err.statusCode).json({
            message:err.message,
            status:"error"
        })
    }

    // jika record/atribut/data tidak ada
    if(err instanceof Prisma.PrismaClientKnownRequestError && err.code==="P2025"){
        return res.status(404).json({
            message:"Data not found",
            status:"error"
        })
    }

    
    // jika data tidak valid sesuai format dimintal
    if (err instanceof Prisma.PrismaClientValidationError){
        return res.status(400).json({
            message:"Invalid data format",
            status:"error"
        })
    }
    
    // jika database atau si prisma itu sendiri yang error
    if(err instanceof Prisma.PrismaClientKnownRequestError){
        return res.status(500).json({
            message:"Database error",
            status:"error"
        })
    }

    // internal server error atau error tidak dikenal 
    return res.status(500).json({
        message:"Internal server error",
        status:"error"
    })
}