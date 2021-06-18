import React from 'react';
import { TripSummaryNew } from '.';
import { ExampleTitle } from '../helpers';
const rowIdToUse = 501;

export default () => {
  return (
    <>
      <ExampleTitle>Default</ExampleTitle>{' '}
      <TripSummaryNew
        perDiemRowIds={[rowIdToUse]}
        loggedUserId={101275}
        userId={0}
      />
    </>
  );
};
