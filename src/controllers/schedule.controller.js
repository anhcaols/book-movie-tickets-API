import { ScheduleSchema } from '../dto/schedule.js';
import { schedulesService } from '../services/schedule.service.js';
import { moviesService } from '../services/movie.service.js';

export const createScheduleController = async (req, res, next) => {
  try {
    const { error, value } = ScheduleSchema.validate(req.body);

    const movie = await moviesService.getMovieById(value.movie_id);
    if (!movie) {
      return res.status(404).json({
        message: 'Movie does not found',
        status: 404,
      });
    }

    await schedulesService.createSchedule({ ...value, release_date: movie.dataValues.release_date });

    res.json({ message: 'Create schedule successfully', success: true });
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }
  } catch (e) {
    next(e);
  }
};
