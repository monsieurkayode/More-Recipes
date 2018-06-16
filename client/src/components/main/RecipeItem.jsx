import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'proptypes';
import pascalCase from '../../utils/pascalCase';

/**
 * RecipeItem
 * @function RecipeItem
 *
 * @param {void} void
 *
 * @return {JSX} JSX
 */
const RecipeItem = ({ recipe, upvote, downvote, grid }) =>
  (<div className={`col ${grid}`}>
    <div className="card hoverable views-small">
      <div className="card-image">
        <Link to={`/recipes/${recipe.id}`}>
          <img
            src={recipe.image}
            alt={recipe.recipeName}
          />
        </Link>
        <span className="card-title">{recipe.views} Views</span>
      </div>
      <div
        className="card-content small-cards-home"
      >
        <div className="card-title truncate">
          <strong>{recipe.recipeName}</strong>
        </div>
        <div
          className="card-details"
        >
          <Link
            to={`/category/${recipe.category}`}
            className="chip teal white-text"
          >{pascalCase(recipe.category)}
          </Link>
          <span>
            <div
              onClick={() => downvote(recipe.id)}
              className="unlike right"
            >
              <i
                className="material-icons tiny reaction"
              >thumb_down</i>{recipe.downvote}
            </div>
            <div
              onClick={() => upvote(recipe.id)}
              className="like right"
            >
              <i
                className="material-icons tiny reaction"
              >thumb_up</i>{recipe.upvote}
            </div>
          </span>
        </div>
      </div>
    </div>
  </div>);

RecipeItem.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.any,
    views: PropTypes.number,
    upvote: PropTypes.number,
    downvote: PropTypes.number,
    recipeName: PropTypes.string,
    category: PropTypes.string,
    ingredients: PropTypes.string,
    instructions: PropTypes.string,
    image: PropTypes.string
  }).isRequired,
  upvote: PropTypes.func.isRequired,
  downvote: PropTypes.func.isRequired,
  grid: PropTypes.string.isRequired
};

export default RecipeItem;
