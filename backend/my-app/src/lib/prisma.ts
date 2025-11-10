// import {PrismaClient} from "@prisma/client"
// import { glob } from "fs"

// let prisma : PrismaClient

// declare const globalThis : {
//     prisma : PrismaClient
// }

// if (process.env.NODE_ENV === "production"){
//     prisma = new PrismaClient()
// } else {
//     if(!globalThis.prisma){
//         globalThis.prisma = new PrismaClient()
//     }
//     prisma= globalThis.prisma
// }


// export default prisma


import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;