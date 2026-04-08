import express from 'express';
import { createPage, getPagesByNotebook, getAllPages, updatePage, deletePage } from '../controllers/pageController.js';
import authUser from '../middlewares/auth.js';

const pageRouter = express.Router();

pageRouter.post('/create', authUser, createPage);
pageRouter.post('/list-by-notebook', authUser, getPagesByNotebook);
pageRouter.post('/list', authUser, getAllPages);
pageRouter.post('/update', authUser, updatePage);
pageRouter.post('/delete', authUser, deletePage);

export default pageRouter;