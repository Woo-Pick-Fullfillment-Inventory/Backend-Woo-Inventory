import express from "express";

import signin from "./sign-in.js";
import signup from "./sign-up.js";
import { use } from "../../modules/create-error-function.js";

const authRouter = express.Router();

authRouter.post("/auth/signup", use(signup));

authRouter.post("/auth/signin", use(signin));

export default authRouter;