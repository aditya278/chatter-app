import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { allMessages, sendMessage } from "../controllers/message.controller";

const router = Router();

router.route('/').post(auth, sendMessage);
router.route('/:chatId').get(auth, allMessages);

export default router;