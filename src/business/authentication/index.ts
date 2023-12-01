import express from "express";

import signup from "./sign-up.js";

const authRouter = express.Router();

authRouter.post("/auth/signup", signup);

export default authRouter;