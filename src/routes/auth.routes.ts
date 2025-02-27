import { Router } from "express";
import {
  authenticate,
  login,
  register,
} from "@controllers/auth.controller/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/code", authenticate);

export default router;
