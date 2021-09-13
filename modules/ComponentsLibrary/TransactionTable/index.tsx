import { EmailConfig } from '@kalos-core/kalos-rpc/Email';
import {
  Transaction,
  TransactionList,
} from '@kalos-core/kalos-rpc/Transaction';
import {
  TransactionActivity,
  TransactionActivityClient,
} from '@kalos-core/kalos-rpc/TransactionActivity';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { User } from '@kalos-core/kalos-rpc/User';
import IconButton from '@material-ui/core/IconButton';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import CheckIcon from '@material-ui/icons/CheckCircleSharp';
import CloseIcon from '@material-ui/icons/Close';
import UploadIcon from '@material-ui/icons/CloudUploadSharp';
import DoneIcon from '@material-ui/icons/Done';
import Save from '@material-ui/icons/Save';
import CopyIcon from '@material-ui/icons/FileCopySharp';
import RejectIcon from '@material-ui/icons/ThumbDownSharp';
import SubmitIcon from '@material-ui/icons/ThumbUpSharp';
import { format, parseISO } from 'date-fns';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { PopoverComponent } from '../Popover';
import React, { FC, useCallback, useEffect, useReducer } from 'react';
import {
  ENDPOINT,
  NULL_TIME,
  OPTION_ALL,
  WaiverTypes,
} from '../../../constants';
import { FilterType, PopupType, reducer } from './reducer';
import {
  makeFakeRows,
  OrderDir,
  TimesheetDepartmentClientService,
  timestamp,
  EventClientService,
  TransactionClientService,
  UserClientService,
  TransactionActivityClientService,
  EmailClientService,
  uploadPhotoToExistingTransaction,
} from '../../../helpers';
import { AltGallery } from '../../AltGallery/main';
import { Tooltip } from '../../ComponentsLibrary/Tooltip';
import { Loader } from '../../Loader/main';
import { Prompt } from '../../Prompt/main';
import { TxnLog } from '../../transaction/components/log';
import { TxnNotes } from '../../transaction/components/notes';
import { prettyMoney } from '../../transaction/components/row';
import { CompareTransactions } from '../CompareTransactions';
import { Data, InfoTable } from '../InfoTable';
import { Alert } from '../Alert';
import { Modal } from '../Modal';
import { FilterData, RoleType, AssignedUserData } from '../Payroll';
import { PlainForm, Schema } from '../PlainForm';
import { SectionBar } from '../SectionBar';
import LineWeightIcon from '@material-ui/icons/LineWeight';
import DeleteIcon from '@material-ui/icons/Delete';

import { EditTransaction } from '../EditTransaction';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { StatusPicker } from './components/StatusPicker';
import { ErrorBoundary } from '../ErrorBoundary';
import { ConfirmDelete } from '../ConfirmDelete';
import { UploadPhotoToExistingTransaction } from '../UploadPhotoToExistingTransaction';
import { Form } from '../Form';
import { ACTIONS } from './reducer';

export interface Props {
  loggedUserId: number;
  isSelector?: boolean; // Is this a selector table (checkboxes that return in on-change)?
  onSelect?: (
    selectedTransaction: Transaction,
    selectedTransactions: Transaction[],
  ) => void;
  onDeselect?: (
    deselectedTransaction: Transaction,
    selectedTransactions: Transaction[],
  ) => void;
  hasActions?: boolean;
  key?: any;
}

type SelectorParams = {
  txn: Transaction;
  totalCount: number;
};

interface AssignedEmployeeType {
  employeeId: number;
}

let sortDir: OrderDir | ' ' | undefined = 'ASC'; // Because I can't figure out why this isn't updating with the state
let sortBy: string | undefined = 'vendor, timestamp';
// This is outside of state because it was slow inside of state

let filter: FilterType = {
  departmentId: 0,
  employeeId: 0,
  week: OPTION_ALL,
  vendor: '',
  isAccepted: false,
  isRejected: false,
  amount: undefined,
  billingRecorded: false,
  universalSearch: undefined,
  processed: false,
};

let assigned: AssignedEmployeeType = {
  employeeId: 0,
};

