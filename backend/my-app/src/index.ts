import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from "cors";

import { errorHandler } from './middlewares/errorhandler.middleware';
import authRoutes from './routes/auth.route'; 
import productRoutes from './routes/product.route'
import categoryRoutes from './routes/category.route'
import locationRoutes from './routes/location.route'
import brandRoutes from './routes/brand.route'
import orderRoutes from "./routes/order.route"

// === Load environment variable ===
dotenv.config();


// === Inisialisasi express app ===
const app = express();

// === Konfigurasi port ===
const PORT = process.env.PORT || 8080;

// === Middleware global ===
// a. aktifkan CORS biar frontend (Next.js) bisa akses backend
app.use(cors())

// b. parsing request body (JSON & URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === Route dasar (Testing API jalan atau gk) ===
app.get('/', (req: Request, res: Response)=> {
    res.status(200).send("halobenaya testing API")
    
})

// === Route Backend ===
// 1. Login
app.use('/api/auth', authRoutes)
// 1a. Register
app.use('/api/register', authRoutes)
// 2. CRUD dashboard
app.use('/api/products', productRoutes)
// 3. CRUD category
app.use('/api/categories', categoryRoutes)
// 4. CRUD location
app.use('/api/locations', locationRoutes)
// 5. CRUD brand
app.use('/api/brand', brandRoutes)
// 6. Order
app.use("/orders", orderRoutes);


app.use((req: Request, res:Response) => {
    res.status(404).json({
        status:"error",
        message:"Route not found"
    })
})

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
