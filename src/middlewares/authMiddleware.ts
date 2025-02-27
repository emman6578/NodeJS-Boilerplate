//implement here authentication of middleware
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticateToken = expressAsyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];

    const token = authHeader?.split(" ")[1];
    if (!token) {
      throw new Error("No token attached to header");
    }

    //decode jwt token
    try {
      const payload = (await jwt.verify(token, JWT_SECRET!)) as {
        tokenId: string;
      };
      const dbToken = await prisma.token.findUnique({
        where: { id: payload.tokenId },
        include: { User: true },
      });

      if (!dbToken?.valid || dbToken.expiration < new Date()) {
        throw new Error("API token not valid or expired");
      }

      req.user = dbToken?.User!;
    } catch (error) {
      throw new Error("Unathorized");
    }
    next();
  }
);
