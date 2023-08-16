import * as booksDao from './books-dao.js';
import * as usersDao from '../users/users-dao.js';

const bookController = (app) => {
    const createBook = async (req, res) => {
        const newBook = req.body;
        newBook.likes = [];
        newBook.comments = [];
        newBook.bookName = req.body.bookName;
        newBook.author = req.body.author;
        newBook.liked = false;
        const insertedBook = await booksDao.createBook(newBook);
        res.json(insertedBook);
    }
    
    const findBooks = async (req, res) => {
        const books = await booksDao.findBooks()
        res.json(books);
    }

    const findOnebook = async (req, res) => {
        const bookId = req.params.bid;
        const book = await booksDao.findOneBook(bookId)
        res.json(book);
    }
    
    const updateBook = async(req, res) => {
        const bookId = req.params.bid;
        const updates = req.body;
        const status = await booksDao.updateBook(bookId, updates);
        res.json(status);
    } 

    const addCommentToBook = async(req, res) => {
        const bookId = req.params.bid;
        const commentContent = req.body.comment;
        const userId = req.session["currentUser"]._id;
        const comment = { content: commentContent, user: userId, book: bookId};
        const status = await booksDao.addCommentToBook(bookId, comment);
        const updatedUser = await usersDao.addCommentToUser(userId, comment);
        res.json(updatedUser);
    }

    const addLikeToBook = async(req, res) => {
        const bookId = req.params.bid;
        const userId = req.session["currentUser"]._id;
        console.log(req.session["currentUser"])
        const like = {user: userId, book: bookId};
        const status = await booksDao.addLikeToBook(bookId, like);
        const updatedUser = await usersDao.addLikeToUser(userId, like);
        res.json(updatedUser);
    }

    app.post('/api/books', createBook);
    app.get('/api/books', findBooks);
    app.get('/api/books/:bid', findOnebook);
    app.put('/api/books/:bid', updateBook);
    app.post('/api/books/:bid', addCommentToBook);
    app.put('/api/books/like/:bid', addLikeToBook);
};
export default bookController;