import express from 'express';
import { createTask, getTasks, updateTask, toggleTaskCompletion, deleteTask } from '../controllers/taskController.js';
import authUser from '../middlewares/auth.js';

const taskRouter = express.Router();

taskRouter.post('/create', authUser, createTask);
taskRouter.post('/list', authUser, getTasks);
taskRouter.post('/update', authUser, updateTask);
taskRouter.post('/toggle', authUser, toggleTaskCompletion);
taskRouter.post('/delete', authUser, deleteTask);

export default taskRouter;