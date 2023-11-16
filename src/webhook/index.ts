import express from "express";

import wooAuthenticationRouter from "./wooAuthentication.js";

const webhookRouter = express.Router();

webhookRouter.use("/webhook", wooAuthenticationRouter);

export default webhookRouter;