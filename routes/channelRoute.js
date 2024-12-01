import {Router} from "express";
import {verifyToken} from "../middleware/AuthMiddleware.js";
import ChannelController from "../controller/ChannelController.js";

const router = Router();

router.post('/channel/create-channel', verifyToken, ChannelController.createChannel);
router.get('/channel/get-channels', verifyToken, ChannelController.getChannels);

export default router