import { AccountModel } from '../models/account.model.js';

export class AccountService {
  async createAccount(account) {
    await AccountModel.create(account);
  }

  async getUsers(offset, limit) {
    return await AccountModel.findAll({
      offset,
      limit,
      where: {
        role: 'user',
      },
      order: [['id', 'DESC']],
    });
  }

  async getAccountByEmail(email) {
    return await AccountModel.findOne({
      where: {
        email: email,
      },
    });
  }

  async getAccountByPhoneNumber(phoneNumber) {
    return await AccountModel.findOne({
      where: {
        phone_number: phoneNumber,
      },
    });
  }

  async getAccountById(id) {
    return await AccountModel.findOne({
      where: {
        id,
      },
    });
  }

  async getUsersCount() {
    return await AccountModel.count({
      where: {
        role: 'user',
      },
    });
  }

  async deleteUser(userId) {
    const user = await AccountModel.findOne({
      where: { id: userId },
    });
    if (user) {
      await user.destroy();
    }
  }

  async updateUser(newUser, userId) {
    return await AccountModel.update(newUser, {
      where: { id: userId },
    });
  }
}

export const accountsService = new AccountService();
