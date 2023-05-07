import { Router } from "express";
import { listUsers } from "../controllers/user.controller";

const router = Router();

router.get('/', listUsers);

export default router;