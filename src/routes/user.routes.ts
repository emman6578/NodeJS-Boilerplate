import { users } from "@controllers/user.controller/user.controller";
import { authenticateToken } from "@middlewares/authMiddleware";
import { authorizeRoles } from "@middlewares/roleMiddleware";
import { Router } from "express";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", authenticateToken, authorizeRoles([Role.MANAGER]), users);

export default router;
