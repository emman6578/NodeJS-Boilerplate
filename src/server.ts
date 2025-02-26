import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

//Routes Imports
import UserRoutes from "@routes/user.routes";

//Error Handler
import { errorHandler, notFound } from "@utils/ErrorHandler";
import { successHandler } from "@utils/SuccessHandler";

//env config
dotenv.config();

//constants
const server = express();
const port = process.env.PORT || 3001;

//middlewares
server.use(express.json());
server.use(helmet());
server.use(cors());

//routes import
server.use("/api/v1/", UserRoutes);

//Welcome Route Info about this codebase
server.get("/", (req: Request, res: Response) => {
  successHandler("NodeJS Boilerplate", res, "GET", "Success Main Route");
});

//error handler
server.use(notFound);
server.use(errorHandler);

server.listen(port, () => {
  console.log(`[Server] running on port http://localhost:${port}`);
});
