import { AccountModel } from '../models/account.model.js';

export class AccountService {
  async createAccount(account) {
    await AccountModel.create(account);
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
}

export const accountsService = new AccountService();
