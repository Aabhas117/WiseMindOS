import express from 'express';
import { createHabit, getHabits, updateHabit, completeHabit, deleteHabit } from '../controllers/habitController.js';
import authUser from '../middlewares/auth.js';

const habitRouter = express.Router();

habitRouter.post('/create', authUser, createHabit);
habitRouter.post('/list', authUser, getHabits);
habitRouter.post('/update', authUser, updateHabit);
habitRouter.post('/complete', authUser, completeHabit);
habitRouter.post('/delete', authUser, deleteHabit);

export default habitRouter;