import { Router } from "express";
import { createOrder, getAllOrder, getMyOrder, getOrderById, updateOrderStatus} from "../controllers/order.controller";
import { requireAdmin } from "../middlewares/admin.middleware";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();


// CREATE ORDER - user
router.post("/", requireAuth, createOrder);

// GET MY ORDERS - user
router.get("/my-orders", requireAuth, getMyOrder);

// GET ORDER BY ID - admin & user
router.get("/:id", requireAuth, getOrderById);

// GET ALL ORDERS - ADMIN 
router.get("/", requireAuth, requireAdmin, getAllOrder);

// UPDATE ORDER STATUS - ADMIN 
router.patch("/:id/status", requireAuth, requireAdmin, updateOrderStatus);

export default router;
