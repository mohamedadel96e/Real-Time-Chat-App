import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import AuthRoutes from './routes/AuthRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5020;
const databaseURL = process.env.DATABASE_URL;

app.use(cors({
    origin: [process.env.ORIGIN],
    credentials: true
}));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.use('/api/auth', AuthRoutes);

const server = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

