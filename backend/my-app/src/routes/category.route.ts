import { Router } from "express";

import { requireAuth,  } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/admin.middleware";

import { createCategory, updateCategory, deleteCategory, getAllCategory, getCategoryById } from "../controllers/category.controll";

const router = Router()
// get all category - admin & user
router.get("/", getAllCategory)
// get category by id - admin & user
router.get("/:id", getCategoryById)

// create category - admin
router.post("/", requireAuth, requireAdmin, createCategory)
// update category - admin
router.put("/", requireAuth, requireAdmin, updateCategory)
// delete category - admin
router.delete("/:id", requireAuth, requireAdmin, deleteCategory)


export default router