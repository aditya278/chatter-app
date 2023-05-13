import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } from "../controllers/chat.controller";

const router = Router();

router.route('/').post(auth, accessChat).get(auth, fetchChats);
router.route('/group').post(auth, createGroupChat);
router.route('/rename').put(auth, renameGroup);
router.route('/groupremove').put(auth, removeFromGroup);
router.route('/groupadd').put(auth, addToGroup);

export default router;