import { FoodModel } from '../models/food.model.js';

export class FoodService {
  async getFood(foodId) {
    return await FoodModel.findByPk(foodId);
  }

  async createFood(food) {
    return await FoodModel.create(food);
  }

  async deleteFood(foodId) {
    const food = await FoodModel.findByPk(foodId);
    if (food) {
      await food.destroy();
    }
  }

  async updateFood(newFood, foodId) {
    return await FoodModel.update(newFood, {
      where: { id: foodId },
    });
  }
}

export const foodsService = new FoodService();
