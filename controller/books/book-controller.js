import * as booksDao from './books-dao.js';
import * as usersDao from '../users/users-dao.js';
import booksModel from "./books-model.js";
import mongoose from 'mongoose';

const bookController = (app) => {

    const searchAndSaveBooks = async(req, res) => {
        const searchResults = req.body.searchResults;
        const savedBooks = [];
        for (const externalBookData of searchResults) {
            const existingBook = await booksDao.findBookById(externalBookData.id);
            if(!existingBook){
                // Create a new book object based on external API data
                const newBook = {
                    _id: externalBookData.id,
                    title: externalBookData.title,
                    author: externalBookData.author,
                    first_publish_year: externalBookData.first_publish_year,
                    cover_id: externalBookData.cover_id,
                    cover_img: externalBookData.cover_img,
                    edition_count: externalBookData.edition_count,
                    liked: false,
                    likes: [],
                    bookComments: []
                };
                // Save the new book to the internal database
                const insertedBook = await booksDao.createBook(newBook);
                savedBooks.push(insertedBook);
            } 
        }
        res.json(savedBooks);
    }

    const findBooks = async (req, res) => {
        const books = await booksDao.findBooks()
        res.json(books);
    }

    const bookDetails = async (req, res) => {
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

    const deleteComment = async(req, res) => {
        const contentAdmin = req.session["currentUser"];
        if(!contentAdmin || !contentAdmin.isContentAdmin){
            res.sendStatus(403);
            return;
        }
        const bookId = req.params.bid;
        const commentId = req.params.cid;
        const ObjectId = new mongoose.Types.ObjectId(commentId);
        const book = await booksModel.findOne({
            _id: bookId,
            'bookComments._id': ObjectId
          }, {
            'bookComments.$': 1
        });
        if (book && book.bookComments && book.bookComments.length > 0) {
            const comment = book.bookComments[0];
            const userId = comment.user._id; 
            const content = comment.content;
            
            const status_book = await booksDao.deleteComment(bookId, commentId);
            const status_user = await usersDao.deleteCommentFromUser(userId, content);
            res.json(status_book);
            console.log(status_user);
        }
        
        // const book = await booksDao.findOneBook(bookId);
        // let comment;
        // for(let i = 0; i < book.bookComments.length; i++){
        //     if (book.bookComments[i]._id.toString() === commentId) {
        //         comment = book.bookComments[i];
        //         break;
        //     }
        // }
        // console.log({"comment: " : comment});
        // const bookStatus = await booksDao.deleteComment(bookId, commentId);
        // const userStatus = await usersDao.deleteCommentFromUser(comment.user, commentId);
        // if(bookStatus.success && userStatus.success){
        //     res.json({message: "Comment deleted successfully"});
        // }else{
        //     res.status(500).json({ message: "Failed to delete comment" });
        // }
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




    app.post('/api/books', searchAndSaveBooks);
    // app.post('/api/books', createBook);
    app.get('/api/books', findBooks);
    app.get('/api/books/details/:bid', bookDetails);
    app.put('/api/books/:bid', updateBook);
    app.post('/api/books/:bid', addCommentToBook);
    app.put('/api/books/like/:bid', addLikeToBook);
    app.delete('/api/books/:bid/comments/:cid', deleteComment);
};
export default bookController;