// const express = require('express');
// const Router  = require('express');
import { Router } from 'express';
// const AuthController = require('../controller/AuthController');
import AuthController from '../controller/AuthController.js';
import { verifyToken } from '../middleware/AuthMiddleware.js';

const router = Router()

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/logout', AuthController.logout);
router.get('/auth/user-info', verifyToken, AuthController.getUser);

// module.exports = router;
export default router