import React from 'react';
import { TripSummary } from './index';
import { ExampleTitle } from '../helpers';

const rowIdToUse = 501;

export default () => (
  <>
    <ExampleTitle>Default (Viewing as Chernov)</ExampleTitle>
    <TripSummary
      perDiemRowIds={[rowIdToUse]}
      userId={101275}
      loggedUserId={101275}
    />

    <ExampleTitle>Compact (Viewing as Chernov)</ExampleTitle>
    <TripSummary
      perDiemRowIds={[rowIdToUse]}
      userId={101275}
      loggedUserId={101275}
      compact
    />

    <ExampleTitle>Hoverable (Viewing as Chernov)</ExampleTitle>
    <TripSummary
      perDiemRowIds={[rowIdToUse]}
      userId={101275}
      loggedUserId={101275}
      hoverable
    />

    <ExampleTitle>Viewing as Olbinski</ExampleTitle>
    <TripSummary
      perDiemRowIds={[rowIdToUse]}
      userId={101253}
      loggedUserId={101275}
    />

    <ExampleTitle>Viewing All Trips for Example Week 1</ExampleTitle>
    {/* You can add in 0 as the logged user id to view all users for that week */}
    <TripSummary
      perDiemRowIds={[rowIdToUse]}
      loggedUserId={101275}
      userId={0}
    />

    <ExampleTitle>Checkboxes (Viewing as Chernov)</ExampleTitle>
    <TripSummary
      perDiemRowIds={[rowIdToUse]}
      userId={101275}
      loggedUserId={101275}
      checkboxes
    />

    <ExampleTitle>Can Delete Trips (Viewing as Chernov)</ExampleTitle>
    <TripSummary
      perDiemRowIds={[1]}
      userId={101275}
      loggedUserId={101275}
      canDeleteTrips
    />

    <ExampleTitle>Can Process Payroll (Viewing as Chernov)</ExampleTitle>
    <TripSummary
      perDiemRowIds={[rowIdToUse]}
      userId={101275}
      loggedUserId={101275}
      canProcessPayroll
    />

    <ExampleTitle>Searchable (Viewing as Chernov)</ExampleTitle>
    <TripSummary
      perDiemRowIds={[rowIdToUse]}
      userId={101275}
      loggedUserId={101275}
      searchable
    />

    <ExampleTitle>Can add trips (Viewing as Chernov)</ExampleTitle>
    <TripSummary
      perDiemRowIds={[rowIdToUse]}
      userId={101275}
      loggedUserId={101275}
      canAddTrips
    />
  </>
);
