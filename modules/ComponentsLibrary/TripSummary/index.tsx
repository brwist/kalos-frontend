import React from 'react';
import { Columns, InfoTable } from '../InfoTable';
import { SectionBar } from '../SectionBar';
import {
  PerDiem,
  Trip,
  TripList,
} from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import {
  PerDiemClientService,
  UserClientService,
  loadTripsByFilter,
  TripsFilter,
  TripsSort,
  LoadTripsByFilter,
  perDiemTripMilesToUsd,
  TimesheetDepartmentClientService,
  MapClientService,
  formatDateDay,
} from '../../../helpers';
import { AddressPair } from '../PlaceAutocompleteAddressForm/Address';
import { ConfirmDelete } from '../ConfirmDelete';
import { Form, Schema } from '../Form';
import { Tooltip } from '../Tooltip';
import { Confirm } from '../Confirm';
import { Typography } from '@material-ui/core';
import { PlainForm } from '../PlainForm';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import MessageIcon from '@material-ui/icons/Message';
import Visibility from '@material-ui/icons/Visibility';
import { TripInfo, TripViewModal } from '../TripViewModal';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { SlackMessageButton } from '../SlackMessageButton';
import { Button } from '../Button';
import { NULL_TIME } from '../../../constants';
import { PlaceAutocompleteAddressForm } from '../PlaceAutocompleteAddressForm';
import { SCHEMA_GOOGLE_MAP_INPUT_FORM } from '../TripInfoTable';
import { Alert } from '../Alert';

export const SCHEMA_TRIP_SEARCH: Schema<Trip> = [
  [
    {
      label: 'ID',
      type: 'text',
      name: 'getId',
    },
    {
      label: 'Origin',
      type: 'text',
      name: 'getOriginAddress',
    },
    {
      label: 'Destination',
      type: 'text',
      name: 'getDestinationAddress',
    },
  ],
];

const SCHEMA_TRIP_INFO: Schema<TripInfo> = [
  [{ headline: true, label: 'Monetary' }],
  [
    {
      label: 'Distance in Miles',
      type: 'text',
      name: 'distanceInMiles',
    },
    {
      name: 'distanceInDollars',
      type: 'text',
      label: 'Amount for Trip',
      readOnly: true,
    },
  ],
  [{ headline: true, label: 'General' }],
  [
    {
      label: 'Employee Name',
      type: 'text',
      name: 'nameOfEmployee',
    },
    {
      label: 'Department',
      type: 'text',
      name: 'departmentName',
    },
  ],
  [
    {
      label: 'Day Of',
      type: 'text',
      name: 'date',
    },
  ],
  [
    {
      label: 'Origin Address',
      type: 'text',
      name: 'originAddress',
    },
  ],
  [
    {
      label: 'Destination Address',
      type: 'text',
      name: 'destinationAddress',
    },
  ],
  [
    {
      label: 'Notes',
      type: 'text',
      name: 'notes',
      multiline: true,
    },
  ],
  [{ headline: true, label: 'Approval' }],
  [
    {
      name: 'approved',
      type: 'text',
      label: 'Approved',
      readOnly: true,
    },
    {
      name: 'payrollProcessed',
      type: 'text',
      label: 'Payroll Processed',
      readOnly: true,
    },
  ],
];

type CheckboxesFilterType = {
  approved: number;
  payrollProcessed: number;
};

class Checkboxes implements CheckboxesFilterType {
  approved: number = 0;
  payrollProcessed: number = 0;
}

const CHECKBOXES_SCHEMA: Schema<CheckboxesFilterType> = [
  [
    {
      name: 'approved',
      type: 'checkbox',
      label: 'Approved',
    },
    {
      name: 'payrollProcessed',
      type: 'checkbox',
      label: 'Payroll Processed',
    },
  ],
];

interface Props {
  perDiemRowIds: number[];
  userId: number; // The id to filter to
  loggedUserId: number; // The actual logged user id passed down via props
  canDeleteTrips?: boolean;
  canProcessPayroll?: boolean;
  canApprove?: boolean;
  canSlackMessageUsers?: boolean;
  canAddTrips?: boolean;
  compact?: boolean;
  hoverable?: boolean;
  searchable?: boolean;
  displayTripDistance?: boolean;
  onSaveTrip?: (savedTrip?: Trip) => any;
  onDeleteTrip?: () => any;
  onDeleteAllTrips?: () => any;
  role?: string;
  departmentId?: number;
  checkboxes?: boolean;
  viewingOwn?: boolean;
}

