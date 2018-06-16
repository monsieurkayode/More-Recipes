import mapKeys from 'lodash/mapKeys';
import omit from 'lodash/omit';

import actionTypes from '../actions/actionTypes';

/**
 * Reducer function for user recipes related operations
 * @function userRecipesReducer
 *
 * @param {object} state
 * @param {object} action
 *
 * @returns {object} state - the new state
 */
const userRecipesReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USER_RECIPES:
      return {
        recipes: mapKeys(action.payload.recipes, 'id'),
        pagination: action.payload.pagination
      };
    case actionTypes.DELETE_RECIPE_POST:
      return {
        ...state,
        recipes: omit(state.recipes, action.payload),
        pagination: {
          ...state.pagination,
          pageSize: state.pagination.pageSize - 1,
          totalCount: state.pagination.totalCount - 1
        }
      };
    case actionTypes.LOGOUT_USER:
      return action.payload;
    default:
      return state;
  }
};

export default userRecipesReducer;
