import { Router } from "express";
import { authenticateUser, registerUser } from "../controllers/user.controller";

const router = Router();

router.route('/').post(registerUser);
router.route('/login').post(authenticateUser);

export default router;