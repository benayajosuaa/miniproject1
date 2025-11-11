import type { Request, Response } from "express";
import prisma from "../lib/prisma";

// CREATE
// membuat category - admin 
export const createCategory = async (req: Request, res: Response) => {
    try {
        // inisiasi nama
        const {name} = req.body
        // check apakah ada nama sebelumnya ? 
        if(!name){
            return res.status(400).json({
                message:"Category name is required"
            })
        }
        // kalau udah pas, maka buat kategory baru 
        const newCategory = await prisma.category.create({
            data: {name}
        })

        // kirim response
        res.status(201).json({
            message: "Category created successfully",
            category: newCategory
        })

    } catch(error : any){
        console.error("Error creating category", error)
        return res.status(500).json({
            message: "Failed to create category"
        })
    }
}

// UPDATE
// update jenis category - admin 
export const updateCategory = async (req: Request, res:Response) => {
    try {
        // inisiasi
        const {id} = req.params
        const {name} = req.body
        // check apakah id ada atau tidak 
        if(isNaN(Number(id))){
            return res.status(404).json({
                message:"Invalid category ID format"
            })
        }
        // check ketersedian nama category itu
        if(!name){
            return res.status(400).json({
                message:"Category name is required"
            })
        }
        // check ketersedian nama dan id
        const found = await prisma.category.findUnique({
            where : {id:Number(id)}
        })
        // check apakah ada kategori 
        if(!found){
            return res.status(404).json({
                message: "category not found"
            })
        }

        // jika id ada maka, update lah id nya
        const updated = await prisma.category.update({
            where: {id: Number(id)},
            data: {name}
        })

        res.status(200).json({
            message:"Category updated successfully",
            category: updated
        })


    } catch (error : any){
        console.error("Error to update category", error)
        return res.status(500).json({
            message:"Failed to update category"
        })
    }
}

// DELETE
// delete jenis category - admin 
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        
        if(isNaN(Number(id))){
            return res.status(404).json({
                message:"Invalid category ID format"
            })
        }
        // inisiasi status kalau dia ditemukan
        const found = await prisma.category.findUnique({
            where : {id: Number(id)}
        })
        if (!found){
            return res.status(404).json({
                message:"Category not found"
            })
        }

        await prisma.category.delete({
            where: {id:Number(id)}
        })

        res.status(200).json({
            message:"Success delete category"
        })

    } catch (error : any){
        console.error("Error to update category", error)
        return res.status(500).json({
            message:"Failed to delete category"
        })
    }
}

// GET
// read semua category - admin & user
export const getAllCategory = async (req: Request, res:Response) => {
    try {

        const categories = await prisma.category.findMany({
            orderBy: {name: "asc"}
        })

        res.status(200).json({
            message:"Success get all categories", 
            categories
        })

    } catch(error: any){
        console.error("Error reading category", error)

        return res.status(500).json({
            message:"Failed to read all category"
        })
    }
}

// GET by id
// read semua category dari id - admin & user
export const getCategoryById = async (res: Response, req: Request) => {
    try {

        const {id} = req.params

        if(isNaN(Number(id))){
            return res.status(404).json({
                message:"Invalid category ID format"
            })
        }

        const categoryById = await prisma.category.findUnique({
            where: {id:Number(id)}
        })

        if(!categoryById){
            return res.status(404).json({
                message:"Category not exist"
            })
        }

        res.status(200).json({
            message: "Success get category by Id",
            category: categoryById
        })

    } catch (error : any){
        console.error("Error get category by Id", error)
        res.status(500).json({
            message:"Failed to get category"
        })
    }
}