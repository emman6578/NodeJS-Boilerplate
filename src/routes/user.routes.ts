import { Router } from "express";
import { user } from "@controllers/user.controller";

const router = Router();

router.get("/user", user);

export default router;
