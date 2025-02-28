import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

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

const server = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

mongoose.connect(databaseURL).then(() => {
  console.log('Connected to the database');
}).catch((err) => {
  console.log('Error connecting to the database');
  console.log(err);
});


// gsgds