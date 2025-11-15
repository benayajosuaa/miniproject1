import type { Request, Response } from "express";
import prisma from "../lib/prisma";

// CREATE
// buat lokasi baru - admin 
export const createLocation = async (req: Request, res: Response) => {
    try {
        const {name} = req.body
        // check apakah udah ada nama 
        if(!name || !name.trim()){
            return res.status(400).json({
                message:"Location name is required"
            })
        }

        const newLocation = await prisma.location.create({
            data: {name : name.trim()}
        })

        return res.status(201).json({
            message:"Success creaate new location",
            location: newLocation
        })
    } catch (error : any){
        console.error("Error creating Location", error)
        return res.status(500).json({
            message:"Failed to create location"
        })
    }
}

// UPDATE
// update location - admin 
export const updateLocation = async (req: Request, res:Response) => {
    try {
        const {id} = req.params
        const {name} = req.body
        // check format id sudah benar atau belum
        if(isNaN(Number(id))){
            return res.status(400).json({
                message:"Invalid location id format"
            })
        }
        // check apakah nama location ada atau kosong tidak (?)
        if(!name || !name.trim()){
            return res.status(400).json({
                message:"Location name is required"
            })
        }
        // check apakah nama location itu ada atau gk sebelumnya ?
        const found = await prisma.location.findUnique({
            where : {id : Number(id)}
        })
        // jika tidak ada
        if (!found){
            return res.status(404).json({
                message:"Location not found"
            })
        }
        // jika ada maka update location
        const updatedLocation = await prisma.location.update({
            where : {id : Number(id)},
            data: {name : name.trim()}
        })
    
        return res.status(200).json({
            message:"Location updated successfully",
            location: updatedLocation
        })

    } catch (error : any){
        console.error("Error updating location", error)
        return res.status(500).json({
            message:"Failed to update the location"
        })
    }
}

// DELETE
// untuk menghapus location - admin
export const deleteLocation = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        // check apakah id nya valid atau gk ?
        if(isNaN(Number(id))){
            return res.status(400).json({
                message:"Invalid Location Id format"
            })
        }
        // check apakah id itu ada atau gk 
        const foundId = await prisma.location.findUnique({
            where : {id : Number(id)}
        })
        
        if(!foundId){
            return res.status(404).json({
                message: "Location Id not Found"
            })
        }

        // check id location ada terhubung dengan product atau sebagainnya 
        const linkedLocation = await prisma.product.count({
            where : {location_id : Number(id)}
        })
        
        if(linkedLocation > 0){
            return res.status(409).json({
                message:`Failed to delete location, because ${linkedLocation} product(s) linked to this location`
            })
        }

        await prisma.location.delete({
            where : {id : (Number(id))}
        })

        return res.status(200).json({
            message: "Success to delete location"
        })

    } catch (error : any) {
        console.error("Error deleting location", error)
        return res.status(500).json({
            message: "Failed to detele location"
        })
    }
}

// GET
// menampilkan semua location - admin & user 
export const getAllLocation = async (req: Request, res: Response) => {
    try {
        const location = await prisma.location.findMany({
            orderBy: {name : "asc"}
        })

        return res.status(200).json({
            message:"Success get all location",
            locations: location
        })
    } catch (error : any){
        console.error("Error to read location", error)
        return res.status(500).json({
            message:"Failed to get All location"
        })
    }
}

// GET by id
// menampilkan hanya Id tertentu - admin & user
export const getLocationById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        // check format id
        if(isNaN(Number(id))){
            return res.status(400).json({
                message: "Invalid location Id Format"
            })
        }
        // check validasi apakah ada location dengan id tersebut
        const location = await prisma.location.findUnique({
            where : {id : Number(id)}
        })

        if(!location){
            return res.status(404).json({
            messsage:"Location not Found"    
            })
        }
        
        return res.status(200).json({
            message:"Success get location by Id",
            location
        })

    } catch (error : any){
        console.error("Error read location by id", error)
        return res.status(500).json({
            message: "Failed to get location"
        })
    }
}