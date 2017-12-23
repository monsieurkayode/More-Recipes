import db from '../models/index';
import { errorHandler } from '../helpers/responseHandler';
import { paginate, validatePaginate } from '../helpers/paginate';

const Favorite = db.Favorite,
  Recipe = db.Recipe,
  include = [
    'id', 'views', 'upvote', 'downvote',
    'recipeName', 'category', 'ingredients',
    'instructions', 'image', 'createdAt'
  ];

/**
 * @description controller function for adding favorite recipes
 *
 * @param {object} req http request object to server
 * @param {object} res http response object from server
 *
 * @returns {object} status message
 */
const addFavorite = (req, res) => Favorite
  .create({
    userId: req.decoded.user.id,
    recipeId: req.params.recipeId,
    category: req.body.category
  })
  .then(() => res.status(201).send({
    status: 'success',
    message: 'Recipe successfully added to favorites'
  }))
  .catch(error => res.status(400).send(error));

/**
 * @description controller function to get a user favorite recipes
 *
 * @param {object} req http request object to server
 * @param {object} res http response object from server
 * @param {method} next
 *
 * @returns {object} status message
 */
const getUserFavorites = (req, res, next) => {
  if (req.query.category) return next();
  const userId = req.decoded.user.id;
  const { page, limit, offset } = validatePaginate(req);
  return Favorite
    .findAndCountAll({ where: { userId },
      include: [{
        model: Recipe,
        attributes: include
      }],
      limit,
      offset,
      order: [['id', 'DESC']],
      attributes: ['id']
    })
    .then((favorites) => {
      if (favorites.count === 0) {
        return errorHandler(404, 'Your favorite recipe list is empty', res);
      }
      return res.status(200).send(paginate(
        page,
        limit,
        'success',
        `Showing ${favorites.rows.length} of ${favorites.count} recipes found`,
        favorites
      ));
    })
    .catch(error => res.status(400).send(error));
};

const getOneUserFavorite = (req, res) => Favorite
  .findOne({
    where:
    {
      userId: req.decoded.user.id,
      recipeId: req.params.recipeId
    }
  })
  .then((favorite) => {
    if (!favorite) {
      return errorHandler(404, 'Not on favorite list', res);
    }
    return res.status(200).json({
      status: 'success',
      message: 'Recipe on favorite list',
      favorite
    });
  })
  .catch(error => res.status(400).json(error));

/**
 * @description controller function to delete a user favorite recipe
 *
 * @param {object} req http request object to server
 * @param {object} res http response object from server
 *
 * @returns {object} status message
 */
const deleteFavorite = (req, res) => {
  const userId = req.decoded.user.id,
    recipeId = req.params.recipeId;
  return Favorite
    .findOne({ where: { userId, recipeId } })
    .then(favorite =>
      favorite.destroy().then(() => res.status(200).send({
        status: 'success',
        message: 'Recipe successfully removed from favorites'
      })))
    .catch(error => res.status(400).send(error));
};

/**
 * @description controller function for categorizing recipes
 * that have been added to a user's favorite recipe list
 * Note that this category is distinct from the global recipes category
 * in the application that specified by the owner
 *
 * @param {object} req http request object to server
 * @param {object} res http response object from server
 *
 * @returns {object} status message
 */
const addRecipeCategory = (req, res) => Favorite
  .findOne({ where:
        { userId: req.decoded.user.id, recipeId: req.params.recipeId }
  })
  .then((recipe) => {
    if (req.body.category === 'undefined') {
      return res.status(200).send({
        status: 'success',
        message: `Recipe added to ${recipe.category}`
      });
    }
    recipe
      .update({ category: req.body.category || recipe.category })
      .then(() => {
        res.status(200).send({
          status: 'success',
          message: `Recipe added to ${recipe.category}`
        });
      });
  })
  .catch(error => res.status(400).send(error));

export {
  addFavorite,
  getUserFavorites,
  addRecipeCategory,
  deleteFavorite,
  getOneUserFavorite
};
