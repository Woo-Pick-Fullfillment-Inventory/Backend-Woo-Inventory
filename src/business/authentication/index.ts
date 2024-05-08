import express from "express";

import { profileSetup } from "./profile-setup.js";
import { signin } from "./sign-in.js";
import { signup } from "./sign-up.js";
import { handleErrorFunction } from "../../modules/create-error-function.js";

const authRouter = express.Router();

authRouter.post("/api/v1/auth/signup", handleErrorFunction(signup));

authRouter.post("/api/v1/auth/signin", handleErrorFunction(signin));

authRouter.post("/api/v1/auth/profile-setup", handleErrorFunction(profileSetup));

export default authRouter;
