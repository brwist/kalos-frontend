import React, { PureComponent, useCallback } from 'react';
import { MapClient, MatrixRequest } from '@kalos-core/kalos-rpc/Maps';
import {
  Coordinates,
  CoordinatesList,
  DistanceMatrixResponse,
  Place,
} from '@kalos-core/kalos-rpc/compiled-protos/kalosmaps_pb';
import { exception } from 'console';

interface KalosMapProps {
  isOpen: boolean;
  Addresses: { origin: Place[]; destination: Place };
  onDistanceCalculated: (distance: string) => void;
}

interface KalosMapState {}

export class KalosMap extends PureComponent<KalosMapProps, KalosMapState> {
  client: MapClient = new MapClient();
  constructor(props: KalosMapProps) {
    super(props);

    let val = this.makeDistanceMatrixRequest(this.createMatrixRequest());
  }

  // Gets the coordinates from the address
  geocode = async (place: Place) => {
    console.log('Running geocode');
    let coords = await this.client.Geocode(place); // this line throws the CORS

    console.log('Got geocode coords: ' + coords);
    return coords;
  };

  fillCoords = async () => {
    if (!this.props.Addresses.origin) return;
    for (var address of this.props.Addresses.origin) {
      if (!address.getCoords()) {
        address.setCoords(await this.geocode(address)); // Throwing CORS error from here from Geocode
        /*
        await this.geocode(address).then(async value => {
          console.log(`${value} gotten`);
          address.setCoords(value);
        });
        */
      }
    }
  };

  validateInput = (): boolean => {
    this.fillCoords();

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

  createMatrixRequest = (): MatrixRequest => {
    if (!this.validateInput()) {
      console.error(
        'There were issues with the props passed in to the KalosMap component.',
      );
      return new MatrixRequest();
    }
    let addresses = this.props.Addresses;
    let req = new MatrixRequest();

    req.setOriginsList(
      addresses.origin.map(origin => {
        return origin.getCoords()!;
      }),
    );

    req.setDestination(addresses.destination.getCoords());

    return req;
  };

  makeDistanceMatrixRequest = (req: MatrixRequest) => {
    let res = this.client.DistanceMatrix(req);

    return res;
  };

  render() {
    return <></>;
  }
}
