import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    content: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users'
    },
    book: { 
      type: mongoose.Schema.Types.ObjectId, 
			ref: 'books' }
});

const likesSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users'
	},
	book: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'books' }
})

const bookSchema = mongoose.Schema({
	_id: String,
    title: String,
    author: [String],
		first_publish_year: Number,
		cover_id: Number,
		cover_img: String,
		edition_count: Number,
    liked: Boolean,
		likes: {
			type: [likesSchema],
			default: []
		},
    bookComments: [commentSchema]
}, {collection: 'books'});

export default bookSchema;