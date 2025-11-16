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
            // return res.status(400).json({
            //     message:"Category name is required"
            // })
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
            // return res.status(404).json({
            //     message:"Invalid category ID format"
            // })
        }
        // check ketersedian nama category itu
        if(!name || !name.trim()){
            throw new ApiError(400, "Category name is required")
            // return res.status(400).json({
            //     message:"Category name is required"
            // })
        }
        // // check ketersedian nama dan id
        // const found = await prisma.category.findUnique({
        //     where : {id:Number(id)}
        // })
        // // check apakah ada kategori 
        // if(!found){
        //     return res.status(404).json({
        //         message: "category not found"
        //     })
        // }

        // jika id ada maka, update lah id nya
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
            // return res.status(404).json({
            //     message:"Invalid category ID format"
            // })
        }
        // inisiasi status kalau dia ditemukan
        // const found = await prisma.category.findUnique({
        //     where : {id: Number(id)}
        // })
        // if (!found){
        //     return res.status(404).json({
        //         message:"Category not found"
        //     })
        // }
        // jika ada product yang menggunakan category itu 
        const linkedProducts = await prisma.product.count({ 
            where : {category_id: Number(id)}
        })
        if (linkedProducts > 0 ){
            throw new ApiError(409,`cannot delete this category, because ${linkedProducts} product still linked to this category`)
            // return res.status(409).json({
            //     message:`cannot delete this category, because ${linkedProducts} product still linked to this category`
            // })
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

        const categories = await prisma.category.findMany({
            orderBy: {name: "asc"}
        })

        return res.status(200).json({
            status:"succes",
            message:"Success get all categories", 
            categories
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
            // return res.status(404).json({
            //     message:"Invalid category ID format"
            // })
        }

        const categoryById = await prisma.category.findUnique({
            where: {id:Number(id)}
        })

        if(!categoryById){
            throw new ApiError(404, "Category not exist")
            // return res.status(404).json({
            //     message:"Category not exist"
            // })
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