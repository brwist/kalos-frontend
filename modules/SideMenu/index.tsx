import React from 'react';
import ReactDOM from 'react-dom';
import SideMenu from './main';

ReactDOM.render(
  <SideMenu
    userID={8418}
    imgURL="https://app.kalosflorida.com/app/assets/images/kalos-logo-new.png"
  />,
  document.getElementById('root'),
);
