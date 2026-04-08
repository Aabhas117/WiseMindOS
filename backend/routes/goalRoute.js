import express from 'express';
import { createGoal, getGoals, updateGoal, deleteGoal } from '../controllers/goalController.js';
import authUser from '../middlewares/auth.js';

const goalRouter = express.Router();

goalRouter.post('/create', authUser, createGoal);
goalRouter.post('/list', authUser, getGoals);
goalRouter.post('/update', authUser, updateGoal);
goalRouter.post('/delete', authUser, deleteGoal);

export default goalRouter;