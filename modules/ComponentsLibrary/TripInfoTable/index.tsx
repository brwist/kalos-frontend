import React from 'react';
import { Button } from '../Button';
import { InfoTable } from '../InfoTable';
import { SectionBar } from '../SectionBar';
import { PlaceAutocompleteAddressForm } from '../PlaceAutocompleteAddressForm';
import {
  Trip,
  TripList,
} from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  PerDiemClientService,
  upsertTrip,
  getTripDistance,
  getCurrentPerDiemRowId,
} from '../../../helpers';
import { AddressPair } from '../PlaceAutocompleteAddressForm/Address';
import { Int32 } from '@kalos-core/kalos-rpc/compiled-protos/common_pb';
import { ConfirmDelete } from '../ConfirmDelete';
import { Schema } from '../Form';

// Schema will be adjusted down the line to include as many addresses as it can
export const SCHEMA_GOOGLE_MAP_INPUT_FORM: Schema<AddressPair.AsObject> = [
  [
    {
      label: 'Origin',
      headline: true,
    },
  ],
  [
    {
      label: 'Address',
      type: 'text',
      name: 'FullAddressOrigin',
    },
  ],
  [
    {
      label: 'Street Address',
      name: 'StreetAddressOrigin',
      type: 'text',
    },
    {
      label: 'City',
      name: 'CityOrigin',
      type: 'text',
    },
    {
      label: 'State',
      name: 'StateOrigin',
      type: 'text',
    },
  ],
  [
    {
      label: 'Country',
      name: 'CountryOrigin',
      type: 'text',
    },
    {
      label: 'Zip Code',
      name: 'ZipCodeOrigin',
      type: 'text',
    },
  ],
  [
    {
      label: 'Destination',
      headline: true,
    },
  ],
  [
    {
      label: 'Address',
      type: 'text',
      name: 'FullAddressDestination',
    },
  ],
  [
    {
      label: 'Street Address',
      name: 'StreetAddressDestination',
      type: 'text',
    },
    {
      label: 'City',
      name: 'CityDestination',
      type: 'text',
    },
    {
      label: 'State',
      name: 'StateDestination',
      type: 'text',
    },
  ],
  [
    {
      label: 'Country',
      name: 'CountryDestination',
      type: 'text',
    },
    {
      label: 'Zip Code',
      name: 'ZipCodeDestination',
      type: 'text',
    },
  ],
];

interface Props {
  perDiemRowId: number;
  loggedUserId: number;
  onSaveTrip?: (savedTrip?: Trip) => any;
  onDeleteTrip?: () => any;
  onDeleteAllTrips?: () => any;
}

interface State {
  pendingTrip: Trip | null;
  pendingTripToDelete: Trip | null;
  pendingDeleteAllTrips: boolean;
  trips: TripList;
  totalTripMiles: number;
}

