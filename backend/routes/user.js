const express = require('express');

const router = express.Router();


// controller functions
const { signupUser, loginUser} = require('../controllers/userController');

//login route // 
router.post('/login', loginUser);

//firebase login route//
// router.post('/firebaseLogin', firebaseLoginUser);

// signup route //
router.post('/signup', signupUser);


module.exports = router