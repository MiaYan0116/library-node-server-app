import express from 'express';
import "dotenv/config";
import session from "express-session";
import cors from 'cors'
import bookController from './controller/books/book-controller.js';
import mongoose from 'mongoose';
const PORT = process.env.PORT || 4000;
const CONNECTION_STRING = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/library'
mongoose.connect(CONNECTION_STRING);

const app = express();
const allowedOrigins = [
    "http://localhost:3000", 
  ];
app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    callback(null, true);
  }
}));

const sessionOptions = {
  secret: "any string",
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
		sameSite: "none",
		secure: true,
  };
}

app.use(session(sessionOptions));
app.use(express.json());
bookController(app);

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
})