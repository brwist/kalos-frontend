import React, { PureComponent, useCallback } from 'react';
import { MapClient, MatrixRequest } from '@kalos-core/kalos-rpc/Maps';
import {
  MapService,
  MapServiceDistanceMatrix,
} from '@kalos-core/kalos-rpc/compiled-protos/kalosmaps_pb_service';

import {
  Coordinates,
  CoordinatesList,
  DistanceMatrixResponse,
  Place,
} from '@kalos-core/kalos-rpc/compiled-protos/kalosmaps_pb';
import { exception } from 'console';
import { ENDPOINT } from '../../../constants';

interface KalosMapProps {
  isOpen: boolean;
  Addresses: { origin: Place[]; destination: Place };
  onDistanceCalculated: (distance: string) => void;
}

interface KalosMapState {}

export class KalosMap extends PureComponent<KalosMapProps, KalosMapState> {
  client: MapClient = new MapClient(ENDPOINT);
  constructor(props: KalosMapProps) {
    super(props);

    this.createMatrixRequest().then(async request => {
      console.log('Request: ');
      console.log(request);
      let req = await this.makeDistanceMatrixRequest(request);
      console.log(req);
    });
  }

  // Gets the coordinates from the address
  geocode = async (place: Place) => {
    console.log('Running geocode');
    let coords = await this.client.Geocode(place); // this line throws the CORS

    console.log('Got geocode coords: ' + coords);
    return coords;
  };

  fillCoords = async () => {
    console.log('Filling coords');
    if (!this.props.Addresses.origin) return;
    for (var address of this.props.Addresses.origin) {
      if (!address.getCoords()) {
        address.setCoords(await this.geocode(address)); // Throwing CORS error from here from Geocode

        console.log('Set coords as ' + address.getCoords());
      }
    }
  };

  validateInput = async () => {
    console.log('Validating input');
    await this.fillCoords();

    if (!this.props.Addresses.origin) {
      console.error('There are no origins for the Places passed in.');
      return false;
    }

    this.props.Addresses.origin.forEach(async address => {
      if (!address.getCoords()) {
        console.error(`Coordinates not set for address ${address}.`);
        return false;
      }
    });

    return true;
  };

  createMatrixRequest = async () => {
    console.log('Creating matrix request');
    let valid = await this.validateInput();
    if (!valid) {
      console.error(
        'There were issues with the props passed in to the KalosMap component.',
      );
      return new MatrixRequest();
    }
    let addresses = this.props.Addresses;
    console.log('Addresses: ');
    console.log(addresses.destination.getCoords());
    console.log(addresses.origin);
    let req = new MatrixRequest();

    req.setOriginsList(
      addresses.origin.map(origin => {
        return origin.getCoords()!;
      }),
    );

    console.log(
      'Setting destination from ' + addresses.destination.getCoords(),
    );

    let destCoords = await this.client.Geocode(addresses.destination);

    req.setDestination(destCoords);

    return req;
  };

  makeDistanceMatrixRequest = (req: MatrixRequest) => {
    console.log('Making matrix request');
    let res = this.client.DistanceMatrix(req);

    console.log('Returning');
    return res;
  };

  render() {
    return <></>;
  }
}
