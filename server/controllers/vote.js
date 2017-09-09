// Import module dependencies
import db from '../models/index';

// Reference database models
const Recipe = db.Recipe;
const Vote = db.Vote;

/**
 * 
 * @description controller function that handles upvoting a posted recipe
 * A user that has upvoted on same recipe before will have his vote removed
 * if he/she tries to perform same upvote request
 * @param {object} req http request object to server
 * @param {object} res http response object from server
 * @returns {object} status message upvote downvote
 */
const upvote = (req, res) => Vote
  // Create model instance and persist data to database
  // if not found indicating user has not voted on recipe
  .findOrCreate({
    where: {
      userId: req.decoded.user.id,
      recipeId: req.params.recipeId },
    defaults: { option: true }
  })
  .spread((voter, created) => {
    // If created perform upvote action
    // If not created and user has information resolving
    // to a downvote, allow user to upvote and remove user downvote
    if (created) {
      return Recipe
        .findOne({ where: { id: req.params.recipeId } })
        .then((recipe) => {
          recipe.increment('upvote').then(() => {
            recipe.reload().then(() => res.status(200).send({
              status: 'success',
              message: 'Your vote has been recorded',
              upvote: recipe.upvote,
              downvote: recipe.downvote
            }));
          });
        });
    } else if (!created && voter.option === false) {
      voter.update({ option: true });
      return Recipe
        .findOne({ where: { id: req.params.recipeId } })
        .then((recipe) => {
          recipe.increment('upvote').then(() => {
            recipe.decrement('downvote').then(() => {
              recipe.reload();
            }).then(() => res.status(200).send({
              status: 'success',
              message: 'Your vote has been recorded',
              upvote: recipe.upvote,
              downvote: recipe.downvote
            }));
          });
        });
    } else if (!created && voter.option === true) {
      voter.destroy();
      return Recipe
        .findOne({ where: { id: req.params.recipeId } })
        .then((recipe) => {
          recipe.decrement('upvote').then(() => {
            recipe.reload();
          }).then(() => res.status(200).send({
            status: 'success',
            message: 'Your vote has been removed',
            upvote: recipe.upvote,
            downvote: recipe.downvote
          }));
        });
    }
  })
  .catch(error => res.status(400).send(error));

/**
 * 
 * @description controller function that handles downvoting a posted recipe
 * A user that has upvoted on same recipe before will have his vote removed
 * if he/she tries to perform same downvote request
 * @param {object} req http request object to server
 * @param {object} res http response object from server
 * @returns {object} status message upvote downvote
 */
const downvote = (req, res) => Vote
  // Create model instance and persist data to database
  // if not found indicating user has not voted on recipe
  .findOrCreate({
    where: {
      userId: req.decoded.user.id,
      recipeId: req.params.recipeId },
    defaults: { option: false }
  })
  .spread((voter, created) => {
    // If created perform downvote action
    // If not created and user has information resolving
    // to an upvote, allow user to downvote and remove user's upvote
    if (created) {
      return Recipe
        .findOne({ where: { id: req.params.recipeId } })
        .then((recipe) => {
          recipe.increment('downvote').then(() => {
            recipe.reload().then(() => res.status(200).send({
              status: 'success',
              message: 'Your vote has been recorded',
              upvote: recipe.upvote,
              downvote: recipe.downvote
            }));
          });
        });
    } else if (!created && voter.option === true) {
      voter.update({ option: false });
      return Recipe
        .findOne({ where: { id: req.params.recipeId } })
        .then((recipe) => {
          recipe.increment('downvote').then(() => {
            recipe.decrement('upvote').then(() => {
              recipe.reload();
            }).then(() => res.status(200).send({
              status: 'success',
              message: 'Your vote has been recorded',
              upvote: recipe.upvote,
              downvote: recipe.downvote
            }));
          });
        });
    } else if (!created && voter.option === false) {
      voter.destroy();
      return Recipe
        .findOne({ where: { id: req.params.recipeId } })
        .then((recipe) => {
          recipe.decrement('downvote').then(() => {
            recipe.reload();
          }).then(() => res.status(200).send({
            status: 'success',
            message: 'Your vote has been removed',
            upvote: recipe.upvote,
            downvote: recipe.downvote
          }));
        });
    }
  })
  .catch(error => res.status(400).send(error));

export { upvote, downvote };
