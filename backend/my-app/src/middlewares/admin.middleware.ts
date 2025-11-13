import type { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const requireAdmin = (req: AuthRequest, res: Response, next:NextFunction) => {
    try {
        
        // check apakah ada require user
        if(!req.user){
            return res.status(401).json({
                message: "unauthorized. Please login first"
            })
        }

        // check apakah role user adalah superadmin ? 
        if(req.user.role !== "superadmin"){
            return res.status(403).json({
                message:"access denied, admin only"
            })
        }

        // jika role benar maka 
        next()

    } catch (error : any){
        console.error("Admin middleware error : ", error)
        return res.status(500).json({
            message:"server error in admin middleware"
        })
    }
}