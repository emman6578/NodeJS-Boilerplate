import { successHandler } from "@utils/SuccessHandler";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

export const user = asyncHandler(async (req: Request, res: Response) => {
  // Simulate resource lookup
  const resourceFound = false; // change as needed

  if (!resourceFound) {
    throw new Error("Resource not found!");
  }

  const userData = { id: 1, name: "John Doe" };
  successHandler(userData, res, "GET", "User Date Successfully Retrieved");
});
