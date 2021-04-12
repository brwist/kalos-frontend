import React from 'react';
import { Columns, InfoTable } from '../InfoTable';
import { SectionBar } from '../SectionBar';
import {
  PerDiem,
  PerDiemList,
  Trip,
  TripList,
} from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import {
  PerDiemClientService,
  getTripDistance,
  UserClientService,
  loadTripsByFilter,
  TripsFilter,
  TripsSort,
  LoadTripsByFilter,
  getRPCFields,
  perDiemTripMilesToUsd,
  perDiemTripMilesToUsdAsNumber,
  TimesheetDepartmentClientService,
  getRowDatesFromPerDiemTrips,
  upsertTrip,
  tripAsObjectToTrip,
  getDepartmentName,
} from '../../../helpers';
import { AddressPair } from '../PlaceAutocompleteAddressForm/Address';
import { ConfirmDelete } from '../ConfirmDelete';
import { Form, Schema } from '../Form';
import { Loader } from '../../Loader/main';
import { Int32 } from '@kalos-core/kalos-rpc/compiled-protos/common_pb';
import { AdvancedSearch } from '../AdvancedSearch';
import { Search } from '../Search';
import { Tooltip } from '../Tooltip';
import { Confirm } from '../Confirm';
import { MenuItem, Select, Typography } from '@material-ui/core';
import { PlainForm } from '../PlainForm';
import {
  PermissionGroup,
  User,
} from '@kalos-core/kalos-rpc/compiled-protos/user_pb';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import MessageIcon from '@material-ui/icons/Message';
import Visibility from '@material-ui/icons/Visibility';
import { Modal } from '../Modal';
import { NULL_TIME } from '../../../constants';
import { TripInfo, TripViewModal } from '../TripViewModal';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { SlackMessageButton } from '../SlackMessageButton';
import { Button } from '../Button';
import { PlaceAutocompleteAddressForm } from '../PlaceAutocompleteAddressForm';
import { SCHEMA_GOOGLE_MAP_INPUT_FORM } from '../TripInfoTable';
import { Alert } from '../Alert';
import { filter } from 'lodash';

