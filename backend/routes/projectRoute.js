import express from 'express';
import { createProject, getProjects, updateProject, deleteProject } from '../controllers/projectController.js';
import authUser from '../middlewares/auth.js';

const projectRouter = express.Router();

projectRouter.post('/create', authUser, createProject);
projectRouter.post('/list', authUser, getProjects);
projectRouter.post('/update', authUser, updateProject);
projectRouter.post('/delete', authUser, deleteProject);

export default projectRouter;