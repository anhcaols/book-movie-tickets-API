import { AccountModel } from '../models/account.model.js';
import { DbService } from './DbService.js';

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
}
