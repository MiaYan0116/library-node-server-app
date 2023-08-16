import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    firstname: String,
    lastname: String,
    email:{
        type:String,
        unique:true,
    },
    password: {type: String, required: true, unique: false},
    likes:[{ book: {type: mongoose.Schema.Types.ObjectId, ref: 'books'}}],
    bookComments:[{ 
        content: String,
        book: {type: mongoose.Schema.Types.ObjectId, ref: 'books'}
    }]
}, {collection: "users"});

export default usersSchema;