interface State {
  pendingTrip: Trip | null;
  pendingTripToDelete: Trip | null;
  pendingTripToAdd: Trip | null;
  pendingDeleteAllTrips: boolean;
  pendingProcessPayrollTrip: Trip | null;
  pendingApproveTrip: Trip | null;
  pendingDenyTrip: Trip | null;
  tripsOnPage: TripList;
  totalTrips: number;
  totalTripMiles: number;
  key: number;
  loading: boolean;
  search: TripsFilter | undefined;
  page: number;
  filter: CheckboxesFilterType;
  tripToView: Trip | null;
  toggleButton: boolean;
  warningNoPerDiem: boolean; // When there is no per-diem this is true and it displays
  // a dialogue
  perDiemDropDownSelected: string;
  perDiems: PerDiem.AsObject[] | null;
  currentTripDepartment: TimesheetDepartment.AsObject | null;
}

export class TripSummary extends React.PureComponent<Props, State> {
  nameIdPair: { name: string; id: number }[] = [];
  deptNameIdPair: { name: string; id: number }[] = [];
  dateIdPair: { date: string; row_id: number }[] = [];
  resultsPerPage: number = 25;
  department: TimesheetDepartment.AsObject | null = null;
  numFilteredTrips: number = 0;
  constructor(props: Props) {
    super(props);
    this.state = {
      pendingTrip: null,
      tripsOnPage: new TripList(),
      totalTrips: 0,
      totalTripMiles: 0,
      pendingTripToDelete: null,
      pendingTripToAdd: null,
      pendingDeleteAllTrips: false,
      pendingDenyTrip: null,
      pendingProcessPayrollTrip: null,
      pendingApproveTrip: null,
      key: 0,
      toggleButton: false,
      loading: true,
      search: {} as TripsFilter,
      page: 0,
      filter: new Checkboxes(),
      tripToView: null,
      warningNoPerDiem: false,
      perDiemDropDownSelected: this.props.perDiemRowIds
        ? `${this.props.perDiemRowIds[0]} | 0`
        : '',
      perDiems: null,
      currentTripDepartment: null,
    };
    // The reason this is a ternary is because the state being set to search for Payroll throws things off.
    // I'm going to go ahead and make an issue for the future to clean this up, I really did a messy job in this particular
    // component and should really maintain it when I'm less busy with Dani's stuff
    this.loadTripsAndUpdate(
      this.props.role == 'Manager' || this.props.role === 'Payroll'
        ? this.state.search
        : undefined,
      this.state.toggleButton,
    );
  }

  getDepartmentNameById = async (id: number) => {
    let req = new TimesheetDepartment();
    req.setId(id);
    const dept = await TimesheetDepartmentClientService.Get(req);

    this.setState({ currentTripDepartment: dept.toObject() });
  };

  setDepartment = (value: TimesheetDepartment | null) => {
    this.setState({ currentTripDepartment: value });
  };

