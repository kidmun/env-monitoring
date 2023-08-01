const express = require("express");
const { body } = require('express-validator');
const User = require('../models/User');
const userController = require("../controllers/user");
const router = express.Router();
router.get('/users', userController.getUsers);
router.get('/users/:userId', userController.getUser);
router.put('/change-password/:userId', userController.changePassword);
router.put('/edit-account/:userId',[
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        const userId = req.params.userId;
        
        return User.findOne({ email: value , }).then(userDoc => {
            console.log(userId === userDoc._id.toString())
          if (userDoc && userDoc._id.toString() !== userId) {
           
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('firstName')
      .trim()
      .not()
      .isEmpty(),
      body('lastName')
      .trim()
      .not()
      .isEmpty(),
    body('address')
      .trim()
      .not()
      .isEmpty(),
    body('phoneNumber')
      .trim()
      .isLength({min: 10, max: 10})
      .withMessage('Phone Number has to be 10 digits')
  ], userController.updateAccount)
module.exports = router;