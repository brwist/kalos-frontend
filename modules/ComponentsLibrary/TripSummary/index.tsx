import React from 'react';
import { InfoTable } from '../InfoTable';
import { SectionBar } from '../SectionBar';
import {
  PerDiem,
  Trip,
  TripList,
} from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  PerDiemClientService,
  getTripDistance,
  UserClientService,
} from '../../../helpers';
import { AddressPair } from '../PlaceAutocompleteAddressForm/Address';
import { ConfirmDelete } from '../ConfirmDelete';
import { Schema } from '../Form';
import { Loader } from '../../Loader/main';
import { Int32 } from '@kalos-core/kalos-rpc/compiled-protos/common_pb';

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
  perDiemRowIds: number[];
  loggedUserId: number;
  canDeleteTrips?: boolean;
  compact?: boolean;
  hoverable?: boolean;
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
  key: number;
}

export class TripSummary extends React.PureComponent<Props, State> {
  nameIdPair: { name: string; id: number }[] = [];
  dateIdPair: { date: string; row_id: number }[] = [];
  constructor(props: Props) {
    super(props);
    this.state = {
      pendingTrip: null,
      trips: new TripList(),
      totalTripMiles: 0,
      pendingTripToDelete: null,
      pendingDeleteAllTrips: false,
      key: 0,
    };
    this.setTripState();
  }

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
  refreshNamesAndDates = async () => {
    await this.getUserNamesFromIds();
    await this.getRowDatesFromPerDiemIds();
  };

  loadTrips = async () => {
    let trips: Trip[] = [];

    return await new Promise<Trip[]>(async resolve => {
      for await (const id of this.props.perDiemRowIds) {
        let trip = new Trip();
        if (this.props.loggedUserId != 0)
          trip.setUserId(this.props.loggedUserId);
        trip.setPerDiemRowId(id);
        const tripResultList = (await PerDiemClientService.BatchGetTrips(trip))
          .getResultsList()
          .filter(trip => {
            let fail = false;
            if (this.state.trips.getResultsList().length == 0) {
              // If there's no state, we just add it in to the list - means this is
              // the first time loading after refresh
              return true;
            }
            this.state.trips.getResultsList().forEach(t => {
              if (t.getId() == trip.getId()) {
                fail = true;
              }
            });
            return !fail;
          });
        trips.push(...tripResultList);
      }
      resolve(trips);
    }).then(result => {
      return result;
    });
  };

  setTripState = async () => {
    await this.loadTrips().then(async result => {
      let list = new TripList();
      list.setResultsList(result);
      this.setState({ trips: list });
      await this.refreshNamesAndDates();
      await this.updateTotalMiles();
    });
  };

  getRowStartDateById = (rowId: number) => {
    if (this.dateIdPair.length == 0) return;
    for (let obj of this.dateIdPair) {
      if (obj.row_id == rowId) {
        return obj.date;
      }
    }

    return '-';
  };

  getRowDatesFromPerDiemIds = async () => {
    let res: { date: string; row_id: number }[] = [];

    new Promise(async resolve => {
      for await (const trip of this.state.trips.getResultsList()) {
        try {
          let pd = new PerDiem();
          pd.setId(trip.getPerDiemRowId());
          const pdr = await PerDiemClientService.Get(pd);
          const obj = {
            date: pdr.dateStarted,
            row_id: trip.getPerDiemRowId(),
          };
          if (!res.includes(obj)) res.push(obj);
        } catch (err: any) {
          console.error(
            'Error in promise for get row dates from per diem IDs (Verify Per Diem exists): ',
            err,
          );
        }
      }
      resolve(res);
    }).then(() => {
      this.dateIdPair = res;
      this.setState({ key: this.state.key + 1 });
      return res;
    });
  };

  getUserNamesFromIds = async () => {
    let res: { name: string; id: number }[] = [];

    this.state.trips.getResultsList().forEach(async (trip: Trip, idx, arr) => {
      try {
        let user = await UserClientService.loadUserById(trip.getUserId());
        let obj: { name: string; id: number } = {
          name: `${user.firstname} ${user.lastname}`,
          id: trip.getUserId(),
        };
        if (!res.includes(obj)) res.push(obj);
        if (idx == arr.length - 1) {
          this.nameIdPair = res;
          return res;
        }
      } catch (err: any) {
        console.error('Failed to get user names from IDs: ', err);
      }
    });
  };

  getNameById = (userId: number) => {
    if (this.nameIdPair.length == 0) {
      // Return - it's a bit early but it will be called at a later time when the state is set
      return '';
    }

    for (const obj of this.nameIdPair) {
      if (obj.id == userId) {
        return obj.name;
      }
    }
  };

