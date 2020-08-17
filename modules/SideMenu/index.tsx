import React from 'react';
import ReactDOM from 'react-dom';
import SideMenu from './main';
import { StyledPage } from '../PageWrapper/styled';

ReactDOM.render(
  <StyledPage>
    <SideMenu
      userID={8418}
      imgURL="https://app.kalosflorida.com/app/assets/images/kalos-logo-new.png"
    />
  </StyledPage>,
  document.getElementById('root')
);
