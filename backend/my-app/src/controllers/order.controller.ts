// src/controllers/order.controller.ts
import type { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { ApiError } from "../utils/apiError";
import { OrderService } from "../services/order.services";
import { CreateOrderInput } from "../types/order.type";
import type { AuthRequest } from "../middlewares/auth.middleware";



// CREATE ORDER

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user_id = req.user?.id;
        if (!user_id) throw new ApiError(401, "Login first");

        const { products, detail } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            throw new ApiError(400, "Products cannot be empty");
        }

        for (const items of products) {
            if (!items.product_id || isNaN(Number(items.product_id))) {
                throw new ApiError(400, "product_id must be valid");
            }
            if (!items.quantity || isNaN(Number(items.quantity)) || items.quantity <= 0) {
                throw new ApiError(400, "quantity must be a positive number");
            }
        }

        if (!detail) throw new ApiError(400, "Order detail is required");

        const { name, phone, address, city, postal_code } = detail;

        if (!name?.trim()) throw new ApiError(400, "Name is required");
        if (!phone?.trim()) throw new ApiError(400, "Phone is required");
        if (!address?.trim()) throw new ApiError(400, "Address is required");
        if (!city?.trim()) throw new ApiError(400, "City is required");
        if (!postal_code?.trim()) throw new ApiError(400, "Postal code is required");

        const payload: CreateOrderInput = { user_id, products, detail };
        const createdOrder = await OrderService.createOrder(payload);

        return res.status(201).json({
            status: "success",
            message: "Order created successfully",
            data: createdOrder
        });
    } catch (error) {
        next(error);
    }
};



// GET ALL ORDER (ADMIN)

export const getAllOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (req.user?.role !== "superadmin") {
            throw new ApiError(403, "Only admin can access this endpoint");
        }

        const orders = await prisma.orders.findMany({
            orderBy: { created_at: "desc" },
            include: {
                order_detail: true,
                order_product: {
                    include: { produt: true }
                },
                user: { select: { id: true, name: true, email: true } }
            }
        });

        return res.status(200).json({
            status: "success",
            message: "All orders fetched successfully",
            data: orders
        });

    } catch (error) {
        next(error);
    }
};



// GET MY ORDER

export const getMyOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user_id = req.user?.id;
        if (!user_id) throw new ApiError(401, "Login first");

        const orders = await prisma.orders.findMany({
            where: { user_id },
            orderBy: { created_at: "desc" },
            include: {
                order_detail: true,
                order_product: { include: { produt: true } }
            }
        });

        return res.status(200).json({
            status: "success",
            message: "User order history retrieved",
            data: orders
        });

    } catch (error) {
        next(error);
    }
};



// GET ORDER BY ID

export const getOrderById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const orderId = Number(req.params.id);
        const userId = req.user?.id;
        const role = req.user?.role;

        if (isNaN(orderId)) throw new ApiError(400, "Invalid ID format");

        const order = await prisma.orders.findUnique({
            where: { id: orderId },
            include: {
                order_detail: true,
                order_product: { include: { produt: true } },
                user: { select: { id: true, name: true, email: true } }
            }
        });

        if (!order) throw new ApiError(404, "Order not found");

        // cek user hanya bisa melihat order miliknya
        if (role === "costumer" && order.user_id !== userId) {
            throw new ApiError(403, "You are not allowed to view this order");
        }

        return res.status(200).json({
            status: "success",
            message: "Order fetched successfully",
            data: order
        });

    } catch (error) {
        next(error);
    }
};



// UPDATE ORDER STATUS (ADMIN)

export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // FIXED kondisi admin
        if (req.user?.role !== "superadmin") {
            throw new ApiError(403, "Only admin can update order status");
        }

        const orderId = Number(req.params.id);
        const { status } = req.body;

        if (isNaN(orderId)) throw new ApiError(400, "Invalid ID format");

        const validStatus = ["pending", "success", "failed"];
        if (!validStatus.includes(status)) {
            throw new ApiError(400, "Invalid status value");
        }

        const updatedOrder = await prisma.orders.update({
            where: { id: orderId },
            data: { status },
            include: {
                order_detail: true,
                order_product: { include: { produt: true } }
            }
        });

        return res.status(200).json({
            status: "success",
            message: "Order status updated successfully",
            data: updatedOrder
        });

    } catch (error) {
        next(error);
    }
};
