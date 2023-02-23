import "express-async-errors";

import { Router } from "express";
import { createAccountController, loginAccountController, test } from "../controllers/Account.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { Role } from "../enums/auth.enum.js";

export const accountRouter = Router();

accountRouter.post("/register", createAccountController);
accountRouter.post("/login", loginAccountController);
accountRouter.get("/test", authMiddleware(), test);