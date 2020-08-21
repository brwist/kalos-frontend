import React from 'react';
import ReactDOM from 'react-dom';
import ApartmentIcon from '@material-ui/icons/Apartment';
import { Prompt } from './main';
import { StyledPage } from '../PageWrapper/styled';

ReactDOM.render(
  <StyledPage>
    <Prompt
      text="Example Text"
      prompt="Example prompt"
      confirmFn={console.log}
      defaultValue="Default Value"
      // Icon={ApartmentIcon}
      // disabled
    />
  </StyledPage>,
  document.getElementById('root'),
);
