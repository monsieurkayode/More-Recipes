// Import module dependencies
import db from '../models/index';
import isAlphaNumeric from '../helpers/isAlphaNum';
import isEmail from '../helpers/isEmail';
import cleanString from '../helpers/cleanString';
import { errorHandler } from '../helpers/responseHandler';

// Reference database model
const User = db.User;

/**
 * @description Middleware function for validating user input
 * before creating a new account
 * @param {object} req http request object to server
 * @param {object} res http response object from server
 * @param {function} next 
 * @returns {object} status message
 */
const basicValidation = (req, res, next) => {
  // We first check if all required field are supplied
  // Then we do a cleanup of whitespace before checking
  // if all condition constraints are met
  if (req.body.username && req.body.password && req.body.email) {
    req.body.username = cleanString(req.body.username);
    req.body.password = cleanString(req.body.password);
    req.body.confirmPassword = req.body.confirmPassword;
    req.body.email = cleanString(req.body.email);

    if (!req.body.username) {
      return errorHandler(400, 'Please enter a username', res);
    }
    if (!isAlphaNumeric(req.body.username)) {
      return errorHandler(
        400, 'Username must contain alphabets and numbers only', res
      );
    }
    if (req.body.username.length < 3) {
      return errorHandler(
        400, 'Username should be at least three characters', res
      );
    }
    if (!req.body.email || !isEmail(req.body.email)) {
      return errorHandler(
        400, 'Invalid Email, please enter a valid email', res
      );
    }
    if (!req.body.password) {
      return errorHandler(
        400, 'Please enter a password', res
      );
    }
    if (req.body.password.length < 6) {
      return errorHandler(
        400, 'Password should be at least six characters long', res
      );
    }
    if (req.body.password !== req.body.confirmPassword) {
      return errorHandler(
        409, 'Password does not match', res
      );
    }
  } else if (!req.body.username || !req.body.email || !req.body.password) {
    if (!req.body.username) {
      return errorHandler(
        400, 'Please enter a username', res
      );
    }
    if (!req.body.email) {
      return errorHandler(
        400, 'Invalid Email, please enter a valid email', res
      );
    }
    if (!req.body.password) {
      return errorHandler(
        400, 'Please enter a password', res
      );
    }
  }
  next();
};

/**
 * @description Middleware function for validating if a username has
 * already been used by another user, disallows new user from using same
 * @param {object} req http request object to server
 * @param {object} res http response object from server
 * @param {function} next 
 * @returns {object} status message
 */
const validateUsername = (req, res, next) => {
  User.findOne({ where: { username: req.body.username } })
    .then((user) => {
      if (!user) next();
      else {
        return errorHandler(
          409, 'Username already exists', res
        );
      }
    })
    .catch(error => res.status(400).send(error));
};

/**
 * @description Middleware function for validating if email has
 * already been used by another user, disallows new user from using same
 * @param {object} req http request object to server
 * @param {object} res http response object from server
 * @param {function} next 
 * @returns {object} status message
 */
const emailValidation = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) next();
      else {
        return errorHandler(
          409, 'Email already exists', res
        );
      }
    })
    .catch(error => res.status(400).send(error));
};

/**
 * @description Middleware function for validating if a user is
 * registered or exists in the database
 * @param {object} req http request object to server
 * @param {object} res http response object from server
 * @param {function} next 
 * @returns {object} status message
 */
const validUser = (req, res, next) => {
  User
    .findById(req.params.userId || req.decoded.user.id)
    .then((user) => {
      if (!user) {
        return errorHandler(
          401, 'Oops! 401. Seems you haven\'t created an account yet', res
        );
      }
      next();
    });
};

export { basicValidation, validateUsername, emailValidation, validUser };