  getTotalTripDistance = async () => {
    let dist = 0;

    await new Promise(async resolve => {
      let total = 0;

      for await (const trip of this.state.trips.getResultsList()) {
        total += trip.getDistanceInMiles();
      }

      resolve(total);
    }).then(val => {
      dist = Number(val);
    });
    return dist;
  };
  updateTotalMiles = async () => {
    this.setState({
      totalTripMiles: await this.getTotalTripDistance(),
    });
  };
  deleteTrip = async (trip: Trip) => {
    try {
      await PerDiemClientService.DeleteTrip(trip);
      let trips = this.state.trips;
      let t = this.state.trips.getResultsList().indexOf(trip);
      trips.getResultsList().splice(t, 1);
      this.setState({ trips: trips });
      if (this.props.onDeleteTrip) this.props.onDeleteTrip();
    } catch (err: any) {
      console.error('An error occurred while deleting a trip: ', err);
      alert(
        'The trip was not able to be deleted. Please try again, or if this keeps happening please contact your administrator.',
      );
      this.setState({ pendingTripToDelete: null });
      return Error(err);
    }
    this.setTripState();
    this.refreshNamesAndDates();
    this.setState({ pendingTripToDelete: null });
  };
  deleteAllTrips = async () => {
    this.props.perDiemRowIds.forEach(async id => {
      try {
        let trip = new Trip();
        trip.setPerDiemRowId(id);
        await PerDiemClientService.BatchDeleteTrips(trip);
        if (this.props.onDeleteAllTrips) this.props.onDeleteAllTrips();
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
    });
    this.setTripState();
    this.refreshNamesAndDates();
    this.setState({ pendingDeleteAllTrips: false });
  };
  setStateToNew = (to: any) => {
    this.setState(to);
  };
  render() {
    return (
      <>
        <SectionBar
          title="Total Miles This Week"
          footer={
            this.state.totalTripMiles != undefined &&
            this.state.totalTripMiles != 0.0
              ? this.state.totalTripMiles?.toFixed(1) + ' miles'
              : 'None'
          }
          small={this.props.compact ? true : false}
        />
        <>
          {this.props.canDeleteTrips && (
            <InfoTable
              key={
                this.state.key +
                String(this.dateIdPair) +
                String(this.nameIdPair)
              }
              columns={[
                { name: 'Origin' },
                { name: 'Destination' },
                { name: 'Name' },
                { name: 'Week Of' },
                { name: 'Miles' },
                {
                  name: 'Notes',
                  actions: [
                    {
                      label: 'Delete All Trips',
                      compact: this.props.compact ? true : false,
                      variant: 'outlined',
                      size: 'xsmall',
                      onClick: () => {
                        this.setStateToNew({ pendingDeleteAllTrips: true });
                      },
                      burgeronly: 1,
                    },
                  ],
                },
              ]}
              data={this.state
                .trips!.getResultsList()
                .map((currentTrip: Trip) => {
                  return [
                    { value: currentTrip.getOriginAddress() },
                    { value: currentTrip.getDestinationAddress() },
                    { value: this.getNameById(currentTrip.getUserId()) }, // Need to use UserClientService on it
                    {
                      value: this.getRowStartDateById(
                        currentTrip.getPerDiemRowId(),
                      )?.split(' ')[0],
                    },
                    {
                      value: currentTrip.getDistanceInMiles().toFixed(1),
                    },
                    {
                      value: currentTrip.getNotes(),
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
              compact={this.props.compact ? true : false}
              hoverable={this.props.hoverable ? true : false}
            />
          )}
          {!this.props.canDeleteTrips && (
            <InfoTable
              key={this.state.key}
              columns={[
                { name: 'Origin' },
                { name: 'Destination' },
                { name: 'Name' },
                { name: 'Week Of' },
                { name: 'Miles' },
                {
                  name: 'Notes',
                },
              ]}
              data={this.state
                .trips!.getResultsList()
                .map((currentTrip: Trip) => {
                  return [
                    { value: currentTrip.getOriginAddress() },
                    { value: currentTrip.getDestinationAddress() },
                    { value: this.getNameById(currentTrip.getUserId()) },
                    {
                      value: this.getRowStartDateById(
                        currentTrip.getPerDiemRowId(),
                      )?.split(' ')[0],
                    },
                    {
                      value: currentTrip.getDistanceInMiles().toFixed(1),
                    },
                    {
                      value: currentTrip.getNotes(),
                    },
                  ];
                })}
              compact={this.props.compact ? true : false}
              hoverable={this.props.hoverable ? true : false}
            />
          )}
        </>
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