export const TransactionTable: FC<Props> = ({
  loggedUserId,
  isSelector,
  onSelect,
  onDeselect,
  hasActions,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    transactionFilter: filter,
    transactions: undefined,
    totalTransactions: 0,
    transactionActivityLogs: [],
    transactionToEdit: undefined,
    loading: true,
    creatingTransaction: false,
    mergingTransaction: false,
    pendingUploadPhoto: undefined,
    role: undefined,
    assigningUser: undefined,
    employees: [],
    departments: [],
    page: 0,
    selectedTransactions: [],
    transactionToDelete: undefined,
    assignedEmployee: undefined,
    error: undefined,
    loaded: false,
    changingPage: false,
    status: 'Accepted / Rejected',
    universalSearch: undefined,
    searching: false,
    fileData: undefined,
    imageWaiverTypePopupOpen: false,
    imageWaiverTypeFormData: {
      documentType: 'Receipt',
      invoiceWaiverType: 0,
    },
    transactionToSave: undefined,
    imageNameToSave: undefined,
  });

  // For emails
  const getRejectTxnBody = (
    reason: string,
    amount: number,
    description: string,
    vendor: string,
  ): string => {
    return `
  <body>
    <table style="width:70%;">
      <thead>
        <th style="text-align:left;">Reason</th>
        <th style="text-align:left;">Amount</th>
        <th style="text-align:left;">Info</th>
      </thead>
      <tbody>
        <tr>
          <td>${reason}</td>
          <td>${prettyMoney(amount)}</td>
          <td>${description}${vendor != '' ? ` - ${vendor}` : ''}</td>
        </tr>
      </body>
    </table>
    <a href="https://app.kalosflorida.com?action=admin:reports.transactions">Go to receipts</a>
  </body>`;
  };

  const makeAuditTransaction = async (id: number) => {
    return async () => {
      const txn = new Transaction();
      txn.setIsAudited(true);
      txn.setFieldMaskList(['IsAudited']);
      txn.setId(id);
      try {
        await TransactionClientService.Update(txn);
      } catch (err) {
        console.error(
          `An error occurred while updating the transaction: ${err}`,
        );
      }
      await makeLog('Transaction audited', id);
      await refresh();
    };
  };

  const auditTxn = async (txn: Transaction) => {
    const ok = confirm(
      'Are you sure you want to mark all the information on this transaction (including all attached photos) as correct? This action is irreversible.',
    );
    if (ok) {
      await makeAuditTransaction(txn.getId());
      await refresh();
    }
  };

  const makeLog = async (description: string, id: number) => {
    const client = new TransactionActivityClient(ENDPOINT);
    const activity = new TransactionActivity();
    activity.setIsActive(1);
    activity.setTimestamp(timestamp());
    activity.setUserId(loggedUserId);
    activity.setDescription(description);
    activity.setTransactionId(id);
    await client.Create(activity);
  };

  const dispute = async (reason: string, txn: Transaction) => {
    const userReq = new User();
    userReq.setId(txn.getOwnerId());
    let user: User | undefined;
    try {
      user = await UserClientService.Get(userReq);
    } catch (err) {
      console.error(
        `An error occurred while fetching a user from the User Client Service: ${err}`,
      );
    }
    if (!user) {
      console.error(
        'Need a user to send to for disputes, however none was gotten. Returning.',
      );
      return;
    }
    // Request for this user
    const sendingReq = new User();
    sendingReq.setId(loggedUserId);
    let sendingUser: User | undefined;
    try {
      sendingUser = await UserClientService.Get(sendingReq);
    } catch (err) {
      console.error(
        `An error occurred while fetching a user from the User Client Service: ${err}`,
      );
    }

    if (!sendingUser) {
      console.error(
        'Need a user to send from for disputes, however none was gotten. Returning.',
      );
      return;
    }

    const body = getRejectTxnBody(
      reason,
      txn.getAmount(),
      txn.getDescription(),
      txn.getVendor(),
    );
    const email: EmailConfig = {
      type: 'receipts',
      recipient: user.getEmail(),
      subject: 'Receipts',
      from: sendingUser.getEmail(),
      body,
    };

    try {
      await EmailClientService.sendMail(email);
    } catch (err) {
      alert('An error occurred, user was not notified via email');
    }

    await makeUpdateStatus(txn.getId(), 4, 'rejected', reason);
    refresh();
  };
  const resetTransactions = useCallback(async () => {
    let req = new Transaction();
    req.setOrderBy(sortBy ? sortBy : 'timestamp');
    req.setOrderDir(
      sortDir && sortDir != ' ' ? sortDir : sortDir == ' ' ? 'DESC' : 'DESC',
    );
    req.setPageNumber(state.page);

    req.setIsActive(1);
    req.setVendorCategory("'PickTicket','Receipt','Invoice'");
    if (state.transactionFilter.isAccepted) {
      req.setStatusId(3);
    }
    if (state.transactionFilter.isRejected) {
      req.setStatusId(4);
    }
    if (state.transactionFilter.processed) {
      req.setStatusId(5);
    }
    if (state.transactionFilter.vendor)
      req.setVendor(`%${state.transactionFilter.vendor}%`);
    if (state.transactionFilter.departmentId != 0)
      req.setDepartmentId(state.transactionFilter.departmentId);
    if (state.transactionFilter.employeeId != 0)
      req.setAssignedEmployeeId(state.transactionFilter.employeeId);
    if (state.transactionFilter.amount)
      req.setAmount(state.transactionFilter.amount);
    req.setIsBillingRecorded(state.transactionFilter.billingRecorded);
    req.setFieldMaskList(['IsBillingRecorded']);
    let res: TransactionList | null = null;
    if (state.transactionFilter.universalSearch) {
      try {
        req.setSearchPhrase(`%${state.transactionFilter.universalSearch}%`);
        res = await TransactionClientService.Search(req);
      } catch (err) {
        try {
          let errLog = new TransactionActivity();
          errLog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
          errLog.setUserId(loggedUserId);
          errLog.setDescription(
            `ERROR : An error occurred while using universal search: ${err}`,
          );
          await TransactionActivityClientService.Create(errLog);
        } catch (errActivity) {
          console.error(
            `An error occurred while using universal search: ${err} `,
          );
        }
        console.error(
          `An error occurred while searching for transactions in TransactionTable: ${err}`,
        );
      }
    } else {
      try {
        res = await TransactionClientService.BatchGet(req);
        if (res.getTotalCount() < state.totalTransactions) {
          dispatch({
            type: ACTIONS.SET_TOTAL_TRANSACTIONS,
            data: res.getTotalCount(),
          });

          dispatch({ type: ACTIONS.SET_PAGE, data: 0 });
          dispatch({ type: ACTIONS.SET_CHANGING_PAGE, data: true });
        }
      } catch (err) {
        try {
          let errLog = new TransactionActivity();
          errLog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
          errLog.setUserId(loggedUserId);
          errLog.setDescription(
            `ERROR : An error occurred while batch-getting transactions in TransactionTable: ${err}`,
          );
          await TransactionActivityClientService.Create(errLog);
        } catch (errActivity) {
          console.error(
            `An error occurred while batch-getting transactions in TransactionTable: ${err} `,
          );
        }
        console.error(
          `An error occurred while batch-getting transactions in TransactionTable: ${err}`,
        );
      }
    }
    if (!res) {
      console.error('No transaction result was gotten. Returning.');
      return;
    }

    // List of the most recent TransactionActivity logs so we can use those to determine the last reason for
    // rejection and display that to the user
    let logList: TransactionActivity[] = [];
    res.getResultsList().forEach(async transaction => {
      try {
        let req = new TransactionActivity();
        req.setTransactionId(transaction.getId());
        let res = await TransactionActivityClientService.BatchGet(req);
        let latest: TransactionActivity | null = null;
        res.getResultsList().forEach(transactionActivity => {
          if (
            latest == null ||
            latest.getTimestamp() < transactionActivity.getTimestamp()
          ) {
            latest = transactionActivity;
          }
        });
        if (latest) {
          logList.push(latest);
        }
      } catch (err) {
        try {
          let errLog = new TransactionActivity();
          errLog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
          errLog.setTransactionId(transaction.getId());
          errLog.setUserId(loggedUserId);
          errLog.setDescription(
            `ERROR : An error occurred while getting a transaction activity log: ${err}`,
          );
          await TransactionActivityClientService.Create(errLog);
        } catch (errActivity) {
          console.error(
            `An error occurred while getting a transaction activity log: ${err} `,
          );
        }
        console.error(
          `An error occurred while getting a transaction activity log: ${err}`,
        );
      }
    });
    dispatch({ type: ACTIONS.SET_TRANSACTION_ACTIVITY_LOGS, data: logList });

    dispatch({
      type: ACTIONS.SET_TOTAL_TRANSACTIONS,
      data: res.getTotalCount(),
    });
    let transactions = res.getResultsList().map(txn => {
      return {
        txn: txn,
        checked: false,
        totalCount: res!.getTotalCount(),
      } as SelectorParams;
    });
    const temp = transactions.map(txn => txn);
    dispatch({ type: ACTIONS.SET_TRANSACTIONS, data: temp });
  }, [
    loggedUserId,
    state.page,
    state.totalTransactions,
    state.transactionFilter.amount,
    state.transactionFilter.billingRecorded,
    state.transactionFilter.departmentId,
    state.transactionFilter.employeeId,
    state.transactionFilter.isAccepted,
    state.transactionFilter.isRejected,
    state.transactionFilter.processed,
    state.transactionFilter.universalSearch,
    state.transactionFilter.vendor,
  ]);

  const load = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LOADING, data: true });
    const employees = await UserClientService.loadTechnicians();
    let sortedEmployeeList = employees.sort((a, b) =>
      a.getLastname() > b.getLastname() ? 1 : -1,
    );
    dispatch({ type: ACTIONS.SET_EMPLOYEES, data: sortedEmployeeList });

    const userReq = new User();
    userReq.setId(loggedUserId);
    const user = await UserClientService.Get(userReq);
    let departments;
    try {
      let departmentReq = new TimesheetDepartment();
      departmentReq.setIsActive(1);
      departments = (
        await TimesheetDepartmentClientService.BatchGet(departmentReq)
      ).getResultsList();
      dispatch({ type: ACTIONS.SET_DEPARTMENTS, data: departments });
    } catch (err) {
      console.error(
        `An error occurred while getting the timesheet departments: ${err}`,
      );
    }

    const role = user
      .getPermissionGroupsList()
      .find(p => p.getType() === 'role');

    if (role) {
      dispatch({ type: ACTIONS.SET_ROLE, data: role.getName() as RoleType });
    }

    dispatch({ type: ACTIONS.SET_CHANGING_PAGE, data: false });

    dispatch({ type: ACTIONS.SET_LOADING, data: false });
    dispatch({ type: ACTIONS.SET_LOADED, data: true });
  }, [loggedUserId]);

  const makeUpdateStatus = async (
    id: number,
    statusID: number,
    description: string,
    reason?: string,
  ) => {
    const txn = new Transaction();
    txn.setId(id);
    txn.setStatusId(statusID);
    txn.setFieldMaskList(['StatusId']);
    txn.setIsBillingRecorded(true);
    try {
      await TransactionClientService.Update(txn);
    } catch (err) {
      console.error(`An error occurred while updating a transaction: ${err}`);
    }
    try {
      await makeLog(`${description} ${reason || ''}`, id);
    } catch (err) {
      console.error(`An error occurred while making an activity log: ${err}`);
    }
  };

  const updateStatus = async (txn: Transaction) => {
    const ok = confirm(
      `Are you sure you want to mark this transaction as accepted?`,
    );
    if (ok) {
      await makeUpdateStatus(txn.getId(), 3, 'accepted');
      await resetTransactions();
      await refresh();
    }
  };
  const updateStatusProcessed = async (txn: Transaction) => {
    const ok = confirm(
      `Are you sure you want to mark this transaction as Processed?`,
    );
    if (ok) {
      await makeUpdateStatus(txn.getId(), 5, 'Recorded and Processed');
      await resetTransactions();
      await refresh();
    }
  };
  const forceAccept = async (txn: Transaction) => {
    const ok = confirm(
      `Are you sure you want to mark this transaction as accepted?`,
    );
    if (ok) {
      await makeUpdateStatus(txn.getId(), 3, 'accepted');
      await refresh();
    }
  };

  const refresh = useCallback(async () => {
    await load();
  }, [load]);
  const copyToClipboard = useCallback((text: string): void => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }, []);

  const handleSetAssigningUser = useCallback(
    (isAssigningUser: boolean, transactionId: number) => {
      if (isAssigningUser) {
        dispatch({
          type: ACTIONS.SET_ASSIGNED_EMPLOYEE,
          data: undefined,
        });
      }
      dispatch({
        type: ACTIONS.SET_ASSIGNING_USER,
        data: {
          isAssigning: isAssigningUser,
          transactionId: transactionId,
        },
      });
    },
    [],
  );

  const handleSetFilter = useCallback(async (d: FilterData) => {
    if (!d.week) {
      d.week = OPTION_ALL;
    }
    if (!d.departmentId) {
      d.departmentId = 0;
    }
    if (!d.employeeId) {
      d.employeeId = 0;
    }
    if (!d.vendor) {
      d.vendor = '';
    }
    filter.departmentId = d.departmentId;
    filter.employeeId = d.employeeId;
    filter.vendor = d.vendor;
    filter.isAccepted = d.accepted ? d.accepted : undefined;
    filter.isRejected = d.rejected ? d.rejected : undefined;
    filter.amount = d.amount;
    filter.billingRecorded = d.billingRecorded;
    filter.universalSearch = d.universalSearch;
    filter.processed = d.processed;
    dispatch({ type: ACTIONS.SET_TRANSACTION_FILTER, data: filter });
  }, []);

  const updateTransaction = useCallback(
    async (transactionToSave: Transaction) => {
      try {
        let log = new TransactionActivity();
        log.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
        log.setPageNumber(state.page);
        log.setTransactionId(transactionToSave.getId());
        log.setUserId(loggedUserId);
        log.setDescription(
          `Updating transaction with id ${transactionToSave.getId()} (done by user #${loggedUserId})`,
        );
        await TransactionActivityClientService.Create(log);
      } catch (err) {
        console.error(
          `An error occurred while uploading an activity log: ${err}`,
        );
      }
      try {
        await TransactionClientService.Update(transactionToSave);
        dispatch({ type: ACTIONS.SET_TRANSACTION_TO_EDIT, data: undefined });
        refresh();
      } catch (err) {
        try {
          let errLog = new TransactionActivity();
          errLog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
          errLog.setTransactionId(transactionToSave.getId());
          errLog.setUserId(loggedUserId);
          errLog.setDescription(
            `ERROR : An error occurred while updating a transaction: ${err}`,
          );
          await TransactionActivityClientService.Create(errLog);
        } catch (errActivity) {
          console.error(
            `An error occurred while updating a transaction: ${err}`,
          );
        }
        console.error('An error occurred while updating a transaction: ', err);
        dispatch({ type: ACTIONS.SET_TRANSACTION_TO_EDIT, data: undefined });
      }
    },
    [refresh, loggedUserId, state.page],
  );
  const getJobNumberInfo = async (number: number) => {
    let returnString = ['No Job Info Found'];
    if (number != 0) {
      try {
        console.log('we got called to get info');
        const eventReq = new Event();
        eventReq.setId(number);
        const res = await EventClientService.Get(eventReq);
        const descritpion = 'Job Description: ' + res.getDescription();
        const customer =
          'Customer: ' +
          (res.getCustomer() === undefined
            ? 'No Customer '
            : `${res
                .getCustomer()!
                .getFirstname()} ${res.getCustomer()!.getLastname()}`);
        const property =
          'Property: ' +
          (res.getProperty() === undefined
            ? 'No Property'
            : `${res
                .getProperty()!
                .getAddress()} ${res.getProperty()!.getCity()}`);
        returnString = [descritpion, customer, property];
      } catch (error) {
        console.log('Not a number');
      }
    }
    return returnString;
  };
  const changeSort = (newSort: string) => {
    let newSortDir: OrderDir | ' ' | undefined;

    if (newSort == sortBy) {
      if (sortDir == 'ASC') {
        newSortDir = 'DESC';
      } else if (sortDir == 'DESC') {
        newSortDir = ' ';
      } else if (sortDir == ' ') {
        newSortDir = 'ASC';
      }
    } else {
      newSortDir = 'DESC';
      dispatch({ type: ACTIONS.SET_PAGE, data: 0 });
    }

    sortBy = newSort;
    sortDir = newSortDir;

    refresh();
  };

  const handleAssignEmployee = useCallback(
    async (employeeIdToAssign: number | undefined, transactionId: number) => {
      if (employeeIdToAssign == undefined) {
        dispatch({
          type: ACTIONS.SET_ERROR,
          data: 'There is no employee to assign.',
        });
        return;
      }
      try {
        let req = new Transaction();
        req.setId(transactionId);
        req.setAssignedEmployeeId(employeeIdToAssign);
        req.setFieldMaskList(['AssignedEmployeeId']);
        let result = await TransactionClientService.Update(req);
        if (!result) {
          console.error('Unable to assign employee.');
        }
        dispatch({
          type: ACTIONS.SET_ASSIGNING_USER,
          data: {
            isAssigning: false,
            transactionId: -1,
          },
        });
      } catch (err) {
        console.error('An error occurred while assigning an employee: ', err);
      }
    },
    [],
  );

  const handleSetFilterAcceptedRejected = useCallback(
    (option: 'Accepted' | 'Rejected' | 'Accepted / Rejected') => {
      let tempFilter = state.transactionFilter;
      dispatch({ type: ACTIONS.SET_STATUS, data: option });
      switch (option) {
        case 'Accepted':
          tempFilter.isAccepted = true;
          break;
        case 'Rejected':
          tempFilter.isRejected = true;
          break;
        case 'Accepted / Rejected':
          tempFilter.isAccepted = undefined;
          tempFilter.isRejected = undefined;

          break;
        default:
          console.error(
            'Unhandled string passed to handleSetFilterAcceptedRejected. ',
          );
          break;
      }
      dispatch({ type: ACTIONS.SET_TRANSACTION_FILTER, data: tempFilter });
    },
    [state.transactionFilter],
  );

  const setTransactionChecked = useCallback(
    (idx: number) => {
      if (!state.transactions) {
        console.error(
          'No transactions exist but setTransactionChecked is being called. This is a no-op, returning.',
        );
        return;
      }
      state.transactions[idx] = { ...state.transactions[idx] };

      if (!state.transactions) {
        console.error(
          `There are no transactions set in 'state.transactions', but setTransactionChecked was set (which depends on it). Returning. `,
        );
        return;
      }

      // selectedTransactions.includes fails and I'm not sure why, so I'm writing this loop to do the same thing but check Ids
      let contained = false;
      state.selectedTransactions.forEach(txn => {
        if (txn.getId() === state.transactions![idx].txn.getId()) {
          contained = true;
        }
      });

      if (!contained) {
        // We want to toggle it
        dispatch({
          type: ACTIONS.SET_SELECTED_TRANSACTIONS,
          data: [...state.selectedTransactions, state.transactions[idx].txn],
        });
        if (onSelect)
          onSelect(state.transactions[idx].txn, [
            ...state.selectedTransactions,
            state.transactions[idx].txn,
          ]);
      } else {
        dispatch({
          type: ACTIONS.SET_SELECTED_TRANSACTIONS,
          data: state.selectedTransactions.filter(
            txn => txn.getId() !== state.transactions![idx].txn.getId(),
          ),
        });
        if (onDeselect)
          onDeselect(
            state.transactions[idx].txn,
            state.selectedTransactions.filter(
              txn => txn.getId() !== state.transactions![idx].txn.getId(),
            ),
          );
      }
    },
    [onDeselect, onSelect, state.selectedTransactions, state.transactions],
  );

  const SCHEMA_ASSIGN_USER: Schema<AssignedUserData> = [
    [
      {
        name: 'employeeId',
        label: 'Employee to assign',
        type: 'technician',
      },
    ],
  ];

  const SCHEMA: Schema<FilterData> = [
    [
      {
        name: 'universalSearch',
        label: 'Search All Transactions',
      },
    ],
    [
      {
        name: 'departmentId',
        label: 'From department:',
        options: [
          {
            label: OPTION_ALL,
            value: 0,
          },
          ...state.departments.map(dept => ({
            label: `${dept.getValue()} | ${dept.getDescription()}`,
            value: dept.getId(),
          })),
        ],
      },
      {
        name: 'employeeId',
        label: 'Select Employee',
        options: [
          { label: OPTION_ALL, value: 0 },
          ...state.employees
            .filter(el => {
              if (state.transactionFilter.departmentId === 0) return true;
              return el.getEmployeeDepartmentId() === filter.departmentId;
            })
            .map(el => ({
              label: `${UserClientService.getCustomerName(
                el,
              )} (ID: ${el.getId()})`,
              value: el.getId(),
            })),
        ],
      },
      {
        name: 'billingRecorded',
        label: 'Was Approved/Rejected?',
        type: 'checkbox',
      },
      {
        name: 'processed',
        label: 'Was Processed?',
        type: 'checkbox',
      },
    ],
    [
      {
        content: (
          <StatusPicker
            key={state.status}
            options={['Accepted / Rejected', 'Accepted', 'Rejected']}
            selected={
              state.status == 'Accepted / Rejected'
                ? 0
                : state.status == 'Accepted'
                ? 1
                : 2
            }
            onSelect={(
              selected: 'Accepted' | 'Rejected' | 'Accepted / Rejected',
            ) => {
              handleSetFilterAcceptedRejected(selected);
            }}
          />
        ),
      },
      {
        name: 'amount',
        label: 'Search Amount',
        type: 'text',
      },
      {
        name: 'vendor',
        label: 'Search Vendor',
        type: 'search',
        actions: [
          {
            label: 'search',
            onClick: () =>
              dispatch({ type: ACTIONS.SET_SEARCHING, data: true }),
          },
        ],
      },
    ],
  ];

  const saveFromRowButton = useCallback(
    async (saved: any) => {
      let newTxn = new Transaction();
      newTxn.setTimestamp(saved['Date']);
      newTxn.setOrderNumber(saved['Order #']);
      newTxn.setAssignedEmployeeId(saved['Purchaser']);
      newTxn.setOwnerId(loggedUserId);
      newTxn.setDepartmentId(saved['Department']);
      newTxn.setJobId(saved['Job #']);
      newTxn.setAmount(saved['Amount']);
      newTxn.setVendor(saved['Vendor']);
      newTxn.setStatusId(2);
      newTxn.setVendorCategory('Receipt');

      let res: Transaction | undefined;
      try {
        res = await TransactionClientService.Create(newTxn);
      } catch (err) {
        console.error(`An error occurred while creating a transaction: ${err}`);
        try {
          let log = new TransactionActivity();
          log.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
          log.setUserId(loggedUserId);
          log.setStatusId(2);
          log.setIsActive(1);
          log.setDescription(
            `ERROR : An error occurred while uploading a new transaction: ${err}.`,
          );
          await TransactionActivityClientService.Create(log);
        } catch (err) {
          console.error(
            `An error occurred while uploading a transaction activity log for a transaction: ${err}`,
          );
        }
      }

      try {
        let log = new TransactionActivity();
        log.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
        log.setUserId(loggedUserId);
        log.setStatusId(2);
        log.setIsActive(1);
        log.setDescription(`Transaction created with id: ${res!.getId()}`);
        await TransactionActivityClientService.Create(log);
      } catch (err) {
        console.error(
          `An error occurred while uploading a transaction activity log for a transaction: ${err}`,
        );
      }

      await resetTransactions();
      refresh();
      return res;
    },
    [loggedUserId, resetTransactions, refresh],
  );

  const deleteTransaction = useCallback(async () => {
    try {
      if (state.transactionToDelete === undefined) {
        throw new Error(
          'There is no transaction to delete defined in state, yet deleteTransaction was called.',
        );
      }
      await TransactionClientService.Delete(state.transactionToDelete);
      dispatch({ type: ACTIONS.SET_TRANSACTION_TO_DELETE, data: undefined });
      await resetTransactions();
      await refresh();
    } catch (err) {
      console.error(`An error occurred while deleting a transaction: ${err}`);
    }
  }, [state.transactionToDelete, refresh, resetTransactions]);

  useEffect(() => {
    if (!state.loaded) {
      load();
      resetTransactions();
    }
    if (state.changingPage) {
      load();
      resetTransactions();
    }
    if (state.searching) {
      load();
      resetTransactions();
      dispatch({ type: ACTIONS.SET_SEARCHING, data: false });
    }
  }, [
    load,
    resetTransactions,
    state.changingPage,
    state.loaded,
    state.searching,
  ]);
  return (
    <ErrorBoundary>
      {state.imageWaiverTypePopupOpen && (
        <Modal
          open
          onClose={() =>
            dispatch({
              type: ACTIONS.SET_IMAGE_WAIVER_TYPE_POPUP_OPEN,
              data: false,
            })
          }
        >
          <Form<PopupType>
            disabled={state.loading}
            key={state.imageWaiverTypeFormData.toString()}
            title={'Specify Type for Document - ' + state.imageNameToSave}
            onChange={changed => {
              dispatch({
                type: ACTIONS.SET_IMAGE_WAIVER_TYPE_FORM_DATA,
                data: changed,
              });
            }}
            schema={[
              [
                {
                  name: 'documentType',
                  label: 'Document Type',
                  options: ['PickTicket', 'Receipt', 'Invoice'],
                  required: true,
                },
                {
                  name: 'invoiceWaiverType',
                  label: 'Waiver Type',
                  options: WaiverTypes,
                  required:
                    state.imageWaiverTypeFormData.documentType == 'Invoice',
                  invisible:
                    state.imageWaiverTypeFormData.documentType !== 'Invoice',
                },
              ],
            ]}
            onSave={async saved => {
              dispatch({ type: ACTIONS.SET_LOADING, data: true });
              if (
                !state.fileData ||
                !state.transactionToSave ||
                !state.imageNameToSave
              ) {
                console.error(
                  `Not proceeding with image save. Undefined values: fileData: ${
                    state.fileData === undefined
                  }, transactionToSave: ${
                    state.transactionToSave === undefined
                  }, imageNameToSave: ${state.imageNameToSave === undefined} `,
                );
                dispatch({ type: ACTIONS.SET_LOADING, data: false });
                return;
              }
              await uploadPhotoToExistingTransaction(
                state.imageNameToSave,
                saved.documentType,
                state.fileData,
                state.transactionToSave,
                loggedUserId,
                saved.invoiceWaiverType,
              );
              dispatch({ type: ACTIONS.SET_LOADING, data: false });
              dispatch({
                type: ACTIONS.SET_IMAGE_WAIVER_TYPE_POPUP_OPEN,
                data: false,
              });
              dispatch({
                type: ACTIONS.SET_IMAGE_NAME_TO_SAVE,
                data: undefined,
              });
              dispatch({ type: ACTIONS.SET_FILE_DATA, data: undefined });
              await resetTransactions();
              load();
            }}
            onClose={() =>
              dispatch({
                type: ACTIONS.SET_IMAGE_WAIVER_TYPE_POPUP_OPEN,
                data: false,
              })
            }
            submitLabel="Upload"
            data={state.imageWaiverTypeFormData}
          />
        </Modal>
      )}
      {state.loading ? <Loader /> : <> </>}
      {state.error && (
        <Alert
          open={state.error != undefined}
          onClose={() => dispatch({ type: ACTIONS.SET_ERROR, data: undefined })}
          title="Error"
        >
          {state.error}
        </Alert>
      )}
      {state.transactionToDelete && (
        <ConfirmDelete
          open={state.transactionToDelete != undefined}
          onClose={() =>
            dispatch({
              type: ACTIONS.SET_TRANSACTION_TO_DELETE,
              data: undefined,
            })
          }
          onConfirm={() => deleteTransaction()}
          kind="this transaction"
          name=""
          title="Delete"
        >
          Are you sure you want to delete this transaction?
        </ConfirmDelete>
      )}
      {state.transactionToEdit && (
        <Modal
          open={true}
          onClose={() =>
            dispatch({ type: ACTIONS.SET_TRANSACTION_TO_EDIT, data: undefined })
          }
        >
          <EditTransaction
            transactionInput={state.transactionToEdit}
            onSave={saved => {
              saved.setId(state.transactionToEdit!.getId());
              updateTransaction(saved);
              dispatch({ type: ACTIONS.SET_SEARCHING, data: true });
            }}
            onClose={() =>
              dispatch({
                type: ACTIONS.SET_TRANSACTION_TO_EDIT,
                data: undefined,
              })
            }
          />
        </Modal>
      )}
      {state.assigningUser && (
        <Modal
          open={state.assigningUser.isAssigning}
          onClose={() => handleSetAssigningUser(false, -1)}
        >
          <SectionBar
            title="Assign Employee to Task"
            actions={[
              {
                label: 'Assign',
                onClick: () =>
                  handleAssignEmployee(
                    state.assignedEmployee,
                    state.assigningUser!.transactionId,
                  ),
              },
            ]}
          />
          <PlainForm
            data={assigned}
            onChange={(type: AssignedEmployeeType) =>
              dispatch({
                type: ACTIONS.SET_ASSIGNED_EMPLOYEE,
                data: type.employeeId,
              })
            }
            schema={SCHEMA_ASSIGN_USER}
            className="PayrollFilter"
          />
        </Modal>
      )}
      {state.mergingTransaction ? (
        <Modal
          open={state.mergingTransaction}
          onClose={() =>
            dispatch({
              type: ACTIONS.SET_MERGING_TRANSACTION,
              data: false,
            })
          }
        >
          <CompareTransactions
            loggedUserId={loggedUserId}
            onClose={() =>
              dispatch({
                type: ACTIONS.SET_MERGING_TRANSACTION,
                data: false,
              })
            }
            onMerge={() => resetTransactions()}
          />
        </Modal>
      ) : (
        <></>
      )}
      <PlainForm
        data={state.transactionFilter}
        onChange={handleSetFilter}
        onSubmit={() => dispatch({ type: ACTIONS.SET_SEARCHING, data: true })}
        onEnter={true}
        schema={SCHEMA}
        className="PayrollFilter"
      />
      <SectionBar
        title="Transactions"
        key={state.page.toString() + state.totalTransactions.toString()}
        fixedActions
        pagination={{
          count: state.totalTransactions,
          rowsPerPage: 50,
          page: state.page,
          onPageChange: number => {
            dispatch({ type: ACTIONS.SET_PAGE, data: number });
            dispatch({ type: ACTIONS.SET_CHANGING_PAGE, data: true });
          },
        }}
        actions={
          hasActions
            ? [
                {
                  label: 'New Transaction',
                  onClick: () => {
                    dispatch({
                      type: ACTIONS.SET_CREATING_TRANSACTION,
                      data: !state.creatingTransaction,
                    });
                  },
                },
                {
                  label: 'Merge Transactions',
                  onClick: () =>
                    dispatch({
                      type: ACTIONS.SET_MERGING_TRANSACTION,
                      data: true,
                    }), // makes merge popup come up
                },
              ]
            : []
        }
      />
      {state.pendingUploadPhoto && (
        <Modal
          open
          maxWidth={1000}
          onClose={() =>
            dispatch({
              type: ACTIONS.SET_PENDING_UPLOAD_PHOTO,
              data: undefined,
            })
          }
        >
          <UploadPhotoToExistingTransaction
            transactionPassed={state.pendingUploadPhoto}
            loggedUserId={loggedUserId}
            onClose={() =>
              dispatch({
                type: ACTIONS.SET_PENDING_UPLOAD_PHOTO,
                data: undefined,
              })
            }
          ></UploadPhotoToExistingTransaction>
        </Modal>
      )}
      <InfoTable
        key={
          state.transactions?.toString() +
          (state.creatingTransaction
            ? state.creatingTransaction.toString()
            : '') +
          state.transactions?.values.toString() +
          state.selectedTransactions.toString()
        }
        hoverable={false}
        onSaveRowButton={async saved => {
          dispatch({ type: ACTIONS.SET_LOADING, data: true });
          let result = await saveFromRowButton(saved);
          dispatch({
            type: ACTIONS.SET_CREATING_TRANSACTION,
            data: false,
          });
          // This is where the data would be uploaded alongside the transaction

          dispatch({ type: ACTIONS.SET_LOADING, data: false });
          if ((saved as any)['image']) {
            dispatch({
              type: ACTIONS.SET_IMAGE_WAIVER_TYPE_POPUP_OPEN,
              data: true,
            });
            dispatch({ type: ACTIONS.SET_TRANSACTION_TO_SAVE, data: result });
            dispatch({
              type: ACTIONS.SET_IMAGE_NAME_TO_SAVE,
              data: (saved as any)['image'],
            });
          }
        }}
        rowButton={{
          onFileLoad: data =>
            dispatch({ type: ACTIONS.SET_FILE_DATA, data: data }),
          externalButtonClicked: state.creatingTransaction,
          externalButton: true,
          type: new Transaction(),
          columnDefinition: {
            columnsToIgnore: ['Actions', 'Accepted / Rejected'],
            columnTypeOverrides: [
              { columnName: 'Type', columnType: 'text' },
              {
                columnName: 'Date',
                columnType: 'date',
              },
              {
                columnName: 'Department',
                columnType: 'department',
              },
              {
                columnName: 'Job #',
                columnType: 'number',
              },
              {
                columnName: 'Amount',
                columnType: 'number',
              },
              {
                columnName: 'Purchaser',
                columnType: 'technician',
              },
            ],
          },
        }}
        columns={[
          {
            name: isSelector ? 'Is selected?' : '',
            invisible: true,
          },
          {
            name: 'Date',
            dir:
              sortBy == 'timestamp'
                ? sortDir != ' '
                  ? sortDir
                  : undefined
                : undefined,
            onClick: () => changeSort('timestamp'),
          },
          {
            name: 'Order #',
            dir:
              sortBy == 'order_number'
                ? sortDir != ' '
                  ? sortDir
                  : undefined
                : undefined,
            onClick: () => changeSort('order_number'),
          },
          {
            name: 'Creator',
            dir:
              sortBy == 'owner_id'
                ? sortDir != ' '
                  ? sortDir
                  : undefined
                : undefined,
            onClick: () => changeSort('owner_id'),
          },
          {
            name: 'Department',
            dir:
              sortBy == 'department_id'
                ? sortDir != ' '
                  ? sortDir
                  : undefined
                : undefined,
            onClick: () => changeSort('department_id'),
          },
          {
            name: 'Job #',
            dir:
              sortBy == 'job_id'
                ? sortDir != ' '
                  ? sortDir
                  : undefined
                : undefined,
            onClick: () => changeSort('job_id'),
          },
          {
            name: 'Amount',
            dir:
              sortBy == 'amount'
                ? sortDir != ' '
                  ? sortDir
                  : undefined
                : undefined,
            onClick: () => changeSort('amount'),
          },
          {
            name: 'Vendor',
            dir:
              sortBy == 'vendor'
                ? sortDir != ' '
                  ? sortDir
                  : undefined
                : undefined,
            onClick: () => changeSort('vendor'),
          },
          { name: 'Actions' },
          {
            name: 'Accepted / Rejected',
          },
        ]}
        data={
          state.loading
            ? makeFakeRows(10, 15)
            : (state.transactions?.map((selectorParam, idx) => {
                let txnWithId = state.selectedTransactions.filter(
                  txn => txn.getId() === selectorParam.txn.getId(),
                );
                try {
                  return [
                    {
                      value: txnWithId.length == 1 ? 'SELECTED' : '',
                      invisible: !isSelector,
                    },
                    {
                      value:
                        selectorParam.txn.getTimestamp() != NULL_TIME &&
                        selectorParam.txn.getTimestamp() !=
                          '0000-00-00 00:00:00'
                          ? format(
                              new Date(
                                parseISO(selectorParam.txn.getTimestamp()),
                              ),
                              'yyyy-MM-dd',
                            )
                          : '-',
                      onClick: isSelector
                        ? () => setTransactionChecked(idx)
                        : undefined,
                    },
                    {
                      value: `${selectorParam.txn.getOrderNumber()}`,
                      onClick: isSelector
                        ? () => setTransactionChecked(idx)
                        : undefined,
                    },
                    {
                      value: `${selectorParam.txn.getOwnerName()} (${selectorParam.txn.getOwnerId()})`,
                      onClick: isSelector
                        ? () => setTransactionChecked(idx)
                        : undefined,
                    },
                    {
                      value: `${selectorParam.txn
                        .getDepartment()
                        ?.getDescription()}`,
                      onClick: isSelector
                        ? () => setTransactionChecked(idx)
                        : undefined,
                    },
                    {
                      value:
                        selectorParam.txn.getJobId() != 0 ? (
                          <PopoverComponent
                            buttonLabel={selectorParam.txn
                              .getJobId()
                              .toString()}
                            onClick={() =>
                              getJobNumberInfo(selectorParam.txn.getJobId())
                            }
                          ></PopoverComponent>
                        ) : (
                          0
                        ),
                      onClick: isSelector
                        ? () => setTransactionChecked(idx)
                        : undefined,
                    },
                    {
                      value: `$ ${prettyMoney(selectorParam.txn.getAmount())}`,
                      onClick: isSelector
                        ? () => setTransactionChecked(idx)
                        : undefined,
                    },
                    {
                      value: selectorParam.txn.getVendor(),
                      onClick: isSelector
                        ? () => setTransactionChecked(idx)
                        : undefined,
                    },
                    {
                      actions: !isSelector ? (
                        [
                          <Tooltip key="copy" content="Copy data to clipboard">
                            <IconButton
                              size="small"
                              onClick={() =>
                                copyToClipboard(
                                  `${parseISO(
                                    selectorParam.txn
                                      .getTimestamp()
                                      .split(' ')
                                      .join('T'),
                                  ).toLocaleDateString()},${selectorParam.txn.getDescription()},${selectorParam.txn.getAmount()},${selectorParam.txn.getOwnerName()},${selectorParam.txn.getVendor()}`,
                                )
                              }
                            >
                              <CopyIcon />
                            </IconButton>
                          </Tooltip>,
                          <Tooltip
                            key="editAll"
                            content="Edit this transaction"
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                dispatch({
                                  type: ACTIONS.SET_TRANSACTION_TO_EDIT,
                                  data: selectorParam.txn,
                                })
                              }
                            >
                              <LineWeightIcon />
                            </IconButton>
                          </Tooltip>,
                          <Tooltip key="upload" content="Upload File">
                            <IconButton
                              size="small"
                              onClick={() =>
                                dispatch({
                                  type: ACTIONS.SET_PENDING_UPLOAD_PHOTO,
                                  data: selectorParam.txn,
                                })
                              }
                            >
                              <UploadIcon />

                              {/*<input
                                type="file" 
                                ref={FileInput}
                                
                                onChange={event => {
                                  if (!transactionOfFileUploading) {
                                    console.error(
                                      'No transaction selected for upload.',
                                    );
                                    alert(
                                      'No transaction selected for upload.',
                                    );
                                    return;
                                  }
                                  event.preventDefault();
                                  handleFile(transactionOfFileUploading!);
                                }}
                                style={{ display: 'none' }}
                              />*/}
                            </IconButton>
                          </Tooltip>,
                          <AltGallery
                            key="Gallery"
                            fileList={[]}
                            title="Transaction Uploads"
                            text="View Photos and Documents"
                            transactionID={selectorParam.txn.getId()}
                            iconButton
                            canDelete={true}
                          />,
                          <TxnLog
                            key="txnLog"
                            iconButton
                            txnID={selectorParam.txn.getId()}
                          />,
                          <TxnNotes
                            key="viewNotes"
                            iconButton
                            text="View notes"
                            notes={selectorParam.txn.getNotes()}
                            disabled={selectorParam.txn.getNotes() === ''}
                          />,
                          ...([9928, 9646, 1734].includes(loggedUserId)
                            ? [
                                <Tooltip
                                  key="audit"
                                  content={
                                    selectorParam.txn.getIsAudited() &&
                                    loggedUserId !== 1734
                                      ? 'This transaction has already been audited'
                                      : 'Mark as correct'
                                  }
                                >
                                  <IconButton
                                    size="small"
                                    onClick={
                                      loggedUserId === 1734
                                        ? () => forceAccept(selectorParam.txn)
                                        : () => auditTxn(selectorParam.txn)
                                    }
                                    disabled={
                                      selectorParam.txn.getIsAudited() &&
                                      loggedUserId !== 1734
                                    }
                                  >
                                    <CheckIcon />
                                  </IconButton>
                                </Tooltip>,
                              ]
                            : []),
                          <Tooltip key="submit" content={'Mark as accepted'}>
                            <IconButton
                              disabled={selectorParam.txn.getStatusId() === 5}
                              size="small"
                              onClick={() => updateStatus(selectorParam.txn)}
                            >
                              <SubmitIcon />
                            </IconButton>
                          </Tooltip>,
                          <Tooltip
                            key="assign"
                            content="Assign an employee to this task"
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleSetAssigningUser(
                                  true,
                                  selectorParam.txn.getId(),
                                )
                              }
                            >
                              <AssignmentIndIcon />
                            </IconButton>
                          </Tooltip>,
                          selectorParam.txn.getStatusId() === 3 &&
                            loggedUserId === 98217 && (
                              <Tooltip
                                key="Process"
                                content="Mark As Processed"
                              >
                                <IconButton
                                  key="ProcessIcon"
                                  size="small"
                                  onClick={() =>
                                    updateStatusProcessed(selectorParam.txn)
                                  }
                                >
                                  <Save />
                                </IconButton>
                              </Tooltip>
                            ),
                          <Tooltip key="delete" content="Delete this task">
                            <IconButton
                              size="small"
                              onClick={() =>
                                dispatch({
                                  type: ACTIONS.SET_TRANSACTION_TO_DELETE,
                                  data: selectorParam.txn,
                                })
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>,
                          <Prompt
                            key="reject"
                            confirmFn={reason =>
                              dispute(reason, selectorParam.txn)
                            }
                            disabled={selectorParam.txn.getStatusId() === 5}
                            text="Reject transaction"
                            prompt="Enter reason for rejection: "
                            Icon={RejectIcon}
                          />,
                        ]
                      ) : (
                        <> </>
                      ),
                      actionsFullWidth: true,
                    },
                    {
                      actions: [
                        <>
                          {selectorParam.txn.getStatusId() === 3 ? (
                            <Tooltip key="accepted" content="Accepted">
                              <IconButton size="small">
                                <DoneIcon />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <> </>
                          )}
                          {selectorParam.txn.getStatusId() == 4 ? (
                            <>
                              <Tooltip
                                key="rejected"
                                content={`Rejected ${state.transactionActivityLogs
                                  .filter(
                                    log =>
                                      log.getTransactionId() ==
                                      selectorParam.txn.getId(),
                                  )
                                  .map(
                                    log =>
                                      `(Reason: ${log
                                        .getDescription()
                                        .substr(
                                          log.getDescription().indexOf(' ') + 1,
                                        )})`,
                                  )}`}
                              >
                                <IconButton size="small">
                                  <CloseIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <> </>
                          )}
                          {selectorParam.txn.getStatusId() === 5 ? (
                            <Tooltip key="processed" content="Processesd">
                              <IconButton size="small">
                                <CheckCircleOutlineIcon
                                  style={{ color: 'green' }}
                                />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <> </>
                          )}
                        </>,
                      ],
                    },
                  ];
                } catch (err) {
                  console.error('An error occurred while rendering: ', err);
                  return <>An error occurred while rendering: {err}</>;
                }
              }) as Data)
        }
        loading={state.loading}
      />
    </ErrorBoundary>
  );
};
