import express from "express";

import wooAuthenticator from "./woo-authentication.js";

const webhookRouter = express.Router();

webhookRouter.use("/wc-auth", wooAuthenticator);

export default webhookRouter;