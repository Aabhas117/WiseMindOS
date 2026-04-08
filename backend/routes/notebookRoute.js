import express from 'express';
import { createNotebook, getNotebooks, updateNotebook, deleteNotebook } from '../controllers/notebookController.js';
import authUser from '../middlewares/auth.js';

const notebookRouter = express.Router();

notebookRouter.post('/create', authUser, createNotebook);
notebookRouter.post('/list', authUser, getNotebooks);
notebookRouter.post('/update', authUser, updateNotebook);
notebookRouter.post('/delete', authUser, deleteNotebook);

export default notebookRouter;