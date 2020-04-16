import React from 'react';
import { AddNewButton } from './';
import { Facebook, Twitter, LinkedIn } from '@material-ui/icons';

const addNewOptions = [
  { icon: <Facebook />, name: 'Facebook', url: 'https://facebook.com' },
  { icon: <Twitter />, name: 'Twitter', url: 'https://twitter.com' },
  { icon: <LinkedIn />, name: 'LinkedIn', url: 'https://linkedin.com' },
];

export default () => <AddNewButton options={addNewOptions} />;
