import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
    };
    }

    interface JwtPayloadCustom extends jwt.JwtPayload {
    id: number;
    email: string;
    role: string;
    }

    export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // ambil header Authorization
        const authHeader = req.headers.authorization;

        // kalau gak ada token sama sekali
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "No Token provided. Authorization header missing",
        });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
        return res.status(401).json({
            message: "No Token provided. Token missing after Bearer",
        });
        }

        // ambil secret dari .env
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
        console.error("ERROR : JWT_SECRET missing from .env");
        return res.status(500).json({
            message: "Server misconfigured",
        });
        }

        // verifikasi token
        const decoded = jwt.verify(token, JWT_SECRET) as unknown as JwtPayloadCustom;

        // simpan user ke req.user
        req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        };

        next();
    } catch (error: any) {
        console.error("Auth Middleware Error:", error.message);

        if (error.name === "TokenExpiredError") {
        return res.status(401).json({
            message: "Token expired. Please login again.",
        });
        }

        if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
            message: "Invalid token.",
        });
        }

        return res.status(401).json({
        message: "Unauthorized access.",
        });
    }
};
