import express from "express";

import createUrl from "./create-url.js";

const authRouter = express.Router();

authRouter.post("/auth", createUrl);

export default authRouter;