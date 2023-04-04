import { FoodSchema } from '../dto/food.js';
import { foodsService } from '../services/food.service.js';
import fs from 'fs';

export const createFoodController = async (req, res, next) => {
  try {
    const { error, value } = FoodSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

    const food = await foodsService.createFood({ ...value, image: req.file.filename });
    res.json({ message: 'Create food successfully', food, success: true });
  } catch (e) {
    next(e);
  }
};

export const deleteFoodController = async (req, res, next) => {
  try {
    const foodId = req.params.id;
    const room = await foodsService.getFoodById(foodId);
    if (!room) {
      return res.status(404).json({
        message: 'Food does not found',
        status: 404,
      });
    }

    const imageName = room.dataValues.image;
    if (imageName) {
      fs.unlink(`public/images/${imageName}`, (err) => {
        if (err) {
          throw err;
        }
      });
    }
    await foodsService.deleteFood(foodId);
    res.json({ message: 'Delete food successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const updateFoodController = async (req, res, next) => {
  try {
    const { error, value } = FoodSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

    const foodId = req.params.id;
    const food = await foodsService.getFoodById(foodId);
    if (!food) {
      // nếu không tìm được food thì xóa ảnh đi
      const imageName = req.file.filename;
      if (imageName) {
        fs.unlink(`public/images/${imageName}`, (err) => {
          if (err) {
            throw err;
          }
        });
      }
      return res.status(404).json({
        message: 'Food does not found',
        status: 404,
      });
    }
    // xóa ảnh cũ khi cập nhập ảnh mới
    const imageName = food.dataValues.image;
    fs.unlink(`public/images/${imageName}`, (err) => {
      if (err) {
        throw err;
      }
    });

    await foodsService.updateFood({ ...value, image: req.file.filename }, foodId);
    res.json({ message: 'Update food successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const getFoodsController = async (req, res, next) => {
  try {
    const foods = await foodsService.getFoods();
    res.json({ message: 'Get foods successfully', foods, success: true });
  } catch (e) {
    next(e);
  }
};
