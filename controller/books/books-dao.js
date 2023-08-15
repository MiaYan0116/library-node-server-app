import booksModel from "./books-model.js";
export const findBooks = () => booksModel.find();
export const findOneBook = (bid) => booksModel.findOne({ _id: bid});
export const updateBook = (bid, book) => booksModel.updateOne({_id: bid}, {$set: book});
export const addCommentToBook = (bid, comment) => booksModel.updateOne({_id: bid}, {$push: {bookComments: comment}});