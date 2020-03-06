import React from 'react';
import ReactDOM from 'react-dom';
import WeekPicker from './main';

const date = new Date();

ReactDOM.render(<WeekPicker label="Choose Week" value={date} onChange={() => {}} />, document.getElementById('root'));
