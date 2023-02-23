import dotenv from "dotenv";

dotenv.config();

export const GlobalConfig = {
  port: process.env.PORT,
  secretKey: process.env.SECRET_KEY

};