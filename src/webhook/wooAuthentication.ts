//import database from "../repository/postgres/index.js";

import type {
  Request,
  Response,
} from "express";

const wooAuthenticator = (req: Request, res: Response) => {
  console.log(req.body);
  res.send("Webhook is listening...");
};

export default wooAuthenticator;