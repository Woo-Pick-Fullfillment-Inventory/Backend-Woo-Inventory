import express from "express";

import signup from "./sign-up.js";
import { use } from "../../util/errorFunction.js";

const authRouter = express.Router();

authRouter.post("/auth/signup", use(signup));

export default authRouter;