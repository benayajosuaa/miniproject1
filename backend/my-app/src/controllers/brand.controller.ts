import type {Request, Response} from "express"
import prisma from "../lib/prisma"

// CREATE 
// buat nama brand - admin 
export const createBrand = async (req: Request, res: Response) => {
    try {

        const {name, logo} = req.body
        // check name harus ada
        if (!name || !name.trim()){
            return res.status(400).json({
                message:"Brand name is required"
            })
        }
        // check logo harus ada
        if(!logo || !logo.trim()){
            return res.status(400).json({
                message:"Brand logo is required"
            })
        }
        // buat brandnya
        const brand = await prisma.brand.create({
            data : {
                name : name.trim(),
                logo : logo.trim()
            }
        })

        return res.status(200).json({
            message:"Brand created",
            newBrand: brand
        })
    } catch (error : any){
        console.error("Error creating new brand", error)
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

// UPDATE 
// update kalau brand mau di ubah - admin 
export const updateBrand = async (req: Request, res:Response) => {
    try {
        // tentukan id dan juga entitas brandnya
        const {id} = req.params
        const {name, logo} = req.body

        if(isNaN(Number(id))){
            return res.status(400).json({
                message:"Invalid brand Id"
            })
        }

        const brand = await prisma.brand.update({
            where : {id: Number(id)},
            data : {
                name : name?.trim(),
                logo: logo?.trim()
            }
        })

        return res.status(200).json({
            message:"Success brand updated",
            data : brand
        })


    } catch (error : any){
        console.error("Error update brand", error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// DELETE
// hapus brand tertentu - admin 
export const deleteBrand = async (req: Request, res: Response) => {
    try {
        // mencoba konfigurasi penulisan baru req.params
        const id = Number(req.params.id)
        // check validasi id
        if(isNaN(id)){
            return res.status(400).json({
                message: "Invalid brand Id"
            })
        }
        
        await prisma.brand.delete({
            where : {id}
        })

        return res.status(200).json({
            message: "Success delete brand"
        })

    } catch (error : any){
        console.error("Error to delete product", error)
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

// GET - all 
// nampilin semua brand - admin & user
export const getAllBrand = async (req: Request, res:Response) => {
    try {

        const brands = await prisma.brand.findMany({
            orderBy: {name:"asc"}, 
            include: {products: true}
        })

        return res.status(200).json({
            message: "success to get all data",
            data : brands
        })
    } catch (error : any){
        console.error("Error to read all brand", error)
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

// GET by Id
// nampilin brand by id nya saja - admin & user
export const getBrandById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)

        if(isNaN(id)){
            return res.status(404).json({
                message:"Id not found"
            })
        }

        const brandById = await prisma.brand.findUnique({
            where : {id},
            include: {products: true}
        })

        return res.status(200).json({
            message:"Success to get product by Id"
        })

    } catch (error : any){
        console.error("Error read product by id", error)
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}