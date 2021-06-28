import React from 'react';
import { AddLog } from '.';
import { ExampleTitle } from '../helpers';

export default () => {
  return (
    <>
      <ExampleTitle>Default</ExampleTitle>
      <AddLog onClose={() => alert('Would close')} loggedUserId={101253} />
    </>
  );
};
