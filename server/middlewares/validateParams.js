import isNumber from '../helpers/isNumber';
import { errorHandler } from '../helpers/responseHandler';

/**
 * @description Middleware function for validating params
 * is an integer
 *
 * @param {object} req http request object to server
 * @param {object} res http response object from server
 * @param {function} next
 *
 * @returns {object} status message
 */
const validate = (req, res, next) => {
  if (req.params.recipeId && req.params.id) {
    if (isNumber(req.params.recipeId) && isNumber(req.params.id)) return next();
    return errorHandler(422, 'You have entered an invalid parameter', res);
  }
  if (isNumber(req.params.recipeId)) return next();
  return errorHandler(422, 'You have entered an invalid parameter', res);
};

export default validate;
