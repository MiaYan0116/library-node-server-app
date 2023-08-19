import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
    username:{ type: String, required: true, unique: true },
    firstname: String,
    lastname: String,
    avatarUrl: String,
    email:{ type: String },
    password: {type: String, required: true},
    loginTime: { type: Number },
    isAdmin: { type: Boolean, default: false },
    isContentAdmin: {type: Boolean, default: false},
    isBanned: { type: Boolean, default: false },
    likes:[{ book: String}],
    bookComments:[{ 
        content: String,
        book: String
    }],
    follows: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }]
}, {collection: "users"});

export default usersSchema;