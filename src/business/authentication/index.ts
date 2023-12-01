import express from "express";

import signup from "./sign-up.js";

const authRouter = express.Router();

authRouter.post("/auth", signup);

export default authRouter;