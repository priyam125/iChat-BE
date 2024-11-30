import {Router} from "express";
import ContactsController from "../controller/ContactsController.js"
import {verifyToken} from "../middleware/AuthMiddleware.js";

const router = Router();

router.post('/conatcts/search', verifyToken, ContactsController.searchContacts);
router.get('/conatcts/get-contacts-for-dm', verifyToken, ContactsController.getContactsForDmList);

export default router