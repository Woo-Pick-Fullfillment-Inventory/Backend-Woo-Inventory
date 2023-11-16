import express from "express";

import type {
  Request,
  Response,
} from "express";

const wooAuthenticationRouter = express.Router();

wooAuthenticationRouter.post("/wc-auth/authentication", (req: Request, res: Response) => {
  console.log(req.body);
  res.send("Webhook is listening...");
});

export default wooAuthenticationRouter;