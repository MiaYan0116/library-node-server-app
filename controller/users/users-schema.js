import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
    username:{ type: String, required: true, unique: true },
    firstname: String,
    lastname: String,
    email:{ type:String, unique:true },
    password: {type: String, required: true, unique: false},
    loginTime: { type: Date },
    isAdmin: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    likes:[{ book: {type: mongoose.Schema.Types.ObjectId, ref: 'books'}}],
    bookComments:[{ 
        content: String,
        book: {type: mongoose.Schema.Types.ObjectId, ref: 'books'}
    }],
    follows: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }]
}, {collection: "users"});

export default usersSchema;