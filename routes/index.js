
import { Router } from "express";
import AuthRoutes from "./authRoute.js"
import ProfileRoutes from "./profileRoute.js"
// import UserRoutes from "./userRoutes.js"

const router = Router()

router.use("/api", AuthRoutes)
router.use("/api", ProfileRoutes)
// router.use("/api", UserRoutes)

export default router