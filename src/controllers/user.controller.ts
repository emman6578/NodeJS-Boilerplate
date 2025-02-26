import { successHandler } from "@utils/SuccessHandler";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const user = asyncHandler(async (req: Request, res: Response) => {
  const userData = await prisma.user.findFirst({});

  // Simulate error
  const resourceFound = true; // change as needed

  if (!resourceFound) {
    throw new Error("Resource not found!");
  }

  successHandler(userData, res, "GET", "User Data Successfully Retrieved");
});
