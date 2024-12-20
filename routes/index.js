
import { Router } from "express";
import AuthRoutes from "./authRoute.js"
import ProfileRoutes from "./profileRoute.js"
import ContactsRoutes from "./contactsRoutes.js"
import MessagesRoutes from "./messagesRoute.js"
import ChannelRoutes from "./channelRoute.js"
// import UserRoutes from "./userRoutes.js"

const router = Router()

router.use("/api", AuthRoutes)
router.use("/api", ProfileRoutes)
router.use("/api", ContactsRoutes)
router.use("/api", MessagesRoutes)
router.use("/api", ChannelRoutes)
// router.use("/api", UserRoutes)

export default router