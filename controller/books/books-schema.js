import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    bookName: String,
    Author: String,
    liked: Boolean,
    likes: Number,
    bookComments: [String]
}, {collection: 'books'});
export default bookSchema;