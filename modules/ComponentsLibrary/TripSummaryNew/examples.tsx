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
      <ExampleTitle>Searchable</ExampleTitle>{' '}
      <TripSummaryNew
        perDiemRowIds={[rowIdToUse]}
        loggedUserId={101275}
        userId={0}
        searchable
        canAddTrips
      />
      <ExampleTitle>Toggle Button</ExampleTitle>{' '}
      <TripSummaryNew
        perDiemRowIds={[rowIdToUse]}
        loggedUserId={101275}
        userId={0}
        canProcessPayroll
      />
      <ExampleTitle>Checkboxes</ExampleTitle>{' '}
      <TripSummaryNew
        perDiemRowIds={[rowIdToUse]}
        loggedUserId={101275}
        userId={0}
        canProcessPayroll
        checkboxes
      />
      <ExampleTitle>Can Approve and Process Payroll</ExampleTitle>{' '}
      <TripSummaryNew
        perDiemRowIds={[rowIdToUse]}
        loggedUserId={101275}
        userId={0}
        canProcessPayroll
        canApprove
      />
    </>
  );
};
