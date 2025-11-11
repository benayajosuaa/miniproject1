import type { Response, Request } from "express";
import prisma from "../lib/prisma";

// CREATE 
// membuat daftar sebuah product
export const createProduct = async (req: Request, res: Response) => {
    try { 
        // buat daftar identitas
        const {brand_id, category_id, location_id, name, description, price, images, stock} = req.body
        // validasi 
        if (!brand_id || !category_id || !location_id || !name || !description || !price || !stock){
            return res.status(400).json({
                message: "Missing required fields"
            })
        }
        // check condition images gk boleh bolong atau kosong gitu
        if(!images || !Array.isArray(images) || images.length === 0){
            return res.status(400).json({ 
                message: "Images field must be a non-empty array"
            });
        }  

        // buat product baru 
        const newProduct = await prisma.product.create({
            data: {
                brand_id: Number(brand_id),
                category_id: Number(category_id),
                location_id: Number(location_id),
                name,
                description, 
                price: BigInt(price),
                images,
                stock
            }
        })

        // === Tambahan untuk hindari BigInt JSON error ===
        const sanitizedProduct = {
            ...newProduct,
            price: Number(newProduct.price),
        };

        res.status(201).json({
            message: "Product Created Successfully",
            product: sanitizedProduct
        })
            
    } catch (error : any){
        console.error("Error creating product", error)
        return res.status(500).json({
            message:"Failed to create product"
        })
    }
}

// UPDATE
// meng-update / edit product yang ada
export const updateProduct = async (req: Request, res: Response) => {
    try {
        // inisiasi id yang mau di update
        const {id} = req.params
        // basis data pusat
        const data = req.body

        // untuk menemukan productnya
        const product = await prisma.product.findUnique({
            where: {id: Number(id)}
        })

        // jika product yang dicari gk ada
        if(!product){
            return res.status(404).json({
                message:"Product not found"
            })
        }

        // check status product harus antara ready dan preorder
        if(data.stock && !["ready", "preorder"].includes(data.stock)){
            return res.status(400).json({
                message: "Invalid stock value. Must be either 'ready' or 'preorder'.",
            });
        }

        // lakukan update dengan konversi tipe sesuai schema
        // jika ada maka
        const updated = await prisma.product.update({
            where: {id:Number(id)},
            data: {
                ...(data.name && {name: data.name}),
                ...(data.description && {description: data.description}),
                ...(data.stock && {stock: data.stock as any}),
                ...(data.images && {images: data.images}),
                ...(data.brand_id && {brand_id: Number(data.brand_id)}),
                ...(data.category_id && {category_id: Number(data.category_id)}),
                ...(data.location_id && {location_id: Number(data.location_id)})
            }
        })

        const sanitized = {
            ...updated,
            price: Number(updated.price),
        };


        res.status(200).json({
            message:"Success to update product",
            product: sanitized
        })
    } catch (error : any){
        console.error("Error updating product", error)
        return res.status(500).json({
            message:"Failed to update product"
        })
    }
}


// DELETE
// menghapus product yang ada
export const deleteProduct = async (req: Request, res: Response) => {
    try {

        // inisiasi variable
        const {id} = req.params

        // insiasi untuk menemukan product tersebut
        const product = await prisma.product.findUnique({
            where: {id:Number(id)}
        })

        // check apakah ada gk product dengan id tersebut
        if(!product){
            return res.status(404).json({
                message: "Product not found"
            })
        }

        await prisma.product.delete({
            where: {id:Number(id)}
        })

        res.status(200).json({
            message:"Success to delete product"
        })

    } catch (error : any){
        console.error("Error deleting product", error)
        return res.status(500).json({
            message:"Failed to delete product"
        })
    }
}


// GET
// ambil semua product
export const getAllProduct = async (req: Request, res: Response) => {
    try {
        const product = await prisma.product.findMany({
        include: { brand: true, category: true, location: true }
        });

        // ← tambahkan ini
        const sanitized = product.map(p => ({
        ...p,
        price: Number(p.price),
        }));

        res.status(200).json({
        message: "Success get all product",
        products: sanitized, // ← pakai yang sudah disanitasi
        });
    } catch (error: any) {
        console.error("Error read all product", error);
        return res.status(500).json({ message: "Failed to read product" });
    }
};


// GET : id
// ambil product berdasarkan id saja
export const getProductbyId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: { brand: true, category: true, location: true }
        });

        if (!product) {
        return res.status(404).json({ message: "Product not found" });
        }

        // ← tambahkan ini
        const sanitized = {
        ...product,
        price: Number(product.price),
        };

        res.status(200).json({
        message: "Success get product",
        product: sanitized, // ← kirim yang sudah disanitasi
        });
    } catch (error: any) {
        console.error("Error get product", error);
        return res.status(500).json({ message: "Failed to get product by id" });
    }
};

