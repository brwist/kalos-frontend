import React from 'react';
import ReactDOM from 'react-dom';
import { JobSubtypePicker } from './JobSubtype';

ReactDOM.render(
  <JobSubtypePicker jobTypeID={8} selected={1} />,
  document.getElementById('root'),
);
