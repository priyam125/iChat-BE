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
import prisma from './config/db.config.js';
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

app.get('/', (req, res) => {
    res.json({ message: 'Hello from the server!' })
})

//Routes
import authRoutes from './routes/authRoute.js';
app.use('/api', authRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})