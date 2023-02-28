import { AccountService } from '../services/account.service.js';
import { RegisterAccountSchema } from '../dto/Account/register-account.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { LoginAccountSchema } from '../dto/Account/login-account.js';
import { generateToken } from '../utils/jwt.js';
import { Role } from '../enums/auth.enum.js';

export const createAccountController = async (req, res, next) => {
  try {
    const { error, value } = RegisterAccountSchema.validate(req.body);

    value.avatar = 'image';
    value.roles = Role.USER;
    value.password = await hashPassword(value.password);
    await AccountService.createAccount(value);

    res.json({ message: 'Register account successfully', success: true });

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  } catch (e) {
    next(e);
  }
};

export const loginAccountController = async (req, res, next) => {
  try {
    const { error, value } = LoginAccountSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    const account = await AccountService.getAccountByEmail(value.email);
    if (!account) {
      return res.status(404).json({
        message: 'Account does not found',
      });
    }

    const isEqual = await verifyPassword(value.password, account.password);
    if (!isEqual) {
      return res.status(400).json({
        message: 'Password does not match',
      });
    }

    const { accessToken, refreshToken } = generateToken(account.email);

    const accountRes = { ...account.dataValues };
    delete accountRes.password;
    req.session.accessToken = accessToken;

    return res.json({
      accessToken,
      refreshToken,
      account: accountRes,
      success: true,
    });
  } catch (e) {
    next(e);
  }
};

export const logoutAccountController = async (req, res, next) => {
  try {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.json({
          message: 'Logout account successfully',
        });
      }
    });
  } catch (e) {
    next(e);
  }
};

export const test = async (req, res, next) => {
  console.log(req.user);

  res.json({ message: 'ok' });
};
