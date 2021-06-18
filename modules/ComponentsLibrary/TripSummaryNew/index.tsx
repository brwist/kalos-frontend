import { Trip } from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import React, { FC, useCallback, useState, useEffect } from 'react';
import { InfoTable } from '../InfoTable';
import { formatDateDay, perDiemTripMilesToUsd } from '../../../helpers';
import { Tooltip } from '../Tooltip';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { Visibility } from '@material-ui/icons';
import { SlackMessageButton } from '../SlackMessageButton';

import { SectionBar } from '../SectionBar';
import {
  PerDiem,
  TripList,
} from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import {
  PerDiemClientService,
  UserClientService,
  loadTripsByFilter,
  TripsFilter as TripFilter,
  TripsSort,
  LoadTripsByFilter,
  TimesheetDepartmentClientService,
  MapClientService,
} from '../../../helpers';
import { AddressPair } from '../PlaceAutocompleteAddressForm/Address';
import { ConfirmDelete } from '../ConfirmDelete';
import { Form, Schema } from '../Form';
import { Confirm } from '../Confirm';
import { Typography } from '@material-ui/core';
import { PlainForm } from '../PlainForm';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import MessageIcon from '@material-ui/icons/Message';
import { TripInfo, TripViewModal } from '../TripViewModal';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { Button } from '../Button';
import { NULL_TIME } from '../../../constants';
import { PlaceAutocompleteAddressForm } from '../PlaceAutocompleteAddressForm';
import { SCHEMA_GOOGLE_MAP_INPUT_FORM } from '../TripInfoTable';
import { Alert } from '../Alert';
import { RoleType } from '../Payroll';

type CheckboxesFilterType = {
  approved: number;
  payrollProcessed: number;
};

class Checkboxes implements CheckboxesFilterType {
  approved: number = 0;
  payrollProcessed: number = 0;
}

interface Props {
  loggedUserId: number;
  perDiemRowIds: number[];
  userId: number; // The id to filter to
  departmentId?: number;
  canDeleteTrips?: boolean;
  compact?: boolean;
  canSlackMessage?: boolean;
  canApprove?: boolean;
  canProcessPayroll?: boolean;
  role?: RoleType;
}

export const TripSummaryNew: FC<Props> = ({
  loggedUserId,
  departmentId,
  perDiemRowIds,
  userId,
  canDeleteTrips,
  compact,
  canSlackMessage,
  canApprove,
  canProcessPayroll,
  role,
}) => {
  const [pendingDeleteAllTrips, setPendingDeleteAllTrips] = useState<boolean>();
  const [loaded, setLoaded] = useState<boolean>();
  const [pendingTripToDelete, setPendingTripToDelete] =
    useState<Trip | undefined>();
  const [pendingTripToProcessPayroll, setPendingTripToProcessPayroll] =
    useState<Trip | undefined>();
  const [pendingTripToApprove, setPendingTripToApprove] =
    useState<Trip | undefined>();
  const [pendingTripToDeny, setPendingTripToDeny] =
    useState<Trip | undefined>();
  const [tripsLoaded, setTripsLoaded] = useState<Trip[] | undefined>([]);
  const [tripToView, setTripToView] = useState<Trip | undefined>();
  const [filter, setFilter] = useState<TripFilter>({
    role,
    weekof: perDiemRowIds,
    userId,
    departmentId,
  } as TripFilter);
  const [page, setPage] = useState<number>(0);
  const [toggleButton, setToggleButton] = useState<boolean>();
  const handleSetToggleButton = useCallback(
    (toggled: boolean) => setToggleButton(toggled),
    [setToggleButton],
  );
  const handleSetPendingDeleteAllTrips = useCallback(
    (pending: boolean) => setPendingDeleteAllTrips(pending),
    [setPendingDeleteAllTrips],
  );
  const handleSetPendingTripToDelete = useCallback(
    (tripToDelete: Trip) => setPendingTripToDelete(tripToDelete),
    [setPendingTripToDelete],
  );
  const handleSetTripToView = useCallback(
    (tripToView: Trip) => setTripToView(tripToView),
    [setTripToView],
  );
  const handleSetPendingTripToApprove = useCallback(
    (tripToApprove: Trip) => setPendingTripToApprove(tripToApprove),
    [setPendingTripToApprove],
  );
  const handleSetPendingTripToProcessPayroll = useCallback(
    (tripToProcess: Trip) => setPendingTripToProcessPayroll(tripToProcess),
    [setPendingTripToProcessPayroll],
  );
  const handleSetPendingTripToDeny = useCallback(
    (tripToDeny: Trip) => setPendingTripToDeny(tripToDeny),
    [setPendingTripToDeny],
  );
  let deleteActions: any[] = [];
  if (canDeleteTrips)
    deleteActions = [
      {
        label: 'Delete All Trips',
        compact: compact ? true : false,
        variant: 'outlined',
        size: 'xsmall',
        onClick: () => handleSetPendingDeleteAllTrips(true),
        burgeronly: 1,
      },
    ];

  const SCHEMA_TRIP_SEARCH: Schema<TripFilter> = [
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

  const loadTrips = useCallback(() => {}, []);

  const load = useCallback(() => {}, []);

  useEffect(() => load(), [load]);

  return (
    <>
      {canProcessPayroll && (
        <Button
          label={
            toggleButton === false
              ? 'Show Unprocessed Records'
              : 'Show Processed Records'
          }
          onClick={() => handleSetToggleButton(!toggleButton)}
        />
      )}
      <InfoTable
        columns={[
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
            actions: deleteActions,
          },
        ]}
        data={
          loaded
            ? tripsLoaded!.map((currentTrip: Trip, idx: number) => {
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
                      perDiemTripMilesToUsd(
                        Number(currentTrip.getDistanceInMiles()),
                      ),
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
                      canDeleteTrips ? (
                        <Tooltip
                          key={'delete' + idx}
                          content="Delete Trip"
                          placement="bottom"
                        >
                          <IconButton
                            key={currentTrip.getId() + 'delete' + idx}
                            size="small"
                            onClick={() =>
                              handleSetPendingTripToDelete(currentTrip)
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
                          onClick={() => handleSetTripToView(currentTrip)}
                        >
                          <Visibility key={'visibility' + idx} />
                        </IconButton>
                      </Tooltip>,
                      canSlackMessage ? (
                        <Tooltip
                          key={'message' + idx}
                          content="Send Message on Slack"
                          placement="bottom"
                        >
                          <span key={'MessageBox' + idx}>
                            <SlackMessageButton
                              key={'messageSlackMember' + idx}
                              label="Message Team Member"
                              loggedUserId={loggedUserId}
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
                      canApprove &&
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
                              onClick={() =>
                                handleSetPendingTripToApprove(currentTrip)
                              }
                            >
                              <CheckCircleOutlineIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : (
                        <></>
                      ),
                      canApprove &&
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
                              onClick={() =>
                                handleSetPendingTripToDeny(currentTrip)
                              }
                            >
                              <NotInterestedIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : (
                        <></>
                      ),
                      canProcessPayroll &&
                      currentTrip.getPayrollProcessed() == false ? (
                        <Tooltip
                          key={'payroll' + idx}
                          content="Process Payroll"
                          placement="bottom"
                        >
                          <IconButton
                            key={currentTrip.getId() + 'wallet' + idx}
                            size="small"
                            onClick={() =>
                              handleSetPendingTripToProcessPayroll(currentTrip)
                            }
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
              })
            : []
        }
      />
    </>
  );
};
