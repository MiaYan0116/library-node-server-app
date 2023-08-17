import booksModel from "./books-model.js";
export const createBook = (book) => booksModel.create(book);
export const findBooks = () => booksModel.find();
export const findOneBook = (bid) => booksModel.findOne({ _id: bid});
export const updateBook = (bid, book) => booksModel.updateOne({_id: bid}, {$set: book});
export const addCommentToBook = (bid, comment) => booksModel.updateOne({_id: bid}, {$push: {bookComments: comment}});
export const addLikeToBook = (bid, like) => booksModel.updateOne({_id: bid}, {$push: {likes: like}}, {new: true});
export const deleteComment = (bid, commentId) => booksModel.updateOne({_id: bid}, {$pull: {bookComments: {_id: commentId}}});