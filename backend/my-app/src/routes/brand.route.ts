import { Router } from "express";
import {requireAuth} from "../middlewares/auth.middleware"
import {requireAdmin} from "../middlewares/admin.middleware"
import {createBrand, updateBrand, deleteBrand, getAllBrand, getBrandById} from "../controllers/brand.controller"


const router = Router()

// GET - admin & user
router.get("/", getAllBrand)
// GET by id - admin & user
router.get("/:id", getBrandById)

// CREATE - admin 
router.post("/", requireAuth, requireAdmin, createBrand)
// UPDATE - admin 
router.put("/:id", requireAuth, requireAdmin, updateBrand)
// DELETE - admin 
router.delete("/:id", requireAuth, requireAdmin, deleteBrand)


export default router

