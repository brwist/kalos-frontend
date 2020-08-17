import React from 'react';
import ReactDOM from 'react-dom';
import { TextList } from './main';
import { StyledPage } from '../PageWrapper/styled';

ReactDOM.render(
  <StyledPage>
    <TextList
      title="Example Title"
      contents={[
        { primary: 'First', secondary: 'Lorem ipsum' },
        { primary: 'Second', secondary: 'Dolor sit amet' },
        { primary: 'Third', secondary: 'Donec et iaculis augue' },
      ]}
    />
  </StyledPage>,
  document.getElementById('root')
);
