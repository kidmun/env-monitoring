const express = require('express');
const { body } = require('express-validator');
const User = require('../models/User');
const authController = require('../controllers/auth');
const router = express.Router();
router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
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
  ],
  authController.signup
);
router.post('/login', authController.login);
module.exports = router;