import React from 'react';
import { Button } from '../Button';
import { InfoTable } from '../InfoTable';
import { SectionBar } from '../SectionBar';
import { PlaceAutocompleteAddressForm } from '../PlaceAutocompleteAddressForm';
import { Alert } from '../Alert';
import Typography from '@material-ui/core/Typography';
import {
  Trip,
  TripList,
} from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  PerDiemClientService,
  UserClientService,
  TimesheetDepartmentClientService,
  MapClientService,
} from '../../../helpers';
import { AddressPair } from '../PlaceAutocompleteAddressForm/Address';
import { ConfirmDelete } from '../ConfirmDelete';
import { Schema } from '../Form';
import { Loader } from '../../Loader/main';
import { User } from '@kalos-core/kalos-rpc/compiled-protos/user_pb';

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
  [
    {
      label: 'Notes',
      headline: true,
    },
  ],
  [
    {
      label: 'Notes',
      name: 'Notes',
      type: 'text',
      multiline: true,
    },
  ],
  [
    {
      label: 'Was this Trip To/From Home?',
      name: 'HomeTravel',
      type: 'checkbox',
      required: false,
    },
  ],
  [
    {
      name: 'JobNumber',
      label: 'Job Number',
      type: 'eventId',
    },
  ],
  [
    {
      label: 'Time of Trip Start',
      name: 'Date',
      type: 'mui-datetime',
      minutesStep: 1,
    },
    {
      label: 'Time of Trip End',
      name: 'DateEnded',
      type: 'mui-datetime',
      minutesStep: 1,
    },
  ],
];

interface Props {
  perDiemRowIds: number[];
  loggedUserId: number;
  canAddTrips?: boolean;
  canDeleteTrips?: boolean;
  textAlignment?: 'left' | 'right' | 'center';
  onSaveTrip?: (savedTrip?: Trip) => any;
  onDeleteTrip?: () => any;
  onDeleteAllTrips?: () => any;
  onNoPerDiem?: () => any;
}

