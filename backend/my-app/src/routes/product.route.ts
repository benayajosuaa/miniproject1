import { Router } from "express";

import { createProduct, updateProduct, deleteProduct, getAllProduct, getProductbyId } from "../controllers/product.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/admin.middleware";

const router = Router()

// create product(admin)
router.post("/", requireAuth, requireAdmin, createProduct)
// update product by id (admin)
router.put("/:id", requireAuth, requireAdmin, updateProduct)
// delete product by id (admin)
router.delete("/:id", requireAuth, requireAdmin, deleteProduct)

// get all product (public)
router.get("/", getAllProduct)
// get product by id (public)
router.get("/:id", getProductbyId)


export default router