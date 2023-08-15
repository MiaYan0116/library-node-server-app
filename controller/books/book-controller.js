import * as booksDao from './books-dao.js';

const bookController = (app) => {
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

    const AddCommentToBook = async(req, res) => {
        const bookId = req.params.bid;
        const comment = req.body.comment;
        const status = await booksDao.addCommentToBook(bookId, comment);
        res.json(status);
    }

    app.get('/api/books', findBooks);
    app.get('/api/books/:bid', findOnebook);
    app.put('/api/books/:bid', updateBook);
    app.post('/api/books/:bid', AddCommentToBook);
};
export default bookController;