  getTripDistance = async (origin: string, destination: string) => {
    try {
      await MapClientService.getTripDistance(origin, destination);
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
    new Promise(async resolve => {
      let res = await PerDiemClientService.getRowDatesFromPerDiemTrips(
        this.state.tripsOnPage.getResultsList(),
      );
      this.dateIdPair = res;
      this.setState({ key: this.state.key + 1 });
      resolve(false);
    }).then((result: any) => {
      this.setState({ loading: result });
    });
  };

  loadTrips = async (tripFilter?: TripsFilter, toggleButton?: boolean) => {
    const tripSort = {
      orderByField: 'user_id',
      orderBy: 'user_id',
      orderDir: 'ASC',
    };

    if (tripFilter) {
      tripFilter.role = this.props.role;
      tripFilter.weekof = this.props.perDiemRowIds;
      tripFilter.userId = this.props.userId;
      tripFilter.departmentId = this.props.departmentId;
    }

    this.numFilteredTrips = 0;

    const page =
      tripFilter != undefined
        ? tripFilter.page == undefined
          ? 0
          : tripFilter.page
        : 0;

    // These two cases will need certain properties reversed, since we will use not_equals to compare them
    // (we need to compare if they're true and if they are, then filter them)
    if (this.props.role == 'Payroll' && tripFilter && toggleButton == false) {
      tripFilter.payrollProcessed = true;
      tripFilter.approved = true;
    }
    if (this.props.role == 'Payroll' && tripFilter && toggleButton == true) {
      tripFilter.payrollProcessed = false;
      tripFilter.approved = true;
    }
    if (this.props.role == 'Manager' && tripFilter) {
      tripFilter.approved = false;
      tripFilter.adminActionDate = NULL_TIME; // We want to show the trips that have not been interacted with or that are cleared
      if (tripFilter.departmentId == 0)
        tripFilter.departmentId = this.props.departmentId;
    }
    let criteria: LoadTripsByFilter;
    if (!this.props.viewingOwn) {
      criteria = {
        page,
        filter: tripFilter
          ? tripFilter
          : {
              userId: this.props.userId != 0 ? this.props.userId : undefined,
              weekof: this.props.perDiemRowIds,
              page: this.state.page,
              departmentId: this.props.departmentId,
              adminActionDate:
                this.props.role === 'Manager' ? NULL_TIME : undefined,
              payrollProcessed: tripFilter
                ? !tripFilter!.payrollProcessed
                : this.props.role == 'Payroll' && !toggleButton
                ? true
                : false,
              approved: tripFilter
                ? !tripFilter!.approved
                : this.props.role == 'Manager'
                ? false
                : true,
              role: this.props.role,
            },
        sort: tripSort as TripsSort,
      };
    } else {
      criteria = {
        page,
        filter: tripFilter
          ? tripFilter
          : {
              userId: this.props.userId != 0 ? this.props.userId : undefined,
              weekof: this.props.perDiemRowIds,
              page: this.state.page,
              departmentId: this.props.departmentId,
              payrollProcessed: undefined,
              approved: undefined,
              role: this.props.role,
            },
        sort: tripSort as TripsSort,
      };
    }

    //this.setState({ search: criteria.filter });
    return await this.getFilteredTripList(criteria);
  };

  getFilteredTripList = async (criteria: LoadTripsByFilter) => {
    const res: {
      results: Trip.AsObject[];
      totalCount: number;
    } = await loadTripsByFilter(criteria);
    let tripList: Trip[] = [];
    for await (const tripAsObj of res.results) {
      tripList.push(PerDiemClientService.tripAsObjectToTrip(tripAsObj));
    }
    const tripsFinalResultList: Trip[] = [...tripList];

    let resultList = new TripList();
    resultList.setResultsList(tripsFinalResultList);

    this.setState({
      totalTrips: res.totalCount,
    });
    resultList.setTotalCount(res.totalCount);
    return resultList;
  };

  reloadTrips = () => {
    this.loadTripsAndUpdate(this.state.search);
  };

  loadTripsAndUpdate = async (
    tripFilter?: TripsFilter,
    toggleButton?: boolean,
  ) => {
    await this.loadTrips(tripFilter, toggleButton).then(async result => {
      this.setState({ tripsOnPage: result });
      await this.refreshNamesAndDates();
      this.setState({
        totalTripMiles: await this.getTotalTripDistance(),
      });
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

  getTotalTripDistance = async () => {
    let dist = 0;
    await new Promise(async resolve => {
      let total = 0;

      for await (const trip of this.state.tripsOnPage.getResultsList()) {
        total += trip.getDistanceInMiles();
      }

      resolve(total);
    }).then(val => {
      dist = Number(val);
    });
    return dist;
  };
  deleteTrip = async (trip: Trip) => {
    try {
      await PerDiemClientService.DeleteTrip(trip);
      let trips = this.state.tripsOnPage;
      let t = this.state.tripsOnPage.getResultsList().indexOf(trip);
      trips.getResultsList().splice(t, 1);
      this.setState({ tripsOnPage: trips });
      if (this.props.onDeleteTrip) this.props.onDeleteTrip();
    } catch (err: any) {
      console.error('An error occurred while deleting a trip: ', err);
      alert(
        'The trip was not able to be deleted. Please try again, or if this keeps happening please contact your administrator.',
      );
      this.setState({ pendingTripToDelete: null });
      return Error(err);
    }
    this.reloadTrips();
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
    this.reloadTrips();
    this.setState({ pendingDeleteAllTrips: false });
  };
  setStateToNew = (to: any) => {
    this.setState(to);
  };
  handleChangePage = (page: number) => {
    this.setState({ page: page });
    let currentSearch = this.state.search;
    if (currentSearch == null) {
      currentSearch = new Trip().toObject();
    }
    currentSearch.page = page;
    if (this.props.role === 'Payroll')
      this.loadTripsAndUpdate(currentSearch, this.state.toggleButton);
    else {
      this.loadTripsAndUpdate(currentSearch);
    }
  };
  handleToggleButton = () => {
    this.setState({ page: 0 });
    this.setState({ toggleButton: !this.state.toggleButton }, () => {});
    this.loadTripsAndUpdate(undefined, !this.state.toggleButton);
  };
  getData = () => {
    return this.state
      .tripsOnPage!.getResultsList()
      .map((currentTrip: Trip, idx: number) => {
        return [
          { value: currentTrip.getOriginAddress() },
          { value: currentTrip.getDestinationAddress() },
          {
            value: currentTrip.getUserName(),
          },
          {
            value: formatDateDay(currentTrip.getDate()),
          },
          {
            value:
              currentTrip.getDistanceInMiles().toFixed(1) +
              ' / ' +
              perDiemTripMilesToUsd(Number(currentTrip.getDistanceInMiles())),
          },
          {
            value: currentTrip.getApproved() ? 'Yes' : 'No',
          },
          {
            value: currentTrip.getHomeTravel() ? 'Yes' : 'No',
          },
          {
            value: currentTrip.getPayrollProcessed() ? 'Yes' : 'No',
          },
          {
            value: '',
            actions: [
              this.props.canDeleteTrips ? (
                <Tooltip
                  key={'delete' + idx}
                  content="Delete Trip"
                  placement="bottom"
                >
                  <IconButton
                    key={currentTrip.getId() + 'delete' + idx}
                    size="small"
                    onClick={() =>
                      this.setStateToNew({
                        pendingTripToDelete: currentTrip,
                      })
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <></>
              ),
              <Tooltip
                key={'view' + idx}
                content="View Trip Details"
                placement="bottom"
              >
                <IconButton
                  key={'viewButton' + idx}
                  size="small"
                  onClick={() => this.setTripToView(currentTrip)}
                >
                  <Visibility key={'visibility' + idx} />
                </IconButton>
              </Tooltip>,
              this.props.canSlackMessageUsers ? (
                <Tooltip
                  key={'message' + idx}
                  content="Send Message on Slack"
                  placement="bottom"
                >
                  <span key={'MessageBox' + idx}>
                    <SlackMessageButton
                      key={'messageSlackMember' + idx}
                      label="Message Team Member"
                      loggedUserId={this.props.loggedUserId}
                      type="icon"
                      autofillName={currentTrip.getUserName()}
                    >
                      <MessageIcon key={'messageIcon' + idx} />
                    </SlackMessageButton>
                  </span>
                </Tooltip>
              ) : (
                <></>
              ),
              this.props.canApprove &&
              currentTrip.getDateProcessed() == NULL_TIME ? (
                <Tooltip
                  key={'approve' + idx}
                  content="Approve"
                  placement="bottom"
                >
                  <span key={'Approval'}>
                    <IconButton
                      key={'approveButton' + idx}
                      size="small"
                      onClick={() => this.setPendingApproveTrip(currentTrip)}
                    >
                      <CheckCircleOutlineIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              ) : (
                <></>
              ),
              this.props.canApprove &&
              currentTrip.getDateProcessed() == NULL_TIME ? (
                <Tooltip
                  key={'Reject' + idx}
                  content="Reject"
                  placement="bottom"
                >
                  <span key={'Rejection'}>
                    <IconButton
                      key={'rejectButton' + idx}
                      size="small"
                      onClick={() => this.setPendingDenyTrip(currentTrip)}
                    >
                      <NotInterestedIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              ) : (
                <></>
              ),
              this.props.canProcessPayroll &&
              currentTrip.getPayrollProcessed() == false ? (
                <Tooltip
                  key={'payroll' + idx}
                  content="Process Payroll"
                  placement="bottom"
                >
                  <IconButton
                    key={currentTrip.getId() + 'wallet' + idx}
                    size="small"
                    onClick={() => this.setPendingProcessPayroll(currentTrip)}
                    disabled={!currentTrip.getApproved()}
                  >
                    <AccountBalanceWalletIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <></>
              ),
            ],
          },
        ];
      });
  };
  setPayrollProcessed = async (id: number) => {
    try {
      await PerDiemClientService.updateTripPayrollProcessed(id);
    } catch (err) {
      console.error(
        'An error occurred while updating trip payroll processed status: ',
        err,
      );
    }
    this.setPendingProcessPayroll(null);
    this.reloadTrips();
  };

  setTripApproved = async (id: number) => {
    try {
      await PerDiemClientService.updateTripApproved(id);
    } catch (err) {
      console.error(
        'An error occurred while updating trip approved status: ',
        err,
      );
    }
    this.setPendingApproveTrip(null);
    this.reloadTrips();
  };
  setTripDenied = async (id: number) => {
    await PerDiemClientService.updateTripDeny(id);
    this.setPendingDenyTrip(null);
    this.reloadTrips();
  };
  setPendingApproveTrip = (trip: Trip | null) => {
    this.setState({ pendingApproveTrip: trip });
  };
  setPendingDenyTrip = (trip: Trip | null) => {
    this.setState({ pendingDenyTrip: trip });
  };
  setPendingProcessPayroll = (trip: Trip | null) => {
    this.setState({ pendingProcessPayrollTrip: trip });
  };
  setTripToView = (trip: Trip | null) => {
    this.setState({ tripToView: trip });
  };
  getColumns = () => {
    return (
      this.props.canDeleteTrips
        ? [
            { name: 'Origin' },
            { name: 'Destination' },
            { name: 'Name' },
            { name: 'Day of' },
            { name: 'Miles / Cost' },
            {
              name: 'Approved?',
            },
            {
              name: 'Department Name',
            },
            {
              name: 'Payroll Processed?',
              actions: [
                {
                  label: 'Delete All Trips',
                  compact: this.props.compact ? true : false,
                  variant: 'outlined',
                  size: 'xsmall',
                  onClick: () => {
                    this.setStateToNew({
                      pendingDeleteAllTrips: true,
                    });
                  },
                  burgeronly: 1,
                },
              ],
            },
            {
              name: '',
            },
          ]
        : [
            { name: 'Origin' },
            { name: 'Destination' },
            { name: 'Name' },
            { name: 'Day Of' },
            { name: 'Miles / Cost' },
            {
              name: 'Approved?',
            },
            {
              name: 'Department Name',
            },
            {
              name: 'Payroll Processed?',
            },
            {
              name: '',
            },
          ]
    ) as Columns;
  };
  setFilter = async (checkboxFilter: CheckboxesFilterType) => {
    this.setState({ filter: checkboxFilter });
    let currentSearch = this.state.search;
    if (currentSearch == undefined) {
      currentSearch = new Trip().toObject();
    }
    currentSearch.payrollProcessed = !!+checkboxFilter.payrollProcessed;
    currentSearch.approved = !!+checkboxFilter.approved;
    currentSearch.page = 0; // Go to page 0 in case it cannot handle larger
    this.setState({ page: 0 });
    await this.loadTripsAndUpdate(currentSearch);
  };
  setPendingTripToAdd = (trip: Trip | null) => {
    this.setState({ pendingTripToAdd: trip });
  };

  toggleWarningForNoPerDiem = () => {
    this.setState({ warningNoPerDiem: !this.state.warningNoPerDiem });
  };

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
      // this.toggleWarningForNoPerDiem();
      // this.setState({ pendingTrip: null });
      // this.reloadTrips();
      // return;
    }

    trip.setNotes(data.Notes);
    trip.setHomeTravel(data.HomeTravel);
    trip.setDate(data.Date);

    let user;
    let department;

    try {
      user = await UserClientService.loadUserById(this.props.loggedUserId);
    } catch (err) {
      console.error('Error getting user by id: ', err);
    }
    if (user) {
      try {
        department =
          await TimesheetDepartmentClientService.getDepartmentByManagerID(
            user.managedBy,
          );
      } catch (err) {
        console.error('Error getting timesheet department: ', err);
      }
    }
    if (department) trip.setDepartmentId(department.id);
    try {
      await PerDiemClientService.upsertTrip(
        trip.toObject(),
        rowId!,
        userId,
      ).then(() => {
        this.setState({ pendingTrip: null });
      });
    } catch (err) {
      console.error('An error occurred while upserting a trip: ', err);
    }

    if (this.props.onSaveTrip) this.props.onSaveTrip();

    this.setPendingTripToAdd(null);
    this.reloadTrips();
  };

  handleClickAddTrip = () => {
    if (
      this.props.perDiemRowIds == undefined ||
      this.props.perDiemRowIds.length == 0
    ) {
      //this.toggleWarningForNoPerDiem();
      //return;
    }
    this.setPendingTripToAdd(new Trip());
  };

  setPerDiemDropdown = (value: any) => {
    this.setState({ perDiemDropDownSelected: value.target.value });
  };

  componentDidMount() {
    this.setStateOfPerDiems();
  }

  setStateOfPerDiems = async () => {
    if (this.props.perDiemRowIds) {
      try {
        let pds = await PerDiemClientService.getPerDiemsFromIds(
          this.props.perDiemRowIds,
        );
        this.setState({
          perDiems: pds ? pds : null,
        });
      } catch (err) {
        console.error(
          'An error occurred while getting per diems by ids: ',
          err,
        );
      }
    }
  };

  render() {
    return (
      <div key={'tripSummary'}>
        {this.state.warningNoPerDiem && (
          <Alert
            open={this.state.warningNoPerDiem}
            onClose={() => {
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
        {this.props.canAddTrips && (
          <Button
            label="Add Trip"
            size="small"
            key={'addTrip'}
            variant="contained"
            onClick={this.handleClickAddTrip}
          />
        )}
        {this.state.pendingTripToAdd && (
          <PlaceAutocompleteAddressForm
            key={'autocomplete'}
            perDiemRowIds={this.props.perDiemRowIds}
            onClose={() => this.setPendingTripToAdd(null)}
            onSave={async (addressPair: AddressPair.AddressPair) => {
              this.saveTrip(
                addressPair,
                addressPair.PerDiemId,
                this.props.loggedUserId,
              );
            }}
            addressFields={2}
            schema={SCHEMA_GOOGLE_MAP_INPUT_FORM}
          />
        )}
        {/* May be useful to put this functionality into its own component */}
        {this.state.tripToView && (
          <TripViewModal
            key={'tripView'}
            fullScreen
            schema={SCHEMA_TRIP_INFO}
            data={{
              ...this.state.tripToView.toObject(),
              distanceInDollars: perDiemTripMilesToUsd(
                this.state.tripToView.toObject().distanceInMiles,
              ),
              nameOfEmployee: this.state.tripToView.getUserName(),
              weekOf: '', // Will be filled out but this is to stop the schema from screaming at us
              departmentName: this.state.tripToView.getDepartmentName(),
            }}
            onClose={() => {
              this.setTripToView(null);
              this.setDepartment(null);
            }}
            open={true}
            canProcess={this.props.canProcessPayroll}
            canApprove={this.props.canApprove}
            onApprove={async approved => {
              await this.setTripApproved(approved.id);
              this.setTripToView(null);
            }}
            onProcessPayroll={async processed => {
              await this.setPayrollProcessed(processed.id);
              this.setTripToView(null);
            }}
          />
        )}
        {this.props.checkboxes && (
          <PlainForm<CheckboxesFilterType>
            schema={CHECKBOXES_SCHEMA}
            data={this.state.filter}
            onChange={this.setFilter}
          />
        )}
        {this.props.canProcessPayroll === true && (
          <Button
            label={
              this.state.toggleButton === false
                ? 'Show Unprocessed Records'
                : 'Show Processed Records'
            }
            onClick={() => this.handleToggleButton()}
          ></Button>
        )}
        <SectionBar
          title="Trips"
          pagination={{
            count: this.state.totalTrips,
            page: this.state.page,
            rowsPerPage: this.resultsPerPage,
            onChangePage: this.handleChangePage,
          }}
          footer={
            this.props.displayTripDistance
              ? this.state.totalTripMiles != undefined &&
                this.state.totalTripMiles != 0.0
                ? 'Total miles: ' +
                  this.state.totalTripMiles?.toFixed(1) +
                  ' miles'
                : 'Total miles: None'
              : null
          }
          small={this.props.compact ? true : false}
          key={this.state.tripsOnPage.getResultsList().length}
        />
        <>
          {!this.props.searchable && (
            <>
              <>
                <InfoTable
                  key={
                    this.state.key +
                    String(this.dateIdPair) +
                    String(this.nameIdPair) +
                    String(this.deptNameIdPair)
                  }
                  columns={this.getColumns()}
                  data={this.getData()}
                  compact={this.props.compact ? true : false}
                  hoverable={this.props.hoverable ? true : false}
                />
              </>
            </>
          )}
          {this.state.pendingProcessPayrollTrip && (
            <Confirm
              key="ConfirmProcessed"
              title="Are you sure?"
              open={true}
              onClose={() => this.setPendingProcessPayroll(null)}
              onConfirm={() =>
                this.setPayrollProcessed(
                  this.state.pendingProcessPayrollTrip!.getId(),
                )
              }
            >
              <Typography>
                Are you sure you want to process this payroll?
              </Typography>
            </Confirm>
          )}
          {this.state.pendingApproveTrip && (
            <Confirm
              key="ConfirmApproved"
              title="Are you sure?"
              open={true}
              onClose={() => this.setPendingApproveTrip(null)}
              onConfirm={() =>
                this.setTripApproved(this.state.pendingApproveTrip!.getId())
              }
            >
              <Typography>
                Are you sure you want to approve this trip?
              </Typography>
            </Confirm>
          )}
          {this.state.pendingDenyTrip && (
            <Confirm
              key="ConfirmDeny"
              title="Reject"
              open={true}
              onClose={() => this.setPendingDenyTrip(null)}
              onConfirm={() =>
                this.setTripDenied(this.state.pendingDenyTrip!.getId())
              }
            >
              <Typography>
                Are you sure you want to Reject this trip?
              </Typography>
            </Confirm>
          )}
          {this.props.searchable && (
            <Form
              key={'searchForm'}
              title="Search"
              submitLabel="Search"
              cancelLabel="Reset"
              schema={SCHEMA_TRIP_SEARCH}
              data={this.state.search as Trip.AsObject}
              onClose={() => {
                this.loadTripsAndUpdate();
              }}
              onSave={tripFilter => {
                this.loadTripsAndUpdate(tripFilter);
              }}
            >
              <>
                <InfoTable
                  key={
                    this.state.key +
                    String(this.dateIdPair) +
                    String(this.nameIdPair)
                  }
                  columns={this.getColumns()}
                  data={this.getData()}
                  compact={this.props.compact ? true : false}
                  hoverable={this.props.hoverable ? true : false}
                />
              </>
            </Form>
          )}
        </>
        {this.state.pendingTripToDelete && (
          <ConfirmDelete
            key="DeleteTrip"
            open={this.state.pendingTripToDelete != null}
            onClose={() => this.setStateToNew({ pendingTripToDelete: null })}
            kind="" // Purposely left blank for clarity purposes in the box
            name="this trip"
            onConfirm={() => this.deleteTrip(this.state.pendingTripToDelete!)}
          />
        )}
        {this.state.pendingDeleteAllTrips && (
          <ConfirmDelete
            key="DeleteAllTrips"
            open={this.state.pendingDeleteAllTrips}
            onClose={() => this.setStateToNew({ pendingDeleteAllTrips: false })}
            kind="" // Purposely left blank for clarity purposes in the box
            name="all of the trips in this week (this action cannot be undone)"
            onConfirm={() => this.deleteAllTrips()}
          />
        )}
      </div>
    );
  }
}