interface State {
  pendingTrip: Trip | null;
  pendingTripToDelete: Trip | null;
  pendingDeleteAllTrips: boolean;
  trips: TripList;
  totalTripMiles: number;
  loadingTrips: boolean;
  warningNoPerDiem: boolean; // When there is no per-diem this is true and it displays
  // a dialogue
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
      loadingTrips: false,
      warningNoPerDiem: false,
    };
    this.updateTotalMiles();
  }

  componentDidMount() {
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

    if (rowId) {
      trip.setPerDiemRowId(rowId);
    } else {
      // console.error('No perDiem found for this user. ');
      // //this.setState({ warningNoPerDiem: true });
      // this.setState({ pendingTrip: null });
      // this.getTrips();
      // return;
    }

    trip.setNotes(data.Notes);
    trip.setJobNumber(data.JobNumber);
    trip.setDate(data.Date);

    const user = await UserClientService.loadUserById(this.props.loggedUserId);
    trip.setDepartmentId(user.getEmployeeDepartmentId());

    await PerDiemClientService.upsertTrip(trip, rowId!, userId).then(() => {
      this.setState({ pendingTrip: null });
      this.getTrips();
    });

    if (this.props.onSaveTrip) this.props.onSaveTrip();
  };

  getTripDistance = async (origin: string, destination: string) => {
    try {
      await MapClientService.getTripDistance(origin, destination);
    } catch (error: any) {
      console.error(
        'An error occurred while calculating the trip distance in the Trip Info Table: ',
        error,
      );
      alert(
        'An error occurred while calculating the trip distance in the Trip Info Table. Please try again, or contact your administrator if this error persists.',
      );
    }
  };

  getTrips = async () => {
    let trip = new Trip();
    trip.setUserId(this.props.loggedUserId);
    this.setState({ loadingTrips: true });
    const trips = await PerDiemClientService.BatchGetTrips(trip);
    this.updateTotalMiles();
    this.setState({ trips: trips });
    this.setState({ loadingTrips: false });
  };
  getTotalTripDistance = async (rowID: number) => {
    return await PerDiemClientService.getTotalRowTripDistanceWithUserID(
      this.props.loggedUserId,
      rowID,
    );
  };
  updateTotalMiles = async () => {
    if (
      this.props.perDiemRowIds == undefined ||
      this.props.perDiemRowIds.length == 0
    ) {
      return;
    }
    let totalMiles = 0;
    this.props.perDiemRowIds.forEach(async (id, idx, arr) => {
      totalMiles += await this.getTotalTripDistance(id);
      if (idx == arr.length - 1) {
        this.setState({
          totalTripMiles: totalMiles,
        });
      }
    });
  };
  deleteTrip = async (trip: Trip) => {
    try {
      await PerDiemClientService.DeleteTrip(trip);
      if (this.props.onDeleteTrip) this.props.onDeleteTrip();
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
    this.props.perDiemRowIds.forEach(async id => {
      try {
        let trip = new Trip();
        trip.setPerDiemRowId(id);
        trip.setUserId(this.props.loggedUserId);
        await PerDiemClientService.BatchDeleteTrips(trip);
        if (this.props.onDeleteAllTrips) this.props.onDeleteAllTrips();
      } catch (err: any) {
        console.log(
          'An error occurred while deleting the trips for this week: ',
          err,
        );
      }
    });

    this.setState({ pendingDeleteAllTrips: false });
    this.getTrips();
  };
  setStateToNew = (to: any) => {
    this.setState(to);
  };
  render() {
    return (
      <>
        {this.props.canAddTrips && (
          <Button
            label="Add Trip"
            size="small"
            variant="contained"
            onClick={() => {
              if (
                this.props.perDiemRowIds == undefined ||
                this.props.perDiemRowIds.length == 0
              ) {
                //this.setStateToNew({ warningNoPerDiem: true });
                //return;
              }
              this.setStateToNew({ pendingTrip: new Trip() });
            }}
          />
        )}
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
        <>
          {this.state.loadingTrips && <Loader />}
          {!this.props.canDeleteTrips && (
            <InfoTable
              key={this.state.trips.toString()}
              columns={[
                {
                  name: 'Origin',
                  align: this.props.textAlignment
                    ? this.props.textAlignment
                    : 'left',
                },
                {
                  name: 'Destination',
                  align: this.props.textAlignment
                    ? this.props.textAlignment
                    : 'left',
                },
                {
                  name: 'Notes',
                  align: this.props.textAlignment
                    ? this.props.textAlignment
                    : 'left',
                },
                {
                  name: 'Employee Calculated Time',
                  align: this.props.textAlignment
                    ? this.props.textAlignment
                    : 'left',
                },
                {
                  name: 'Miles',
                  align: this.props.textAlignment
                    ? this.props.textAlignment
                    : 'left',
                },
              ]}
              data={this.state
                .trips!.getResultsList()
                .filter((trip: Trip) => {
                  let pass = false;
                  this.props.perDiemRowIds.forEach(id => {
                    if (trip.getPerDiemRowId() == id) {
                      pass = true;
                    }
                  });

                  return pass;
                })
                .map((currentTrip: Trip) => {
                  return [
                    { value: currentTrip.getOriginAddress() },
                    { value: currentTrip.getDestinationAddress() },
                    { value: currentTrip.getNotes() },
                    {
                      value: currentTrip.getDistanceInMiles().toFixed(1),
                    },
                  ];
                })}
              compact
            />
          )}
          {this.props.canDeleteTrips && (
            <InfoTable
              key={this.state.trips.toString()}
              columns={[
                {
                  name: 'Origin',
                  align: this.props.textAlignment
                    ? this.props.textAlignment
                    : 'left',
                },
                {
                  name: 'Destination',
                  align: this.props.textAlignment
                    ? this.props.textAlignment
                    : 'left',
                },
                {
                  name: 'Notes',
                  align: this.props.textAlignment
                    ? this.props.textAlignment
                    : 'left',
                },
                {
                  name: 'Miles',
                  actions: [
                    {
                      label: 'Delete All Trips',
                      compact: true,
                      disabled: true,
                      variant: 'outlined',
                      onClick: () => {
                        this.setStateToNew({ pendingDeleteAllTrips: true });
                      },
                      burgeronly: 1,
                    },
                  ],
                  align: this.props.textAlignment
                    ? this.props.textAlignment
                    : 'left',
                },
              ]}
              data={this.state
                .trips!.getResultsList()
                .filter((trip: Trip) => {
                  let pass = false;
                  this.props.perDiemRowIds.forEach(id => {
                    if (
                      trip.getPerDiemRowId() == id &&
                      trip.getUserId() == this.props.loggedUserId
                    ) {
                      pass = true;
                    }
                  });
                  return pass;
                })
                .map((currentTrip: Trip) => {
                  return [
                    { value: currentTrip.getOriginAddress() },
                    { value: currentTrip.getDestinationAddress() },
                    { value: currentTrip.getNotes() },
                    {
                      value: currentTrip.getDistanceInMiles().toFixed(1),
                      actions: [
                        <IconButton
                          key={currentTrip.getId() + 'edit'}
                          size="small"
                          disabled={currentTrip.getPayrollProcessed() === true}
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
          )}
        </>
        {this.state.pendingTrip && (
          <PlaceAutocompleteAddressForm
            perDiemRowIds={this.props.perDiemRowIds}
            onClose={() => this.setStateToNew({ pendingTrip: null })}
            onSave={async (addressPair: AddressPair.AddressPair) => {
              this.saveTrip(
                addressPair,
                this.props.perDiemRowIds[0],
                this.props.loggedUserId,
              );
            }}
            addressFields={2}
            schema={SCHEMA_GOOGLE_MAP_INPUT_FORM}
          />
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
        {this.state.warningNoPerDiem && (
          <Alert
            open={this.state.warningNoPerDiem}
            onClose={() => {
              if (this.props.onNoPerDiem) this.props.onNoPerDiem();
              this.setState({ warningNoPerDiem: false });
            }}
            label="Close"
            title="Notice"
          >
            <Typography component="div">
              There is no Per Diem created for this week, please create one
              before adding any trips.
            </Typography>
          </Alert>
        )}
      </>
    );
  }
}
