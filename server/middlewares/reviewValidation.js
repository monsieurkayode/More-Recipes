import validator from 'validator';

import models from '../models';
import { errorHandler } from '../helpers/responseHandler';

const Review = models.Review;

/**
 * @description Function for validating comment input
 *
 * @param {*} req http request object to server
 * @param {*} res http response object from server
 * @param {*} next
 *
 * @returns {(object|function)} response
 */
const validateComment = (req, res, next) => {
  const { comment } = req.body;
  if (!comment || validator.isEmpty(comment)) {
    return (errorHandler(422, 'Comment cannot be empty', res));
  }
  next();
};

/**
 * @description Function for validating if a review exists
 *
 * @param {*} req http request object to server
 * @param {*} res http response object from server
 * @param {*} next
 *
 * @returns {(object|function)} response
 */
const reviewExists = (req, res, next) => {
  Review
    .find({ where:
      {
        recipeId: req.params.recipeId,
        id: req.params.id
      }
    })
    .then((review) => {
      if (!review) {
        return errorHandler(404, 'Review not found', res);
      }
      if (review && req.decoded.user.id !== review.userId) {
        return errorHandler(
          403, 'Your request is understood but not permitted', res
        );
      }
      next();
    })
    .catch(() => errorHandler(500, 'An error occured!', res));
};

export {
  validateComment,
  reviewExists
};
