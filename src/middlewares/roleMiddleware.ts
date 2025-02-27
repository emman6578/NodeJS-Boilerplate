import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { Role } from "@prisma/client";
import { AuthRequest } from "./authMiddleware";

//Guide for Implementation:
/**
 *        authorizeRoles([Role.MANAGER, Role.USER])      - User Access Routes
 *        authorizeRoles([Role.MANAGER])                 - Manager Access Routes
 *        authorizeRoles([])                             - Admin Access Routes
 */

export const authorizeRoles = (allowedRoles: Role[]) =>
  expressAsyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      // Ensure that the user is attached from the auth middleware
      if (!req.user || !req.user.role) {
        res
          .status(401)
          .json({ message: "User role not found or user not authenticated" });
        return;
      }

      // If user is ADMIN, always allow
      if (req.user.role === Role.ADMIN) {
        return next();
      }

      // Check if the user's role is included in the allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        res
          .status(403)
          .json({ message: "Access forbidden: Insufficient rights" });
        return;
      }

      next();
    }
  );
