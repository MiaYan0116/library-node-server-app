import mongoose from "mongoose";
import usersSchema from '../users/users-schema.js';
const commentSchema = mongoose.Schema({
    content: String,
    user: usersSchema,
    book: String
});

const likesSchema = mongoose.Schema({
	user: usersSchema,
	book: String
})

const bookSchema = mongoose.Schema({
	_id: String,
    title: String,
    author: [String],
	first_publish_year: Number,
	cover_id: Number,
	cover_img: String,
	edition_count: Number,
	description: String,
	subject_places: [String],
	subject_times: [String],
	subjects: [String],
    liked: Boolean,
		likes: {
			type: [likesSchema],
			default: []
		},
    bookComments: [commentSchema]
}, {collection: 'books'});

export default bookSchema;