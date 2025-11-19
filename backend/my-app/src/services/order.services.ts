import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { CreateOrderInput, OrderProductInput } from "../types/order.type";
import { randomInt } from "crypto"


// generate ID
const generateOrderCode = () => {
    const randomNumber = randomInt(10000000, 99999999)
    return `ID${Date.now()}${randomNumber}`
}

// ubah bigInt jadi string biar tidak error
const bigIntToString = (value :any) =>{
    if(typeof value === "bigint"){
        return value.toString()
    } else {
        return value
    }
}

export const OrderService = {
    // === FUNSI CREATE ORDER ===
    createOrder : async (input : CreateOrderInput) => {

        // --- CHECK KELENGKAPAN DETAIL INPUTAN ---
        const {user_id, products, detail} = input
        // check user id nya ada tidak 
        if (!user_id){
            throw new ApiError(401, "Missing user Id")
        }
        // check apakah produk yang mau di order itu ada atau tidak
        if (!products || !Array.isArray(products) || products.length === 0){
            throw new ApiError(400, "Products cannot be empty")
        } 
        // validasi apakah product dalam array product itu valid atau gk 
        for (const item of products){
            if(!item.product_id || isNaN(Number(item.product_id))){
                throw new ApiError(400, "product_id must be a valid")
            }
            if(!item.quantity || isNaN(Number(item.quantity)) || item.quantity <= 0){
                throw new ApiError(400, "quantity must be a positive number")
            }
        }
        // check detail order itu harus complit
        if(!detail){
            throw new ApiError(400, "Order detail is required")
        }

        // validasi detail order
        const {name, phone, address, city, postal_code} = detail
        // validasi anakan detail order : name, phone, address, city, postal_code
        if (!name.trim()){
            throw new ApiError(400, "Name is required")
        }
        if (!phone.trim()){
            throw new ApiError(400, "Phone is required")
        }
        if (!address.trim()){
            throw new ApiError(400, "Address is required")
        }
        if (!city.trim()){
            throw new ApiError(400, "City is required")
        }
        if (!postal_code.trim()){
            throw new ApiError(400, "Postal Code is required")
        }


        // --- CHECK PRODUK DI DATABASE 
        // tentukan product id yang mau di check
        const products_id = products.map(prod => prod.product_id)

        const foundProducts = await prisma.product.findMany({
            where : {id : {in : products_id}},
            select : {
                id: true,
                price: true,
                name: true,
            }
        })

        // check missing product
        const valid_ids = new Set(foundProducts.map(findprod => findprod.id))
        const missing = products_id.filter(id => !valid_ids.has(id))

        if(missing.length > 0){
            throw new ApiError(404, `Products not found: ${missing.join(", ")}`)
        }

        // --- HITUNG TOTAL DAN SUBTOTAL ---
        let total = BigInt(0)

        const orderProductsData = products.map((item) => {
            const found = foundProducts.find(fp => fp.id === item.product_id)
        
            if (!found) {
                throw new ApiError(404, `Product with id ${item.product_id} not found`)
            }
            
            const price = BigInt(found.price)
            const qty = BigInt(item.quantity)
            const sub_total = price * qty

            total = total + sub_total

            return {
                produt: {
                    connect: { id: item.product_id }
                },
                quantity: item.quantity,
                sub_total: sub_total
            }
            
        })

        // --- GENERATE CODE ---
        const code = generateOrderCode()

        // CREATE ORDER 
        const createdOrder = await prisma.orders.create({
            data: {
                user_id,
                code,
                total,
                status: "pending",
                // buat order detail 
                order_detail: {
                    create : detail
                },
                // buat order product
                order_product:{
                    create: orderProductsData,
                }
            },
            include : {
                order_detail: true,
                order_product: {
                    include: {
                        produt: true
                    }
                }
            }
        })

        // --- RETURN DAN CONVERT BIGINT KE STRING
        return {
            ...createdOrder,
            total : bigIntToString(createdOrder.total),
            order_product : createdOrder.order_product.map(op => ({
                ...op,
                sub_total: bigIntToString(op.sub_total)
            }))
        }
    }
}