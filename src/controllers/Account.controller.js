import { AccountService } from "../services/Account.service.js";
import { RegisterAccountSchema } from "../dto/Account/RegisterAccount.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { LoginAccountSchema } from "../dto/Account/LoginAccount.js";
import { generateToken } from "../utils/jwt.js";


export const createAccountController = async (req, res, next) => {
  try {
    const { error, value } = RegisterAccountSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.message
      });
    }

    value.password = await hashPassword(value.password);
    await AccountService.createAccount(value);
    res.json({ message: "ok" });

  } catch (e) {
    next(e);
  }


};


export const test = async (req, res, next) => {

  console.log(req.user);

  res.json({ message: "ok" });


};


export const loginAccountController = async (req, res, next) => {
  try {

    const { error, value } = LoginAccountSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.message
      });
    }
    const account = await AccountService.getAccountByUsername(value.username);

    if (!account) {
      return res.status(404).json({
        message: "Account does not found"
      });
    }

    const isEqual = await verifyPassword(value.password, account.password);

    if (!isEqual) {
      return res.status(400).json({
        message: "Password does not match"
      });
    }


    const { accessToken, refreshToken } = generateToken(account.username);

    const accountRes = { ...account.dataValues };
    delete accountRes.password;

    return res.json({
      account: accountRes,
      accessToken,
      refreshToken
    });

  } catch (e) {
    next(e);
  }
};
