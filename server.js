// const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// require('dotenv').config();
// const prisma = require('./config/db.config');

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import setupSocket from './socket.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }
));
app.use(cookieParser());
app.use(bodyParser.json());

// This line of code makes the 'uploads/profile/' folder contents accessible
// via web requests. For example, if a user uploads a profile picture, the
// picture will be stored in this folder, and the line of code makes it
// possible to access the picture via a URL like this:
//   http://localhost:5001/uploads/profile/123456789.jpg
// This is necessary because the profile picture is referenced in the user's
// profile document in the database, and the React frontend code will try
// to fetch the picture from this URL when rendering the user's profile.
app.use('/uploads/profile', express.static('uploads/profile'));

app.get('/', (req, res) => {
    res.json({ message: 'Hello from the server!' })
})

//Routes
import Routes from "./routes/index.js"
app.use(Routes)

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

setupSocket(server)