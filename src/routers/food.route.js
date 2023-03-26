import 'express-async-errors';

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createFoodController, deleteFoodController } from '../controllers/food.controller.js';
import multer from 'multer';

export const foodRouter = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

foodRouter.post('/foods', authMiddleware(), upload.single('image'), createFoodController);
foodRouter.delete('/foods/:id', authMiddleware(), deleteFoodController);
