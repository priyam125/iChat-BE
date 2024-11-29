import {Router} from "express";
import {verifyToken} from "../middleware/AuthMiddleware.js";
import MessagesController from "../controller/MessagesController.js"

const router = Router();

router.post('/messages/get-messages', verifyToken, MessagesController.getMessages);

export default router