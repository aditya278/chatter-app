import { Router } from "express";
import { authenticateUser, registerUser, searchUser } from "../controllers/user.controller";
import { auth } from "../middlewares/auth.middleware";

const router = Router();

router.route('/').post(registerUser).get(auth, searchUser);
router.route('/login').post(authenticateUser);

export default router;