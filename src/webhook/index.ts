import express from "express";

//import wooAuthenticator from "./woo-authentication.js";

const webhookRouter = express.Router();

webhookRouter.use("/webhook/wc-auth", (_req, res) => {
  res.send("Webhook is listening...");
});

export default webhookRouter;
