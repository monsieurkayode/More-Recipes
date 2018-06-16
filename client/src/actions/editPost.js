/* jshint esversion: 6 */
import axios from 'axios';

import actionTypes from './actionTypes';

/**
 * @summary Action creator for updating a recipe post
 * Ensures only owner is able to update
 *
 * @function editPost
 *
 * @param {number} recipeId - Id of recipe to be updated
 * @param {string} category - updated category or previously defined at creation
 * @param {object} values - object with properties to update the record
 * @param {function} callback - functiom executed after update is successful
 *
 * @returns {void}
 */
const editPost = (recipeId, category, values, callback) => (dispatch) => {
  const formData = new FormData(); // eslint-disable-line
  const { recipeName, ingredients, instructions } = values;
  formData.append('recipeName', recipeName);
  formData.append('category', category);
  formData.append('ingredients', ingredients);
  formData.append('instructions', instructions);
  formData
    .append(
      'image', values.image.file === 'empty' ?
        values.image.name : values.image.file
    );
  return axios.put(`/api/v1/recipes/${recipeId}`, formData)
    .then((response) => {
      const { message } = response.data;
      dispatch({ type: actionTypes.EDIT_RECIPE_POST });
      dispatch({
        type: actionTypes.IS_FETCHING,
        payload: { status: false, componentName: 'EditRecipe' }
      });
      callback(message);
    })
    .catch(() => {
      const message = 'An error occured';
      Materialize.toast(message, 4000, 'red');
      dispatch({
        type: actionTypes.EDIT_RECIPE_POST_ERROR
      });
      dispatch({
        type: actionTypes.IS_FETCHING,
        payload: { status: false, componentName: 'EditRecipe' }
      });
    });
};

export default editPost;
