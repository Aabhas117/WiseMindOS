import express from 'express';
import { getTodayPlan, addToDailyPlan, removeFromDailyPlan, toggleDailyPlanTask, clearDailyPlan } from '../controllers/dailyPlanController.js';
import authUser from '../middlewares/auth.js';

const dailyPlanRouter = express.Router();

dailyPlanRouter.post('/today', authUser, getTodayPlan);
dailyPlanRouter.post('/add', authUser, addToDailyPlan);
dailyPlanRouter.post('/remove', authUser, removeFromDailyPlan);
dailyPlanRouter.post('/toggle', authUser, toggleDailyPlanTask);
dailyPlanRouter.post('/clear', authUser, clearDailyPlan);

export default dailyPlanRouter;