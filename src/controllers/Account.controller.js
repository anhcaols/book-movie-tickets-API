import { AccountService } from '../services/account.service.js';
import { RegisterAccountSchema } from '../dto/account/register-account.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { LoginAccountSchema } from '../dto/account/login-account.js';
import { generateToken } from '../utils/jwt.js';
import { Role } from '../enums/auth.enum.js';

export const createAccountController = async (req, res, next) => {
  try {
    const { error, value } = RegisterAccountSchema.validate(req.body);

    value.avatar = 'image';
    value.role = Role.USER;
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
    req.session.accessToken = accessToken;

    return res.json({
      accessToken,
      refreshToken,
      account: {
        id: account.dataValues.id,
        fullName: account.dataValues.full_name,
        email: account.dataValues.email,
        phoneNumber: account.dataValues.phone_number,
        gender: account.dataValues.gender,
        dateOfBirth: account.dataValues.date_of_birth,
        avatar: account.dataValues.avatar,
        role: account.dataValues.role,
      },
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

export const getAccountByAccessTokenController = async (req, res, next) => {
  try {
    res.json({
      account: {
        id: req.user.dataValues.id,
        fullName: req.user.dataValues.full_name,
        email: req.user.dataValues.email,
        phoneNumber: req.user.dataValues.phone_number,
        gender: req.user.dataValues.gender,
        dateOfBirth: req.user.dataValues.date_of_birth,
        avatar: req.user.dataValues.avatar,
        role: req.user.dataValues.role,
      },
      success: true,
    });
  } catch (e) {
    next(e);
  }
};

export const uploadAvatarController = async (req, res, next) => {
  try {
    res.send('File uploaded successfully!');
  } catch (e) {
    next(e);
  }
};

export const test = async (req, res, next) => {
  console.log(req.user);

  res.json({ message: 'ok' });
};
