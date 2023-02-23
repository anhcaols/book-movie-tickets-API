import { AccountModel } from "../models/Account.model.js";
import httpStatus from "http-status";
import { ApiError } from "../api-error.js";
import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (role) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const payload = verifyToken(token);
    const user = await AccountModel.findOne({
      where: {
        username: payload.username
      },
      attributes: { exclude: ["password"] }
    });
    if (role) {
      if (!user.roles.includes(role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden resource");
      }
    }
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }

};