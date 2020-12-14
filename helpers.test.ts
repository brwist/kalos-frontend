import { Place } from '@kalos-core/kalos-rpc/Maps';
import { addressStringToPlace, getTripDistance } from './helpers';

test('addressStringToPlace should parse addresses from strings correctly', () => {
  let testStrings = [
    '3030 US Hwy 27 S, Sebring, FL',
    '3030 US 27 S, Sebring FL 33870',
    '3030 US 27 S, Sebring, FL 33870',
    '1655 S Redwood Rd, Salt Lake City, UT 84104',
    '13540 S Sunland Gin Rd, Arizona City, AZ 85123', // Testing if the state name in the city name will
    // throw it off
  ];

  let results: Place[] = [];

  testStrings.forEach(string => {
    results.push(addressStringToPlace(string));
  });

  let expected: Place[] = [
    new Place(),
    new Place(),
    new Place(),
    new Place(),
    new Place(),
  ];

  // Terrible how I set this up, but maybe if it's a huge issue we can refactor it
  // Just made it in haste

  expected[0].setStreetNumber(3030);
  expected[0].setRoadName('US Hwy 27 S');
  expected[0].setCity('Sebring');
  expected[0].setState('FL');

  expected[1].setStreetNumber(3030);
  expected[1].setRoadName('US 27 S');
  expected[1].setCity('Sebring');
  expected[1].setState('FL');
  expected[1].setZipCode('33870');

  expected[3].setStreetNumber(1655);
  expected[3].setRoadName('S Redwood Rd');
  expected[3].setCity('Salt Lake City');
  expected[3].setState('UT');
  expected[3].setZipCode('84104');

  expected[4].setStreetNumber(13540);
  expected[4].setRoadName('S Sunland Gin Rd');
  expected[4].setCity('Arizona City');
  expected[4].setState('AZ');
  expected[4].setZipCode('85123');

  expect(results[0].getStreetNumber()).toBe(expected[0].getStreetNumber());
  expect(results[0].getRoadName()).toBe(expected[0].getRoadName());
  expect(results[0].getCity()).toBe(expected[0].getCity());
  expect(results[0].getState()).toBe(expected[0].getState());

  expect(results[1].getStreetNumber()).toBe(expected[1].getStreetNumber());
  expect(results[1].getRoadName()).toBe(expected[1].getRoadName());
  expect(results[1].getCity()).toBe(expected[1].getCity());
  expect(results[1].getState()).toBe(expected[1].getState());
  expect(results[1].getZipCode()).toBe(expected[1].getZipCode());

  expect(results[2].getStreetNumber()).toBe(expected[1].getStreetNumber());
  expect(results[2].getRoadName()).toBe(expected[1].getRoadName());
  expect(results[2].getCity()).toBe(expected[1].getCity());
  expect(results[2].getState()).toBe(expected[1].getState());
  expect(results[2].getZipCode()).toBe(expected[1].getZipCode());

  expect(results[3].getStreetNumber()).toBe(expected[3].getStreetNumber());
  expect(results[3].getRoadName()).toBe(expected[3].getRoadName());
  expect(results[3].getCity()).toBe(expected[3].getCity());
  expect(results[3].getState()).toBe(expected[3].getState());
  expect(results[3].getZipCode()).toBe(expected[3].getZipCode());

  expect(results[4].getStreetNumber()).toBe(expected[4].getStreetNumber());
  expect(results[4].getRoadName()).toBe(expected[4].getRoadName());
  expect(results[4].getCity()).toBe(expected[4].getCity());
  expect(results[4].getState()).toBe(expected[4].getState());
  expect(results[4].getZipCode()).toBe(expected[4].getZipCode());
});
