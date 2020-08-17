import React from 'react';
import ReactDOM from 'react-dom';
import { Prompt } from './main';
import { StyledPage } from '../PageWrapper/styled';

ReactDOM.render(
  <StyledPage>
    <Prompt
      text="Example Text"
      prompt="Example prompt"
      confirmFn={console.log}
    />
  </StyledPage>,
  document.getElementById('root')
);
