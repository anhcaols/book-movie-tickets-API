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
    });
  }

  async getAccountByEmail(email) {
    return await AccountModel.findOne({
      where: {
        email: email,
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
}

export const accountsService = new AccountService();
