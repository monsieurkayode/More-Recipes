import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';

/**
 * WelcomeDisplay
 * @function WelcomeDisplay
 *
 * @param {object} props
 *
 * @return {JSX} JSX
 */
const WelcomeDisplay = (props) => {
  const { user: { username }, selected } = props;
  return (
    <div id="welcome-panel" className="card-panel grey lighten-4">
      <span className="card-content">
        <h5>Welcome {username}!</h5>
        <span>Dashboard / My {selected}</span>
      </span>
    </div>
  );
};

WelcomeDisplay.defaultProps = {
  user: {}
};

WelcomeDisplay.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string
  }),
  selected: PropTypes.string.isRequired
};

const mapStateToProps = ({ signinState }) => ({
  user: signinState.user,
});


export default connect(mapStateToProps)(WelcomeDisplay);
