const express = require('express');
const { registerUser, userLogin, getUserData } = require('../controllers/userController');
const authMiddleWare = require('../middlewares/authMiddleWare');

const userRouter = express.Router();

//Route to register the user
userRouter.post("/register", registerUser);

//Route for user login
userRouter.post("/login", userLogin);


//Route for fetching userData
userRouter.get("/get-userData", authMiddleWare, getUserData);


module.exports = userRouter;