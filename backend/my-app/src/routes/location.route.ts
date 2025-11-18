import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/admin.middleware";
import { createLocation,deleteLocation, updateLocation, getAllLocation, getLocationById } from "../controllers/location.controller"

const router = Router()

// GET all - admin & user
router.get("/", getAllLocation)
// GET by Id - admin & user
router.get("/:id", getLocationById)

// CREATE - admin
router.post("/", requireAuth, requireAdmin, createLocation)
// UPDATE - admin 
router.put("/:id", requireAdmin, requireAuth, updateLocation)
// DELETE - admin 
router.delete("/:id", requireAdmin, requireAuth, deleteLocation)

export default router