import React from 'react';
import renderer from 'react-test-renderer';
import { KalosMap } from './index';
import { Place } from '@kalos-core/kalos-rpc/compiled-protos/kalosmaps_pb';

test('SearchIndex renders correctly', () => {
  const origin = new Place(),
    destination = new Place();

  origin.setStreetNumber(3030);
  origin.setRoadName('US Hwy 27 S');
  origin.setCity('Sebring');
  origin.setState('FL');
  origin.setCountry('United States');

  destination.setStreetNumber(75);
  destination.setRoadName('Harold St');
  destination.setCity('Sydney');
  destination.setState('NS B1P 3M2');
  destination.setCountry('Canada');

  let distance = '';

  const tree = renderer
    .create(
      <KalosMap
        isOpen
        Addresses={{
          origin: [origin],
          destination: destination,
        }}
        onDistanceCalculated={(dist: any) => {
          distance = dist;
        }}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot(); // Rendered correctly
});
