// @ts-nocheck
// ! Obviously never ever use this in any capacity outside this file, which is specifically meant to throw an error
// Note that this can only catch errors inside React components during the render cycle.
import React, { FC, useEffect } from 'react';
import { ErrorBoundary } from './';
import { ExampleTitle } from '../helpers';

const Func: FC<{}> = () => {
  useEffect(() => {
    // Fails on purpose
    throw new Error('TESTING');
  });
  return <></>;
};

export default () => (
  <>
    <ExampleTitle>default</ExampleTitle>
    <ErrorBoundary>
      <Func></Func>
    </ErrorBoundary>
  </>
);
