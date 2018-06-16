import React from 'react';

/**
 * WelcomeMessage
 * @function WelcomeMessage
 *
 * @param {void} void
 *
 * @return {JSX} JSX
 */
const WelcomeMessage = () => (
  <div className="row center-align">
    <div className="col l10 offset-l1">
      <p className="welcome-msg hide-on-small-only">
          Hi there! Welcome to More-Recipes, your number one favorite
          stop for getting mouth watering delicacies that will make you
          ask for more. Creating an account is as simple as turning a ladle
          in a soup pot.  Now that you have joined do not forget the reason why
          we are here to begin with; to create and share some tatstilicious
          goodness. Recipes with the most upvotes get featured in our Top
          of the week!
      </p>
    </div>
  </div>
);

export default WelcomeMessage;