export const SCHEMA_TRIP_SEARCH: Schema<Trip.AsObject> = [
  [
    {
      label: 'ID',
      type: 'text',
      name: 'id',
    },
    {
      label: 'Origin',
      type: 'text',
      name: 'originAddress',
    },
    {
      label: 'Destination',
      type: 'text',
      name: 'destinationAddress',
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
      label: 'Week Of',
      type: 'text',
      name: 'weekOf',
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
    /*  May not need to audit trips, just in case though I'ma leave this here
  {
    name: 'needsAuditing',
    type: 'checkbox',
    label: 'Needs Auditing',
  },*/
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
  //needsAuditing: number;
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
    /*  May not need to audit trips, just in case though I'ma leave this here
    {
      name: 'needsAuditing',
      type: 'checkbox',
      label: 'Needs Auditing',
    },*/
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
  tripsOnPage: TripList;
  totalTrips: number;
  totalTripMiles: number;
  key: number;
  loading: boolean;
  search: TripsFilter | undefined;
  page: number;
  filter: CheckboxesFilterType;
  tripToView: Trip | null;
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
      pendingProcessPayrollTrip: null,
      pendingApproveTrip: null,
      key: 0,
      loading: true,
      search: undefined,
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
    this.loadTripsAndUpdate();
  }

  getDepartmentNameById = async (id: number) => {
    let req = new TimesheetDepartment();
    req.setId(id);
    const dept = await TimesheetDepartmentClientService.Get(req);

    this.setState({ currentTripDepartment: dept });
  };

  setDepartment = (value: TimesheetDepartment.AsObject | null) => {
    this.setState({ currentTripDepartment: value });
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
  refreshNamesAndDates = async () => {
    new Promise(async resolve => {
      let res = await getRowDatesFromPerDiemTrips(
        this.state.tripsOnPage.getResultsList(),
      );
      this.dateIdPair = res;
      this.setState({ key: this.state.key + 1 });
      resolve(false);
    }).then((result: any) => {
      this.setState({ loading: result });
    });
  };

  loadTrips = async (tripFilter?: TripsFilter) => {
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
    if (this.props.role == 'Payroll' && tripFilter) {
      tripFilter.payrollProcessed = !tripFilter.payrollProcessed;
    }
    if (this.props.role == 'Manager' && tripFilter) {
      tripFilter.approved = !tripFilter.approved;
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
              payrollProcessed: tripFilter
                ? !tripFilter!.payrollProcessed
                : this.props.role == 'Payroll'
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

    console.log('FILTER: ', criteria);

    return await this.getFilteredTripList(criteria);
  };

  getFilteredTripList = async (criteria: LoadTripsByFilter) => {
    const res: {
      results: Trip.AsObject[];
      totalCount: number;
    } = await loadTripsByFilter(criteria);

    let tripList: Trip[] = [];
    for await (const tripAsObj of res.results) {
      tripList.push(tripAsObjectToTrip(tripAsObj));
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

  loadTripsAndUpdate = async (tripFilter?: TripsFilter) => {
    await this.loadTrips(tripFilter).then(async result => {
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
    this.loadTripsAndUpdate(currentSearch);
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
            value: this.getRowStartDateById(
              currentTrip.getPerDiemRowId(),
            )?.split(' ')[0],
          },
          {
            value:
              currentTrip.getDistanceInMiles().toFixed(1) +
              ' / ' +
              perDiemTripMilesToUsd(Number(currentTrip.getDistanceInMiles())),
          },
          /*
          {
            value: currentTrip.getNotes(),
          },*/
          {
            value: currentTrip.getApproved() ? 'Yes' : 'No',
          },
          {
            value: currentTrip.getDepartmentName(),
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
                  size="small"
                  onClick={() => this.setTripToView(currentTrip)}
                >
                  <Visibility />
                </IconButton>
              </Tooltip>,
              this.props.canSlackMessageUsers ? (
                <Tooltip
                  key={'message' + idx}
                  content="Send Message on Slack"
                  placement="bottom"
                >
                  <span>
                    <SlackMessageButton
                      label="Message Team Member"
                      loggedUserId={this.props.loggedUserId}
                      type="icon"
                      autofillName={currentTrip.getUserName()}
                    >
                      <MessageIcon />
                    </SlackMessageButton>
                  </span>
                </Tooltip>
              ) : (
                <></>
              ),
              this.props.canApprove && currentTrip.getApproved() == false ? (
                <Tooltip
                  key={'approve' + idx}
                  content="Approve"
                  placement="bottom"
                >
                  <span>
                    <IconButton
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
    await PerDiemClientService.updateTripPayrollProcessed(id);
    this.setPendingProcessPayroll(null);
    this.reloadTrips();
  };

  setTripApproved = async (id: number) => {
    await PerDiemClientService.updateTripApproved(id);
    this.setPendingApproveTrip(null);
    this.reloadTrips();
  };
  setPendingApproveTrip = (trip: Trip | null) => {
    this.setState({ pendingApproveTrip: trip });
  };
  setPendingProcessPayroll = (trip: Trip | null) => {
    this.setState({ pendingProcessPayrollTrip: trip });
  };
  setTripToView = (trip: Trip | null) => {
    this.setState({ tripToView: trip });
  };
  getColumns = () => {
    return (this.props.canDeleteTrips
      ? [
          { name: 'Origin' },
          { name: 'Destination' },
          { name: 'Name' },
          { name: 'Week Of' },
          { name: 'Miles / Cost' },
          /*{
            name: 'Notes',
          },*/
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
          { name: 'Week Of' },
          { name: 'Miles / Cost' },
          /*
          {
            name: 'Notes',
          },*/
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
        ]) as Columns;
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

    trip.setDate(data.Date);

    const user = await UserClientService.loadUserById(this.props.loggedUserId);
    trip.setDepartmentId(
      await (
        await TimesheetDepartmentClientService.getDepartmentByManagerID(
          user.managedBy,
        )
      ).id,
    );
    await upsertTrip(trip.toObject(), rowId!, userId).then(() => {
      this.setState({ pendingTrip: null });
    });

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
      let pds = await PerDiemClientService.getPerDiemsFromIds(
        this.props.perDiemRowIds,
      );

      this.setState({
        perDiems: pds ? pds : null,
      });
    }
  };

  render() {
    return (
      <>
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
            variant="contained"
            onClick={this.handleClickAddTrip}
          />
        )}
        {this.state.pendingTripToAdd && (
          <PlaceAutocompleteAddressForm
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
          {this.props.searchable && (
            <Form
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
      </>
    );
  }
}
