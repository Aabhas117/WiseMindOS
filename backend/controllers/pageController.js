import pageModel from '../models/pageModel.js';

// Create Page
const createPage = async (req, res) => {
    try {
        const { notebookId, title, content } = req.body;
        const userId = req.body.userId;

        if (!notebookId || !title) {
            return res.json({ success: false, message: 'Notebook ID and title are required' });
        }

        const newPage = new pageModel({
            userId,
            notebookId,
            title,
            content: content || ''
        });

        await newPage.save();
        res.json({ success: true, page: newPage });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get Pages by Notebook
const getPagesByNotebook = async (req, res) => {
    try {
        const { notebookId } = req.body;
        const userId = req.body.userId;

        if (!notebookId) {
            return res.json({ success: false, message: 'Notebook ID is required' });
        }

        const pages = await pageModel.find({ userId, notebookId });
        res.json({ success: true, pages });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get All Pages
const getAllPages = async (req, res) => {
    try {
        const userId = req.body.userId;
        const pages = await pageModel.find({ userId });
        res.json({ success: true, pages });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update Page
const updatePage = async (req, res) => {
    try {
        const { pageId, title, content } = req.body;
        const userId = req.body.userId;

        if (!pageId) {
            return res.json({ success: false, message: 'Page ID is required' });
        }

        const page = await pageModel.findOne({ _id: pageId, userId });
        if (!page) {
            return res.json({ success: false, message: 'Page not found' });
        }

        if (title) page.title = title;
        if (content !== undefined) page.content = content;
        page.updatedAt = new Date();

        await page.save();
        res.json({ success: true, page });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Delete Page
const deletePage = async (req, res) => {
    try {
        const { pageId } = req.body;
        const userId = req.body.userId;

        if (!pageId) {
            return res.json({ success: false, message: 'Page ID is required' });
        }

        const page = await pageModel.findOneAndDelete({ _id: pageId, userId });
        if (!page) {
            return res.json({ success: false, message: 'Page not found' });
        }

        res.json({ success: true, message: 'Page deleted successfully' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { createPage, getPagesByNotebook, getAllPages, updatePage, deletePage };