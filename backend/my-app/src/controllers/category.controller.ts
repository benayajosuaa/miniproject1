import type { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { ApiError } from "../utils/apiError";

// CREATE
// membuat category - admin 
export const createCategory = async (req: Request, res: Response, next:NextFunction) => {
    try {
        // inisiasi nama
        const {name} = req.body
        // check apakah ada nama sebelumnya ? 
        if(!name || !name.trim()){
            throw new ApiError(400,"Category name is required")
        }
        // kalau udah pas, maka buat kategory baru 
        const newCategory = await prisma.category.create({
            data: {name : name.trim()}
        })

        // kirim response
        return res.status(201).json({
            status:"succes",
            message: "Category created successfully",
            category: newCategory
        })

    } catch(error){
        next(error)
    }
}

// UPDATE
// update jenis category - admin 
export const updateCategory = async (req: Request, res: Response, next:NextFunction) => {
    try {
        // inisiasi
        const {id} = req.params
        const {name} = req.body
        // check apakah id ada atau tidak 
        if(isNaN(Number(id))){
            throw new ApiError(404,"Invalid category Id Format")
        }
        // check ketersedian nama category itu
        if(!name || !name.trim()){
            throw new ApiError(400, "Category name is required")
        }

        const updated = await prisma.category.update({
            where: {id: Number(id)},
            data: {name : name.trim()}
        })

        res.status(200).json({
            status:"succes",
            message:"Category updated successfully",
            category: updated
        })


    } catch(error){
        next(error)
    }
}

// DELETE
// delete jenis category - admin 
export const deleteCategory = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const {id} = req.params
        // check apakah id itu adalah suatu hal yang valid
        if(isNaN(Number(id))){
            throw new ApiError(400, "Invalid category Id Format")
        }

        const linkedProducts = await prisma.product.count({ 
            where : {category_id: Number(id)}
        })
        if (linkedProducts > 0 ){
            throw new ApiError(409,`cannot delete this category, because ${linkedProducts} product still linked to this category`)
        }


        // delete jika benar
        await prisma.category.delete({
            where: {id:Number(id)}
        })

        return res.status(200).json({
            status:"succes",
            message:"Success delete category"
        })

    } catch(error){
        next(error)
    }
}

// GET
// read semua category - admin & user
export const getAllCategory = async (req: Request, res: Response, next:NextFunction) => {
    try {

        // buat pagination 
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const search = req.query.search?.toString() || ""

        const skip = (page - 1) * limit

        const whereClause : any = {}
        
        if(search){
            whereClause.name = {
                contains: search,
                mode: "insensitive"
            }
        }

        const totalItems = await prisma.category.count({
            where: whereClause
        })


        const categories = await prisma.category.findMany({
            where: whereClause,
            skip,
            orderBy: {name: "asc"},
            take: limit,
            include:{
                categories: true
            }
        })

        // hitung total semua 
        const totalPages = Math.ceil(totalItems/limit)


        return res.status(200).json({
            status:"succes",
            message:"Success get all categories", 
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                limit
            },
            data: categories
        })

    } catch(error){
        next(error)
    }
}

// GET by id
// read semua category dari id - admin & user
export const getCategoryById = async (req: Request, res: Response, next:NextFunction) => {
    try {

        const {id} = req.params

        if(isNaN(Number(id))){
            throw new ApiError(404,"Invalid category Id Format")
        }

        const categoryById = await prisma.category.findUnique({
            where: {id:Number(id)}
        })

        if(!categoryById){
            throw new ApiError(404, "Category not exist")
        }

        return res.status(200).json({
            status:"succes",
            message: "Success get category by Id",
            category: categoryById
        })

    } catch(error){
        next(error)
    }
}