export class TripInfoTable extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pendingTrip: null,
      trips: new TripList(),
      totalTripMiles: 0,
      pendingTripToDelete: null,
      pendingDeleteAllTrips: false,
    };
    this.updateTotalMiles();
    this.getTrips();
  }

  saveTrip = async (
    data: AddressPair.AsObject,
    rowId: number,
    userId: number,
  ) => {
    let trip = new Trip();

    trip.setOriginAddress(data.FullAddressOrigin);
    trip.setDestinationAddress(data.FullAddressDestination);

    await this.getTripDistance(
      String(data.FullAddressOrigin),
      String(data.FullAddressDestination),
    );

    const id = await getCurrentPerDiemRowId();

    if (id) {
      trip.setPerDiemRowId(id);
    } else {
      console.error('No perDiem found for this user. ');
    }

    console.log('TRIP WAS: ', trip);

    await upsertTrip(trip.toObject(), rowId, userId).then(() => {
      this.setState({ pendingTrip: null });
      this.getTrips();
    });
  };

  getTripDistance = async (origin: string, destination: string) => {
    try {
      await getTripDistance(origin, destination);
    } catch (error: any) {
      console.error(
        'An error occurred while calculating the trip distance: ',
        error,
      );
      alert(
        'An error occurred while calculating the trip distance. Please try again, or contact your administrator if this error persists.',
      );
    }
  };

  getTrips = async () => {
    let trip = new Trip();
    trip.setUserId(this.props.loggedUserId);
    const trips = await PerDiemClientService.BatchGetTrips(trip);
    console.log(trips);
    this.updateTotalMiles();
    this.setState({ trips: trips });
  };
  getTotalTripDistance = async (rowID: number) => {
    let i32 = new Int32();
    i32.setValue(rowID);
    return await PerDiemClientService.GetTotalRowTripDistance(i32);
  };
  updateTotalMiles = async () => {
    this.setState({
      totalTripMiles: (
        await this.getTotalTripDistance(this.props.perDiemRowId)
      ).getValue(),
    });
  };
  deleteTrip = async (trip: Trip) => {
    try {
      await PerDiemClientService.DeleteTrip(trip);
    } catch (err: any) {
      console.error('An error occurred while deleting a trip: ', err);
      alert(
        'The trip was not able to be deleted. Please try again, or if this keeps happening please contact your administrator.',
      );
      this.setState({ pendingTripToDelete: null });
      return Error(err);
    }
    this.setState({ pendingTripToDelete: null });
    this.getTrips();
  };
  deleteAllTrips = async () => {
    try {
      let i32 = new Int32();
      i32.setValue(this.props.perDiemRowId);
      await PerDiemClientService.BatchDeleteTrips(i32);
    } catch (err: any) {
      console.error(
        'An error occurred while deleting the trips for this week: ',
        err,
      );
      alert(
        'The trips were not able to be deleted. Please try again, or if this keeps happening please contact your administrator.',
      );
      this.setState({ pendingDeleteAllTrips: false });
      return;
    }
    this.setState({ pendingDeleteAllTrips: false });
    this.getTrips();
  };
  setStateToNew = (to: any) => {
    this.setState(to);
  };
  render() {
    console.log('Props set to: ', this.props.perDiemRowId);
    return (
      <>
        <Button
          label="Add Trip"
          size="small"
          variant="contained"
          onClick={() => this.setStateToNew({ pendingTrip: new Trip() })}
        />
        <SectionBar
          title="Total Miles This Week"
          footer={
            this.state.totalTripMiles != undefined &&
            this.state.totalTripMiles != 0.0
              ? this.state.totalTripMiles?.toFixed(1) + ' miles'
              : 'None'
          }
          small
        />
        <InfoTable
          columns={[
            { name: 'Origin' },
            { name: 'Destination' },
            {
              name: 'Miles',
            },
            {
              name: '',
              actions: [
                {
                  label: 'Delete All Trips',
                  compact: true,
                  variant: 'outlined',
                  size: 'xsmall',
                  onClick: () => {
                    this.setStateToNew({ pendingDeleteAllTrips: true });
                  },
                },
              ],
            },
          ]}
          data={this.state
            .trips!.getResultsList()
            .filter((trip: Trip) => {
              return trip.getPerDiemRowId() == this.props.perDiemRowId;
            })
            .map((currentTrip: Trip) => {
              return [
                { value: currentTrip.getOriginAddress() },
                { value: currentTrip.getDestinationAddress() },
                {
                  value: currentTrip.getDistanceInMiles().toFixed(1),
                },
                {
                  value: '',
                  actions: [
                    <IconButton
                      key={currentTrip.getId() + 'edit'}
                      size="small"
                      onClick={() =>
                        this.setStateToNew({
                          pendingTripToDelete: currentTrip,
                        })
                      }
                    >
                      <DeleteIcon />
                    </IconButton>,
                  ],
                },
              ];
            })}
          compact
        />
        {this.state.pendingTrip && (
          <PlaceAutocompleteAddressForm
            onClose={() => this.setStateToNew({ pendingTrip: null })}
            onSave={async (addressPair: AddressPair.AddressPair) => {
              this.saveTrip(
                addressPair,
                this.props.perDiemRowId,
                this.props.loggedUserId,
              );
            }}
            addressFields={2}
            schema={SCHEMA_GOOGLE_MAP_INPUT_FORM}
          ></PlaceAutocompleteAddressForm>
        )}
        {this.state.pendingTripToDelete && (
          <ConfirmDelete
            open={this.state.pendingTripToDelete != null}
            onClose={() => this.setStateToNew({ pendingTripToDelete: null })}
            kind="" // Purposely left blank for clarity purposes in the box
            name="this trip"
            onConfirm={() => this.deleteTrip(this.state.pendingTripToDelete!)}
          />
        )}
        {this.state.pendingDeleteAllTrips && (
          <ConfirmDelete
            open={this.state.pendingDeleteAllTrips}
            onClose={() => this.setStateToNew({ pendingDeleteAllTrips: false })}
            kind="" // Purposely left blank for clarity purposes in the box
            name="all of the trips in this week (this action cannot be undone)"
            onConfirm={() => this.deleteAllTrips()}
          />
        )}
      </>
    );
  }
}
