import mongoose from "mongoose";
import bookSchema from "./books-schema.js";

const booksModel = mongoose.model('bookModel', bookSchema);
export default booksModel;