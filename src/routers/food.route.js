import 'express-async-errors';

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  createFoodController,
  deleteFoodController,
  getFoodsController,
  updateFoodController,
} from '../controllers/food.controller.js';
import multer from 'multer';

export const foodRouter = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/foods');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

foodRouter.get('/foods', authMiddleware(), getFoodsController);
foodRouter.post('/foods', authMiddleware(), upload.single('image'), createFoodController);
foodRouter.delete('/foods/:id', authMiddleware(), deleteFoodController);
foodRouter.patch('/foods/:id', authMiddleware(), upload.single('image'), updateFoodController);
