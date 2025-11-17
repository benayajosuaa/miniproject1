import { Router } from "express";
import { loginController, registerController } from "../controllers/auth.controller";
import { requireAuth, AuthRequest } from "../middlewares/auth.middleware";

const router = Router()

router.post("/login", loginController)
router.post("/register", registerController)

router.get("/me", requireAuth, (req: AuthRequest, res) => {
    res.status(200).json({
        message:"Welcome",
        user: req.user
    })
})

export default router