import React, { PureComponent, useCallback } from 'react';
import { MapClient, MatrixRequest } from '../../../@kalos-core/kalos-rpc/Maps';
import {
  DistanceMatrixResponse,
  Place,
} from '../../../@kalos-core/kalos-rpc/compiled-protos/kalosmaps_pb';
import { ENDPOINT } from '../../../constants';

interface KalosMapProps {
  isOpen: boolean;
  Addresses: { origin: Place[]; destination: Place };
  onDistanceCalculated: (distance: string) => void;
}

enum PartsOfDistanceMatrixRequest {
  DistanceHumanReadable,
  DistanceMeters,
  DistanceMiles,
  Status,
}

interface KalosMapState {}

export class KalosMap extends PureComponent<KalosMapProps, KalosMapState> {
  client: MapClient = new MapClient(ENDPOINT);
  constructor(props: KalosMapProps) {
    super(props);

    this.createMatrixRequest().then(async request => {
      if (request == undefined) {
        console.error('Failed to create a matrix request.');
        return;
      }
      await this.makeDistanceMatrixRequest(request);
    });
  }

  // Gets the coordinates from the address
  geocode = async (place: Place) => {
    let coords = await this.client.Geocode(place); // this line throws the CORS
    return coords;
  };

  metersToMiles(meters: number): number {
    const conversionFactor = 0.000621;
    return meters * conversionFactor;
  }

  parseDistanceMatrixResponse = (
    req: DistanceMatrixResponse,
    desired: PartsOfDistanceMatrixRequest,
  ) => {
    // [2] -> [0] -> [0] -> [0]
    // status: req.toArray()[2][0][0][0][0]
    // distance: req.toArray()[2][0][0][0][1]
    // distance (human readable): req.toArray()[2][0][0][0][3][0]
    // distance (meters): req.toArray()[2][0][0][0][3][1]

    switch (desired) {
      case PartsOfDistanceMatrixRequest.DistanceHumanReadable:
        return req.toArray()[2][0][0][0][3][0];
      case PartsOfDistanceMatrixRequest.DistanceMeters:
        return req.toArray()[2][0][0][0][3][1];
      case PartsOfDistanceMatrixRequest.DistanceMiles:
        return this.metersToMiles(req.toArray()[2][0][0][0][3][1]);
      case PartsOfDistanceMatrixRequest.Status:
        return req.toArray()[2][0][0][0][0];
    }
  };

  fillCoords = async () => {
    if (!this.props.Addresses.origin) return;
    for (var address of this.props.Addresses.origin) {
      if (!address.getCoords()) {
        address.setCoords(await this.geocode(address));
      }
    }
  };

  validateInput = async () => {
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
    let valid = await this.validateInput();
    if (!valid) {
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

    let destCoords = await this.client.Geocode(addresses.destination);

    if (destCoords == undefined) {
      console.error(
        'Could not Geocode the address given: ' + addresses.destination,
      );
      return;
    }

    req.setDestination(destCoords);

    return req;
  };

  makeDistanceMatrixRequest = async (req: MatrixRequest) => {
    const res = await this.client.DistanceMatrix(req);
    const status = this.parseDistanceMatrixResponse(
      res,
      PartsOfDistanceMatrixRequest.Status,
    );
    const distance = this.parseDistanceMatrixResponse(
      res,
      PartsOfDistanceMatrixRequest.DistanceHumanReadable,
    );

    if (status != 'OK' && status != 'ZERO_RESULTS') {
      console.error(
        "DistanceMatrixResponse status was not 'OK' and was not 'ZERO_RESULTS'. Status: " +
          status,
      );
    } else if (status == 'ZERO_RESULTS') {
      console.log('DistanceMatrixResponse contained zero results.');
    }
    if (status == 'OK' && distance != '') {
      this.props.onDistanceCalculated(distance);
    }

    return res;
  };

  render() {
    return <></>;
  }
}
