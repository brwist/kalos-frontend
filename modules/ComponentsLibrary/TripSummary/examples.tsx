import React from 'react';
import { TripSummary } from './index';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Normal</ExampleTitle>
    <TripSummary perDiemRowIds={[1]} loggedUserId={101275} />

    <ExampleTitle>Cannot Delete Trips</ExampleTitle>
    <TripSummary perDiemRowIds={[1]} loggedUserId={101275} cannotDeleteTrips />

    <ExampleTitle>Viewing as Olbinski</ExampleTitle>
    <TripSummary perDiemRowIds={[1]} loggedUserId={101253} cannotDeleteTrips />

    <ExampleTitle>Viewing All Trips for Example Week 1</ExampleTitle>
    <TripSummary perDiemRowIds={[1]} loggedUserId={0} cannotDeleteTrips />
  </>
);
