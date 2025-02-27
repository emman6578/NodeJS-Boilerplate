import { successHandler } from "@utils/SuccessHandler/SuccessHandler";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

//Services Imports

export const users = expressAsyncHandler(
  async (req: Request, res: Response) => {
    successHandler(
      "Hello Authenticated User",
      res,
      "POST",
      "Successfully fetched all the users"
    );
  }
);
