import { AccountModel } from '../models/account.model.js';

export class AccountService {
  static async createAccount(account) {
    await AccountModel.create(account);
  }

  static async getAccountByEmail(email) {
    return await AccountModel.findOne({
      where: {
        email: email,
      },
    });
  }

  static async getAccountById(id) {
    return await AccountModel.findOne({
      where: {
        id,
      },
    });
  }
}
