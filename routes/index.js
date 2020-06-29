const express = require('express');
const router = express.Router();
const userModel = require('../models/user')

// Import All Middleware
const {
	checkEmailExistMiddleware,
	checkNameExistMiddleware,
	checkLoginMiddleware,
	checkLogoutMiddleware
} = require('../middleware/middleware');

//Import All Controller
const {
	getLogin,
	postLogin,
	getSignup,
	postSignup,
	dashboard,
	logout,
	getAddCategory,
	getAllCategory,
	postAddCategory,
	getDeleteCategory,
	getEditCategory,
	postEditCategory,
	getAddPassword,
	postAddPassword,
	getAllPassword,
	getDeletePassword,
	getEditPassword,
	postEditPassword
} = require('../controller/controller');


// Dashboard Route
router.get('/dashboard',checkLoginMiddleware, dashboard);
router.get('/logout', logout);



//  Login Route
router.get('/',checkLogoutMiddleware,getLogin);
router.post('/',checkLogoutMiddleware,postLogin);



// Signup Route
router.get('/signup',checkLogoutMiddleware,getSignup);
router.post('/signup',checkLogoutMiddleware,checkNameExistMiddleware,checkEmailExistMiddleware,postSignup);



// Category Route
router.get('/all-category',checkLoginMiddleware,getAllCategory);
// Create category
router.get('/add-category',checkLoginMiddleware,getAddCategory);
router.post('/add-category',checkLoginMiddleware,postAddCategory);
// Edit category
router.get('/all-category/edit/:id',checkLoginMiddleware,getEditCategory);
router.post('/all-category/edit/:id',checkLoginMiddleware,postEditCategory);
// Delete category
router.get('/all-category/delete/:id',checkLoginMiddleware,getDeleteCategory);



// Password Route
router.get('/all-password',checkLoginMiddleware,getAllPassword);
// Create password
router.get('/add-password',checkLoginMiddleware,getAddPassword);
router.post('/add-password',checkLoginMiddleware,postAddPassword);
// Edit Password
router.get('/all-password/edit/:id',checkLoginMiddleware,getEditPassword);
router.post('/all-password/edit/:id',checkLoginMiddleware,postEditPassword);
// Delete category
router.get('/all-password/delete/:id',checkLoginMiddleware,getDeletePassword);





module.exports = router;
