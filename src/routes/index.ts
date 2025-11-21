import { Router } from "express";
import authroute from "./auth.route";
import userroute from "./user.route";

const router = Router();

export default (): Router => {
  authroute(router);
  userroute(router);
  return router;
}