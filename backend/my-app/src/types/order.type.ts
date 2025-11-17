// untuk product input
export interface OrderProductInput {
    product_id  : number
    quantity    : number
}

// detail order inputnya 
export interface OrderDetailInput {
    name        : string
    phone       : string
    address     : string
    city        : string
    postal_code : string
    notes?      : string
}

// create order input
export interface CreateOrderInput {
    user_id     : number
    products    : OrderProductInput[]
    detail      : OrderDetailInput
}
