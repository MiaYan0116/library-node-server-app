import booksModel from "./books-model.js";
export const createBook = (book) => booksModel.create(book);
export const upsertBook = (book) => booksModel.upsertBook(book);
export const findBooks = () => booksModel.find();
export const findOneBook = (bid) => booksModel.findOne({ _id: bid});
export const updateBook = (bid, book) => booksModel.updateOne({_id: bid}, {$set: book});
export const addCommentToBook = (bid, comment) => booksModel.findOneAndUpdate({_id: bid}, {$push: {bookComments: comment}}, {new: true});
export const addLikeToBook = (bid, like) => booksModel.updateOne({_id: bid}, {$push: {likes: like}});
export const deleteComment = (bid, commentId) => booksModel.findOneAndUpdate({_id: bid}, {$pull: {bookComments: {_id: commentId}}}, {new: true});