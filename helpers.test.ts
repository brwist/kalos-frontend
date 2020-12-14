import { Place } from '@kalos-core/kalos-rpc/Maps';
import { addressStringToPlace } from './helpers';

test('addressStringToPlace should parse addresses from strings correctly', () => {
  let testStrings = [
    '3030 US Hwy 27 S, Sebring, FL',
    '3030 US 27 S, Sebring FL 33870',
  ];

  let results: Place[] = [];

  testStrings.forEach(string => {
    results.push(addressStringToPlace(string));
  });

  let expected: Place[] = [new Place(), new Place()];
  expected[0].setStreetNumber(3030);
  expected[0].setRoadName('US Hwy 27 S');
  expected[0].setCity('Sebring');
  expected[0].setState('FL');

  expected[1].setStreetNumber(3030);
  expected[1].setRoadName('US 27 S');
  expected[1].setCity('Sebring');
  expected[1].setState('FL');
  expected[1].setZipCode('33870');

  expect(results[0].getStreetNumber()).toBe(expected[0].getStreetNumber());
  expect(results[0].getRoadName()).toBe(expected[0].getRoadName());
  expect(results[0].getCity()).toBe(expected[0].getCity());
  expect(results[0].getState()).toBe(expected[0].getState());

  expect(results[1].getStreetNumber()).toBe(expected[1].getStreetNumber());
  expect(results[1].getRoadName()).toBe(expected[1].getRoadName());
  expect(results[1].getCity()).toBe(expected[1].getCity());
  expect(results[1].getState()).toBe(expected[1].getState());
  expect(results[1].getZipCode()).toBe(expected[1].getZipCode());
});
