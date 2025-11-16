import type {Request, Response, NextFunction} from "express"
import prisma from "../lib/prisma"
import { ApiError } from "../utils/apiError"


// CREATE 
// buat nama brand - admin 
export const createBrand = async (req: Request, res: Response, next:NextFunction) => {
    try {

        const {name, logo} = req.body
        // check name harus ada
        if (!name || !name.trim()){
            throw new ApiError(400,"Brand name is required")
            // return res.status(400).json({
            //     message:"Brand name is required"
            // })
        }
        // check logo harus ada
        if(!logo || !logo.trim()){
            throw new ApiError(400, "Brand Logo is required")
            // return res.status(400).json({
            //     message:"Brand logo is required"
            // })
        }
        // buat brandnya
        const brand = await prisma.brand.create({
            data : {
                name : name.toString().trim(),
                logo : logo.toString().trim()
            }
        })

        return res.status(201).json({
            status:"success",
            message:"Brand created",
            newBrand: brand
        })
    } catch (error){
        next(error)
    }
}

// UPDATE 
// update kalau brand mau di ubah - admin 
export const updateBrand = async (req: Request, res: Response, next:NextFunction) => {
    try {
        // tentukan id dan juga entitas brandnya
        const {id} = req.params
        const {name, logo} = req.body

        if(isNaN(Number(id))){
            throw new ApiError(400, "Invalid brand Id")
            // return res.status(400).json({
            //     message:"Invalid brand Id"
            // })
        }
        // buat object kosongan untuk nimpa update
        const data : {name?: string, logo?: string} = {}
        // check nama
        if(name && name.toString().trim()){
            data.name = name.toString().trim()
        }
        // check logo
        if(logo && logo.toString().trim()){
            data.logo = logo.toString().trim()
        }

        // check apakah user ada ngubah atau data yang mau di update ? 
        if(Object.keys(data).length === 0){
            throw new ApiError(400, "No valid fields to update")
            // return res.status(400).json({
            //     message:"No valid fields to update"
            // })
        }

        const brandupdate = await prisma.brand.update({
            where: {id : Number(id)},
            data
        })

        return res.status(200).json({
            status:"success",
            message:"Success brand updated",
            data: brandupdate
            
        })

    } catch (error){
        next(error)
    }
}

// DELETE
// hapus brand tertentu - admin 
export const deleteBrand = async (req: Request, res: Response, next:NextFunction) => {
    try {
        // mencoba konfigurasi penulisan baru req.params
        const id = Number(req.params.id)
        // check validasi id
        if(isNaN(id)){
            throw new ApiError(400, "Invalid brand Id")
            // return res.status(400).json({
            //     message: "Invalid brand Id"
            // })
        }
        // jika ada brand yang kesambung dengan product
        const productLinked = await prisma.product.count({
            where: {brand_id : id}
        }) 
        // jika tidak ada maka dia nanti akan throw error
        if(productLinked > 0) {
            throw new ApiError(409, `${productLinked} product(s) linked to this brand`)
        }

        await prisma.brand.delete({
            where : {id}
        })

        return res.status(200).json({
            status:"success",
            message: "Success delete brand"
        })

    } catch (error){
        next(error)
    }
}

// GET - all 
// nampilin semua brand - admin & user
export const getAllBrand = async (req: Request, res: Response, next:NextFunction) => {
    try {

        const brands = await prisma.brand.findMany({
            orderBy: {name:"asc"}, 
            include: {products: true}
        })

        return res.status(200).json({
            status:"success",
            message: "success to get all data",
            data : brands
        })
    } catch (error){
        next(error)
    }
}

// GET by Id
// nampilin brand by id nya saja - admin & user
export const getBrandById = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const id = Number(req.params.id)

        if(isNaN(id)){
            throw new ApiError(400, "Invalid brand Id")
            // return res.status(400).json({
            //     message:"Invalid brand Id"
            // })
        }

        const brandById = await prisma.brand.findUnique({
            where : {id},
            include: {products: true}
        })

        if(!brandById){
            throw new ApiError(404, "Brand not found")
            // return res.status(404).json({
            //     message:"Brand not found"
            // })
        }

        return res.status(200).json({
            status:"success",
            message:"Success to get brand by Id", 
            data : brandById
        })

    } catch (error){
        next(error)
    }
}