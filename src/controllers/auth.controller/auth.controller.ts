import { successHandler } from "@utils/SuccessHandler/SuccessHandler";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

//Services Imports
import { registerUser } from "@services/auth.services/register.service";
import { loginUser } from "@services/auth.services/login.service";
import { authenticateUser } from "@services/auth.services/authenticate.service";

export const register = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = req.body;
    const createdUser = await registerUser(user);
    if (!createdUser) {
      throw new Error("Error creating user.");
    }
    successHandler(createdUser, res, "POST", "User Created Successfully");
  }
);

export const login = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const tokenData = await loginUser(email, password);
    successHandler(tokenData, res, "POST", "Code sent successfully");
  }
);

export const authenticate = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email, emailToken } = req.body;
    // Call the business logic function to perform authentication
    const authToken = await authenticateUser(email, emailToken);
    // Send the authentication token as the response
    res.json({ authToken });
  }
);
