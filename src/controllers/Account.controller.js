import { accountsService } from '../services/account.service.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { Role } from '../enums/auth.enum.js';
import { LoginAccountSchema, RegisterAccountSchema, UpdateAccountSchema } from '../dto/account.js';
import { ApiError } from '../api-error.js';
import httpStatus from 'http-status';

export const createAccountController = async (req, res, next) => {
  try {
    const { error, value } = RegisterAccountSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }
    if (value.role === 'admin') {
      value.role = Role.ADMIN;
    } else if (value.role === 'staff') {
      value.role = Role.STAFF;
    } else {
      value.role = Role.USER;
    }
    value.password = await hashPassword(value.password);
    const accountByEmail = await accountsService.getAccountByEmail(value.email);
    const accountByPhone = await accountsService.getAccountByPhoneNumber(value.phone_number);
    if (accountByEmail || accountByPhone) {
      return res.status(404).json({
        message: 'Existing account',
        status: 404,
      });
    }

    await accountsService.createAccount({ ...value });
    const account = await accountsService.getAccountByEmail(value.email);
    res.json({
      message: 'Register account successfully',
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

export const loginAccountController = async (req, res, next) => {
  try {
    const { error, value } = LoginAccountSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

    const account = await accountsService.getAccountByEmail(value.email);
    if (!account) {
      return res.status(404).json({
        message: 'Account does not found',
        status: 404,
      });
    }

    const isEqual = await verifyPassword(value.password, account.password);
    if (!isEqual) {
      return res.status(400).json({
        message: 'Password does not match',
        status: 400,
      });
    }

    const { accessToken, refreshToken } = generateToken(account.email);

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

export const loginAccountByAdminController = async (req, res, next) => {
  try {
    const { error, value } = LoginAccountSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

    const account = await accountsService.getAccountByEmail(value.email);
    if (!account) {
      return res.status(404).json({
        message: 'Account does not found',
        status: 404,
      });
    }

    const isEqual = await verifyPassword(value.password, account.password);
    if (!isEqual) {
      return res.status(400).json({
        message: 'Password does not match',
        status: 400,
      });
    }
    let isAdmin;
    if (account.dataValues.role === 'admin') {
      isAdmin = true;
    }

    if (!isAdmin) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
    }

    const { accessToken, refreshToken } = generateToken(account.email, isAdmin);

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

export const getUsersController = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;

    const accounts = await accountsService.getUsers(offset, limit);
    const totalDocs = await accountsService.getUsersCount();
    const totalPages = Math.ceil(totalDocs / limit);

    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const data = await Promise.all(
      accounts.map(async (account) => {
        return {
          id: account.dataValues.id,
          fullName: account.dataValues.full_name,
          email: account.dataValues.email,
          password: account.dataValues.password,
          phoneNumber: account.dataValues.phone_number,
          gender: account.dataValues.gender,
          dateOfBirth: account.dataValues.date_of_birth,
          avatar: account.dataValues.avatar,
          role: account.dataValues.role,
        };
      })
    );
    res.json({
      message: 'Get accounts successfully',
      accounts: data,
      paginationOptions: {
        totalDocs,
        offset,
        limit,
        totalPages,
        page: Number(page),
        hasNextPage,
        hasPrevPage,
      },
      success: true,
    });
  } catch (e) {
    next(e);
  }
};

export const getUserByIdController = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await accountsService.getAccountById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'Account does not found',
      });
    }

    res.json({
      message: 'Get user successfully',
      account: {
        id: user.dataValues.id,
        fullName: user.dataValues.full_name,
        email: user.dataValues.email,
        phoneNumber: user.dataValues.phone_number,
        gender: user.dataValues.gender,
        dateOfBirth: user.dataValues.date_of_birth,
        avatar: user.dataValues.avatar,
        role: user.dataValues.role,
      },
      success: true,
    });
  } catch (e) {
    next(e);
  }
};

export const deleteUserController = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await accountsService.getAccountById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'Account does not found',
      });
    }

    await accountsService.deleteUser(userId);
    res.json({ message: 'Delete user successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const updateUserController = async (req, res, next) => {
  try {
    const { error, value } = UpdateAccountSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

    const userId = req.params.id;
    const user = await accountsService.getAccountById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'Account does not found',
      });
    }

    const [accountByEmail, accountByPhone] = await Promise.all([
      accountsService.getAccountByEmail(value.email),
      accountsService.getAccountByPhoneNumber(value.phone_number),
    ]);

    if (user.dataValues.email !== value.email || user.dataValues.phone_number !== value.phone_number) {
      if (accountByEmail || accountByPhone) {
        return res.status(404).json({
          message: 'Existing account',
          status: 404,
        });
      }
    }

    await accountsService.updateUser({ ...value }, userId);
    const account = await accountsService.getAccountByEmail(value.email);
    const { id, full_name, email, phone_number, gender, date_of_birth, avatar, role } = account.dataValues;
    res.json({
      message: 'Update account successfully',
      account: {
        id,
        fullName: full_name,
        email,
        phoneNumber: phone_number,
        gender,
        dateOfBirth: date_of_birth,
        avatar,
        role,
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
