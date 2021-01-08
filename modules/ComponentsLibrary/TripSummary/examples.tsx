import React from 'react';
import { TripSummary } from './index';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Default (Viewing as Chernov)</ExampleTitle>
    <TripSummary perDiemRowIds={[1]} loggedUserId={101275} />

    <ExampleTitle>Compact (Viewing as Chernov)</ExampleTitle>
    <TripSummary perDiemRowIds={[1]} loggedUserId={101275} compact />

    <ExampleTitle>Hoverable (Viewing as Chernov)</ExampleTitle>
    <TripSummary perDiemRowIds={[1]} loggedUserId={101275} hoverable />

    <ExampleTitle>Viewing as Olbinski</ExampleTitle>
    <TripSummary perDiemRowIds={[1]} loggedUserId={101253} />

    <ExampleTitle>Viewing All Trips for Example Week 1</ExampleTitle>
    {/* You can add in 0 as the logged user id to view all users for that week */}
    <TripSummary perDiemRowIds={[1]} loggedUserId={0} />

    <ExampleTitle>Can Delete Trips (Viewing as Chernov)</ExampleTitle>
    <TripSummary perDiemRowIds={[1]} loggedUserId={101275} canDeleteTrips />
  </>
);
