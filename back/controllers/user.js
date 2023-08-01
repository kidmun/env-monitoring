const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
exports.getUsers = async (req, res, next) => {
    User.find().then(users => {
        for (let i =0; i < users.length; i++){
            users[i]["id"] = i + 1; 
          }
        res.status(200).json({
            message: "fetched users successfully",
            users: users
        });
    }).catch(err => {
        console.log(err)
    })
   
}
exports.getUser = (req, res, next) => {
        const userId = req.params.userId;
        User.findById(userId).then(user => {
          if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
          }
          res.status(200).json({ message: 'User fetched.', user: user });
        }).catch(err => {
          console.log(err)
        })
      };
exports.updateAccount = (req, res, next) => {
    const errors = validationResult(req);
    const userId = req.params.userId;
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.dd');
    console.log(errors.array())
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const address = req.body.address;
  const phoneNumber = req.body.phoneNumber;
 User.findById(userId).then(user => {
    if (!user){
        const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
    }
    user.firstName = firstName;
    user.email = email;
    user.lastName = lastName;
    user.address = address;
    user.phoneNumber = phoneNumber;
    return user.save();
 }).then(result => {
    res.status(200).json({
        message: "user edit successfully",
        user: result
    });
}).catch(err => {
            console.log(err)
        })
};
exports.changePassword = (req, res, next) => {
    const email = req.body.email;
   const oldPassword = req.body.oldPassword;
   const newPassword = req.body.newPassword;
   console.log(oldPassword, newPassword)
  let loadedUser;
 
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(oldPassword, user.password);
    })
    .then(isEqual => {
        console.log(isEqual)
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      bcrypt
    .hash(newPassword, 12)
    .then(hashedPw => {
      loadedUser.password = hashedPw;
      return loadedUser.save();
    })
      .then(result  => {
        console.log(result)
            res.status(200).json({ message : "successfully changed password", user: result});
        })
    
    .catch(err => {
    console.log(err, "ddd")
    });
}).catch(err => {
    res.status(401).json({ message : "successfully changed password"});
  console.log(err)
        });
};

