const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');
const blogController = require('../controllers/blogController');
const router = express.Router();



// Auth
router.post('/register', authController.signup );

router.post('/login', authController.login );

router.post('/logout', auth ,authController.logout );

router.get('/refresh', authController.refresh);

// Blog

router.post('/createblog', auth, blogController.createblog  );

router.get('/getallblogs', auth, blogController.getallblogs);

router.get('/getblogbyid', auth, blogController.getBlogbyid);

router.delete('/deleteblogbyid', auth, blogController.deleteblogbyid);

router.patch('/updateblogbyid', auth, blogController.updateblog);


module.exports= router;
