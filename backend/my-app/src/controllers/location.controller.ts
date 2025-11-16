import type { Request, Response, NextFunction} from "express";
import prisma from "../lib/prisma";
import { ApiError } from "../utils/apiError";

// CREATE
// buat lokasi baru - admin 
export const createLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {name} = req.body
        // check apakah udah ada nama 
        if(!name || !name.trim()){
            throw new ApiError(400, "Location name is requiered")
        }

        const newLocation = await prisma.location.create({
            data: {name : name.trim()}
        })

        return res.status(201).json({
            status:"success",
            message:"Success creaate new location",
            location: newLocation
        })
    } catch (error){
        next(error)
    }
}

// UPDATE
// update location - admin 
export const updateLocation = async (req: Request, res:Response, next:NextFunction) => {
    try {
        const {id} = req.params
        const {name} = req.body
        // check format id sudah benar atau belum
        if(isNaN(Number(id))){
            throw new ApiError(400, "Invalid location id Format")
        }
        // check apakah nama location ada atau kosong tidak (?)
        if(!name || !name.trim()){
            throw new ApiError(400, "Location name is requiered")
        }
        
        const updatedLocation = await prisma.location.update({
            where : {id : Number(id)},
            data: {name : name.trim()}
        })
    
        return res.status(200).json({
            status:"success",
            message:"Location updated successfully",
            location: updatedLocation
        })

    } catch (error){
        next(error)
    }
}

// DELETE
// untuk menghapus location - admin
export const deleteLocation = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const {id} = req.params
        // check apakah id nya valid atau gk ?
        if(isNaN(Number(id))){
            throw new ApiError(400, "Invalid Location Id format")
        }
        
        // check id location ada terhubung dengan product atau sebagainnya 
        const linkedLocation = await prisma.product.count({
            where : {location_id : Number(id)}
        })
        
        if(linkedLocation > 0){
            throw new ApiError(409, `Failed to delete location, because ${linkedLocation} product(s) linked to this location`)
        }

        await prisma.location.delete({
            where : {id : (Number(id))}
        })

        return res.status(200).json({
            status:"success",
            message: "Success to delete location"
        })

    } catch (error){
        next(error)
    }
}

// GET
// menampilkan semua location - admin & user 
export const getAllLocation = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const location = await prisma.location.findMany({
            orderBy: {name : "asc"}
        })

        return res.status(200).json({
            status:"success",
            message:"Success get all location",
            locations: location
        })
    } catch (error){
        next(error)
    }
}

// GET by id
// menampilkan hanya Id tertentu - admin & user
export const getLocationById = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const {id} = req.params
        // check format id
        if(isNaN(Number(id))){
            throw new ApiError(400, "Invalid location Id Format")
        }
        // check validasi apakah ada location dengan id tersebut
        const location = await prisma.location.findUnique({
            where : {id : Number(id)}
        })

        if(!location){
            throw new ApiError(404, "Location not Found")
        }
        
        return res.status(200).json({
            status:"success",
            message:"Success get location by Id",
            locations: location
        })

    } catch (error){
        next(error)
    }
}