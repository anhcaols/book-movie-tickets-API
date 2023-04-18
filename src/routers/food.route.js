import 'express-async-errors';

import { Router } from 'express';
import { authMiddleware, authMiddlewareByAdmin } from '../middlewares/auth.middleware.js';
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
foodRouter.post('/foods', authMiddlewareByAdmin(), upload.single('image'), createFoodController);
foodRouter.delete('/foods/:id', authMiddlewareByAdmin(), deleteFoodController);
foodRouter.patch('/foods/:id', authMiddlewareByAdmin(), upload.single('image'), updateFoodController);
