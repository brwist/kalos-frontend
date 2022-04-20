import { grpc } from '@improbable-eng/grpc-web';
import { MapService } from '../compiled-protos/kalosmaps_pb_service';
import {
  Coordinates,
  Place,
  MatrixRequest,
  DistanceMatrixResponse,
} from '../compiled-protos/kalosmaps_pb';
import { Double } from '../compiled-protos/common_pb';
import {
  UnaryRpcOptions,
  UnaryOutput,
} from '@improbable-eng/grpc-web/dist/typings/unary';
import { ApiKeyClient } from '../ApiKey';
import { BaseClient } from '../BaseClient';
import { ENDPOINT } from '../constants';

class MapClient extends BaseClient {
  ApiKeyClient: ApiKeyClient;
  constructor(host?: string, userID?: number) {
    super(host, userID);
    this.ApiKeyClient = new ApiKeyClient(ENDPOINT);
  }

  public async Elevation(req: Coordinates) {
    return new Promise<number>((resolve, reject) => {
      const opts: UnaryRpcOptions<Coordinates, Double> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (output: UnaryOutput<Double>) => {
          if (output.message) {
            resolve(output.message.getValue());
          } else {
            reject(output.statusMessage);
          }
        },
      };
      grpc.unary(MapService.Elevation, opts);
    });
  }

  public async DistanceMatrix(req: MatrixRequest) {
    return new Promise<DistanceMatrixResponse>((resolve, reject) => {
      const opts: UnaryRpcOptions<MatrixRequest, DistanceMatrixResponse> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (output: UnaryOutput<DistanceMatrixResponse>) => {
          if (output.message) {
            resolve(output.message);
          } else {
            reject(output.statusMessage);
          }
        },
      };
      grpc.unary(MapService.DistanceMatrix, opts);
    });
  }

  public async Geocode(req: Place) {
    return new Promise<Coordinates>((resolve, reject) => {
      const opts: UnaryRpcOptions<Place, Coordinates> = {
        request: req,
        host: this.host,
        metadata: this.getMetaData(),
        onEnd: (output: UnaryOutput<Coordinates>) => {
          if (output.message) {
            resolve(output.message);
          } else {
            reject(output.statusMessage);
          }
        },
      };
      grpc.unary(MapService.Geocode, opts);
    });
  }

  public getTripDistance = async (origin: string, destination: string) => {
    try {
      const matReq = new MatrixRequest();
      let sortable = [];
      sortable.push(origin, destination);
      sortable.sort((a, b) => (a < b ? -1 : 1));
      const placeOrigin = addressStringToPlace(sortable[0]);
      const placeDestination = addressStringToPlace(sortable[1]);

      const coordsOrigin = await this.Geocode(placeOrigin);
      const coordsDestination = await this.Geocode(placeDestination);

      matReq.addOrigins(coordsOrigin);
      matReq.setDestination(coordsDestination);
      const tripDistance = await this.DistanceMatrix(matReq);
      let status: string = '';
      let duration: number;
      let distanceMeters: number | undefined;
      let distanceMiles: number;
      if (tripDistance.getRowsList().length > 1) {
        console.error('More than one row returned for Trip calculation.');
      } else {
        const rowReturned = tripDistance.getRowsList()[0];
        rowReturned.getDistancematrixelementList().forEach(listObj => {
          distanceMeters = listObj.getDistance()?.getMeters();
          duration = listObj.getDuration();
          status = listObj.getStatus();
        });
        console.log('Row: ', rowReturned.getDistancematrixelementList());
        console.log('Distance in meters: ', distanceMeters);
        console.log('Status: ', status);
      }

      if (status != 'OK') {
        console.error("Status was not 'OK' on distanceMatrixRequest.");
        console.error('Status was: ', status);
      }

      distanceMiles = metersToMiles(distanceMeters ? distanceMeters : 0);

      return { distance: distanceMiles, duration: duration };
    } catch (err) {
      console.error(
        'An error occurred while calculating the trip distance: ' + err
      );
      throw new Error(err);
    }
  };
  public async loadGeoLocationByAddress(address: string) {
    try {
      const res = await this.ApiKeyClient.getKeyByKeyName('google_maps');
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${res.getApiKey()}`
      );
      const data = await response.json();
      const {
        results: [
          {
            geometry: {
              location: { lat, lng },
            },
          },
        ],
      } = data;
      return {
        geolocationLat: +lat.toFixed(7),
        geolocationLng: +lng.toFixed(7),
      };
    } catch (e) {
      console.error(
        'Could not load geolocation by address. This error occurred:  ',
        e
      );
    }
  }
}

const metersToMiles = (meters: number): number => {
  const conversionFactor = 0.000621;
  return !Number.isNaN(meters * conversionFactor)
    ? meters * conversionFactor
    : 0;
};

const addressStringToPlace = (addressString: string): Place => {
  let pl = new Place();
  // Can detect the zip code by the fact it's all numbers in USA and always
  // comes after everything else
  // Can detect the road name because it's always followed by commas
  const split = addressString.split(',');
  let streetAddress = split[0];
  let city = split[1]; // Gotta check on this one, may include the state
  let state = '',
    zipCode = '';
  let zipAndState = split.length > 2 ? split[2] : null;
  for (let str in city.split(' ')) {
    // If this doesn't work, it probably is next to the zip code
    if (
      Object.values(STATE_CODES).indexOf(String(str)) > -1 ||
      Object.keys(STATE_CODES).indexOf(String(str)) > -1
    ) {
      // This is a state
      state = str;
      city = city.replace(str, '');
      break;
    }
  }

  if (zipAndState) {
    zipAndState.split(' ').forEach(str => {
      if (
        (state == '' && Object.values(STATE_CODES).indexOf(String(str)) > -1) ||
        Object.keys(STATE_CODES).indexOf(String(str)) > -1
      ) {
        // This is a state
        state = str;
      }
      if (!isNaN(Number(str))) {
        zipCode = str;
      }
    });
  }
  const streetInfo = streetAddress.split(' ');
  let streetNumber = 0; // figuring this out in the loop
  if (!isNaN(Number(streetInfo[0]))) {
    streetNumber = Number(streetInfo[0]);
  }

  if (zipCode === '') {
    // still need to set this, so there must be only split[1]
    split[split.length - 1].split(' ').forEach(str => {
      if (!isNaN(Number(str))) {
        zipCode = str;
      }
    });
  }

  if (state === '') {
    // We really need to set this, see if anything in the last split has any states in it
    split[split.length - 1].split(' ').forEach(str => {
      if (
        (state == '' && Object.values(STATE_CODES).indexOf(String(str)) > -1) ||
        Object.keys(STATE_CODES).indexOf(String(str)) > -1
      ) {
        // This is a state
        state = str;
        city = city.replace(str, '');
        city = zipCode != '' ? city.replace(zipCode, '') : city;
      }
    });
  }

  streetAddress = streetAddress.replace(String(streetNumber), '');
  streetAddress = streetAddress.trim();
  city = city.trim();
  state = state.trim();

  pl.setStreetNumber(streetNumber);
  pl.setRoadName(streetAddress);
  pl.setCity(city);
  pl.setState(state);
  pl.setZipCode(zipCode);

  return pl;
};

export const STATE_CODES = {
  alabama: 'AL',
  alaska: 'AK',
  'american samoa': 'AS',
  arizona: 'AZ',
  arkansas: 'AR',
  california: 'CA',
  colorado: 'CO',
  connecticut: 'CT',
  delaware: 'DE',
  'district of columbia': 'DC',
  'federated states of micronesia': 'FM',
  florida: 'FL',
  georgia: 'GA',
  guam: 'GU',
  hawaii: 'HI',
  idaho: 'ID',
  illinois: 'IL',
  indiana: 'IN',
  iowa: 'IA',
  kansas: 'KS',
  kentucky: 'KY',
  louisiana: 'LA',
  maine: 'ME',
  'marshall islands': 'MH',
  maryland: 'MD',
  massachusetts: 'MA',
  michigan: 'MI',
  minnesota: 'MN',
  mississippi: 'MS',
  missouri: 'MO',
  montana: 'MT',
  nebraska: 'NE',
  nevada: 'NV',
  'new hampshire': 'NH',
  'new jersey': 'NJ',
  'new mexico': 'NM',
  'new york': 'NY',
  'north carolina': 'NC',
  'north dakota': 'ND',
  'northern mariana islands': 'MP',
  ohio: 'OH',
  oklahoma: 'OK',
  oregon: 'OR',
  palau: 'PW',
  pennsylvania: 'PA',
  'puerto rico': 'PR',
  'rhode island': 'RI',
  'south carolina': 'SC',
  'south dakota': 'SD',
  tennessee: 'TN',
  texas: 'TX',
  utah: 'UT',
  vermont: 'VT',
  'virgin islands': 'VI',
  virginia: 'VA',
  washington: 'WA',
  'west virginia': 'WV',
  wisconsin: 'WI',
  wyoming: 'WY',
};

export { Coordinates, Place, MatrixRequest, MapClient };
