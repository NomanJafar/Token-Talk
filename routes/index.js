const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');
const router = express.Router();



router.post('/register', authController.signup );

router.post('/login', authController.login );

router.post('/logout', auth ,authController.logout );

router.get('/refresh', authController.refresh);

module.exports= router;
