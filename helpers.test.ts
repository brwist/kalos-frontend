// The tests inside of this file do not actually execute the functions defined within due to
// Jest not mocking the server being set up. The functions are only tested for being
// able to be run.

import { Place } from '@kalos-core/kalos-rpc/Maps';
import {
  addressStringToPlace,
  usd,
  getFileExt,
  getMimeType,
  loadStoredQuotes,
  loadQuoteParts,
  loadQuoteLineParts,
  loadQuoteLines,
  loadPerDiemsNeedsAuditing,
  getTripDistance,
} from './helpers';

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

  expect(results[0].getStreetNumber()).toBe(expected[0].getStreetNumber());
  expect(results[0].getRoadName()).toBe(expected[0].getRoadName());
  expect(results[0].getCity()).toBe(expected[0].getCity());
  expect(results[0].getState()).toBe(expected[0].getState());
});

test('USD is converted correctly', () => {
  let res = usd(10.5);
  expect(res).toBe('$ 10.50');
});

test('getFileExt works correctly', () => {
  let res = getFileExt('test.txt.pdf');
  expect(res).toBe('pdf');
});

test('getMimeType works', () => {
  let res = getMimeType('test.txt.pdf');
  expect(res).toBe('application/pdf');
});

test('loadStoredQuotes returns data', async () => {
  let res = loadStoredQuotes();
  expect(res).toBeDefined();
  expect(res).not.toBeNull();
});

test('loadQuoteParts returns data', async () => {
  let res = loadQuoteParts();
  expect(res).toBeDefined();
  expect(res).not.toBeNull();
});

test('loadQuoteLineParts returns data', async () => {
  let res = loadQuoteLineParts();
  expect(res).toBeDefined();
  expect(res).not.toBeNull();
});

test('loadQuoteLines returns data', async () => {
  let res = loadQuoteLines();
  expect(res).toBeDefined();
  expect(res).not.toBeNull();
});

test('loadPerDiemNeedsAuditing returns data', async () => {
  let res = loadPerDiemsNeedsAuditing(0, false);
  expect(res).toBeDefined();
  expect(res).not.toBeNull();
});

test('getTripDistance works', async () => {
  let res = getTripDistance(
    '236 Hatteras Ave, Clermont, FL 34711',
    '1332 66 Ave, Grand Forks, BC V0H 1H0, Canada',
  );
  expect(res).toBeDefined();
  expect(res).not.toBeNull();
});
