const express = require('express');

const router = express.Router();


// controller functions
const { signupUser, loginUser, firebaseLoginUser } = require('../controllers/userController');

//login route // 
router.post('/login', loginUser);

//firebase login route//
router.get('/firebaseLogin', firebaseLoginUser)

// signup route //
router.post('/signup', signupUser);


module.exports = router