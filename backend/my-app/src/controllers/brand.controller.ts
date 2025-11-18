import type {Request, Response, NextFunction} from "express"
import prisma from "../lib/prisma"
import { ApiError } from "../utils/apiError"


// CREATE 
// buat nama brand - admin 
export const createBrand = async (req: Request, res: Response, next:NextFunction) => {
    try {

        const {name, logo} = req.body
        if (!name || !name.trim()){
            throw new ApiError(400,"Brand name is required")
        }

        if(!logo || !logo.trim()){
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
// buat pagination + search
export const getAllBrand = async (req: Request, res: Response, next:NextFunction) => {
    try {
        // ambil query dari URL
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const search = req.query.search?.toString() || ""

        // hitung data yang perlu di skip 
        const skip = (page - 1) * limit

        // buat object filter where 
        const whereClause : any = {}
        // buat filter search 
        if(search){
            whereClause.name = {
                contains: search,
                mode: "insensitive"
            }
        }
        
        const totalItems = await prisma.brand.count({
            where: whereClause
        })

        const brands = await prisma.brand.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: {name:"asc"}, 
            include: {products: true}
        })

        // hitung total halaman 
        const totalPages = Math.ceil(totalItems/limit)
    
        return res.status(200).json({
            status:"success",
            message: "success to get all data",
            pagination : {
                currentPage : page,
                totalPages,
                totalItems,
                limit
            },
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
        }

        const brandById = await prisma.brand.findUnique({
            where : {id},
            include: {products: true}
        })

        if(!brandById){
            throw new ApiError(404, "Brand not found")
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