import express from "express";

import { signin } from "./sign-in.js";
import { signup } from "./sign-up.js";
import { handleErrorFunction } from "../../modules/create-error-function.js";

const authRouter = express.Router();

authRouter.post("/auth/signup", handleErrorFunction(signup));

authRouter.post("/auth/signin", handleErrorFunction(signin));

export default authRouter;