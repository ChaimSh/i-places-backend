const uuid = require('uuid/v4');
const {validationResult} = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/user');


const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Chaim S.',
        email: 'test@test.com',
        password: 'testers'
    }
];

const getUsers = async (req, res, next) => {
    let users;
    try{
        users = await User.find({}, '-password');
    } catch (err) {
       const error = new HttpError(
           'Fecthing users failed', 500
       );
       return next(error);
    }
   
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid Inputs passed', 422)
        );      
    }
    const {name, email, password, places} = req.body
    

    let existingUser 

    try {
        existingUser = await User.findOne({email: email})
    } catch (err) {
        const error = new HttpError(
            'Signup did not work', 500
        );
        return next(error);
    }
     if (existingUser) {
         const error = new HttpError(
             'User exists already', 422
         );
         return next(error);
     }

    const createdUser = new User({
        name,
        email,
        image: 'hello, testing',
        password,
        places
    });
     
    try {
        await createdUser.save();
      } catch (err) {
          const error = new HttpError(
              'Signup failed. Please try again.', 500
          );
          return next(error);
      }
       

      res.status(201).json({user: createdUser.toObject({ getters: true})});
};

const login = async (req, res, next) => {
  const {email, password} = req.body;

  let existingUser 

  try {
      existingUser = await User.findOne({email: email})
  } catch (err) {
      const error = new HttpError(
          'Login did not work', 500
      );
      return next(error);
  }

   if (existingUser || existingUser.password !== password ) {
       const error = new HttpError(
           "invalid credentials", 401
       );
       return next(error);
   }

  res.json({message: 'Logged in!'});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
