import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app';

const render = () => {
  ReactDOM.render(
    <App/>,
    document.getElementById('react-root')
  );
};

if (module.hot) {
  module.hot.accept('./components/app', render);
}

render();
