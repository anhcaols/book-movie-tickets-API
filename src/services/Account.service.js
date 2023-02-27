import { AccountModel } from '../models/account.model.js';
import { DbService } from './DbService.js';

export class AccountService {
  static async createAccount(account) {
    await AccountModel.create(account);
  }

  static async getAccountByUsername(username) {
    return await AccountModel.findOne({
      where: {
        username: username,
      },
    });
  }
}
