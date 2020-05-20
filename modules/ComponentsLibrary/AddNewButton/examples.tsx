import React from 'react';
import { AddNewButton } from './';
import Facebook from '@material-ui/icons/Facebook';
import Twitter from '@material-ui/icons/Twitter';
import LinkedIn from '@material-ui/icons/LinkedIn';

const addNewOptions = [
  { icon: <Facebook />, name: 'Facebook', url: 'https://facebook.com' },
  { icon: <Twitter />, name: 'Twitter', url: 'https://twitter.com' },
  { icon: <LinkedIn />, name: 'LinkedIn', url: 'https://linkedin.com' },
];

export default () => <AddNewButton options={addNewOptions} />;
