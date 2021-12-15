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
import { PDFDocument, PDFImage, PDFPage, PageSizes } from 'pdf-lib';
import CopyIcon from '@material-ui/icons/FileCopySharp';
import RejectIcon from '@material-ui/icons/ThumbDownSharp';
import SubmitIcon from '@material-ui/icons/ThumbUpSharp';
import { format, parseISO } from 'date-fns';
import {
  TransactionAccount,
  TransactionAccountList,
} from '@kalos-core/kalos-rpc/TransactionAccount';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { PopoverComponent } from '../Popover';
import React, { FC, useCallback, useEffect, useReducer } from 'react';
import {
  ENDPOINT,
  NULL_TIME,
  OPTION_ALL,
  WaiverTypes,
} from '../../../constants';
import { FilterType, PopupType, reducer, MergeDocuments } from './reducer';
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
  DevlogClientService,
  TransactionAccountClientService,
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
import { UploadPhotoTransaction } from '../UploadPhotoTransaction';
import { EditTransaction } from '../EditTransaction';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { StatusPicker } from './components/StatusPicker';
import { ErrorBoundary } from '../ErrorBoundary';
import { ConfirmDelete } from '../ConfirmDelete';
import { UploadPhotoToExistingTransaction } from '../UploadPhotoToExistingTransaction';
import { Form } from '../Form';
import { ACTIONS } from './reducer';
import { Devlog } from '@kalos-core/kalos-rpc/Devlog';
import { TxnDepartment } from '@kalos-core/kalos-rpc/compiled-protos/transaction_pb';
import { stringify } from 'querystring';
import { truncateSync } from 'fs';
import { getMimeType } from '@kalos-core/kalos-rpc/Common';
import { pdf } from '@react-pdf/renderer';
import { NULL_TIME_VALUE } from '../Timesheet/constants';

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

// This is outside of state because it was slow inside of state

let filter: FilterType = {
  departmentId: 0,
  employeeId: 0,
  week: OPTION_ALL,
  jobNumber: 0,
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
    openMerge: false,
    document1: '',
    document2: '',
    mergeDocumentAlert: '',
    costCenterData: new TransactionAccountList(),
    transactionActivityLogs: [],
    costCenters: [{ label: 'temp', value: 0 }],
    transactionToEdit: undefined,
    loading: true,
    creatingTransaction: false,
    mergingTransaction: false,
    pendingUploadPhoto: undefined,
    role: undefined,
    orderDir: 'ASC',
    orderBy: 'vendor, timestamp',
    assigningUser: undefined,
    employees: [],
    departments: [],
    page: 0,
    openUploadPhotoTransaction: false,
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
  };
  const resetTransactions = useCallback(async () => {
    let req = new Transaction();
    req.setOrderBy(state.orderBy ? state.orderBy : 'timestamp');
    req.setOrderDir(
      state.orderDir ? state.orderDir : state.orderDir == ' ' ? 'DESC' : 'DESC',
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
    if (state.transactionFilter.jobNumber)
      req.setJobId(state.transactionFilter.jobNumber);
    if (state.transactionFilter.departmentId != 0)
      req.setDepartmentId(state.transactionFilter.departmentId);
    if (state.transactionFilter.employeeId != 0)
      req.setOwnerId(state.transactionFilter.employeeId);
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
          let errLog = new Devlog();
          errLog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
          errLog.setUserId(loggedUserId);
          errLog.setDescription(
            `An error occurred while using universal search: ${err}`,
          );
          errLog.setErrorSeverity(0);
          await DevlogClientService.Create(errLog);
        } catch (errActivity) {
          console.error(`An error occurred while uploading a dev log: ${err} `);
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
          let errLog = new Devlog();
          errLog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
          errLog.setUserId(loggedUserId);
          errLog.setDescription(
            `An error occurred while batch-getting transactions in TransactionTable: ${err}`,
          );
          errLog.setErrorSeverity(0);
          await DevlogClientService.Create(errLog);
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
          let errLog = new Devlog();
          errLog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
          errLog.setTransactionId(transaction.getId());
          errLog.setUserId(loggedUserId);
          errLog.setDescription(
            `An error occurred while getting a transaction activity log: ${err}`,
          );
          errLog.setErrorSeverity(0);
          await DevlogClientService.Create(errLog);
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
    state.orderDir,
    state.orderBy,
    state.transactionFilter.processed,
    state.transactionFilter.universalSearch,
    state.transactionFilter.jobNumber,
  ]);

  const load = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LOADING, data: true });
    let employees;
    try {
      employees = await UserClientService.loadTechnicians();
    } catch (err) {
      console.error(
        `An error occurred while loading technicians from the UserClientService: ${err}`,
      );
    }
    if (employees) {
      let sortedEmployeeList = employees.sort((a, b) =>
        a.getLastname() > b.getLastname() ? 1 : -1,
      );
      dispatch({ type: ACTIONS.SET_EMPLOYEES, data: sortedEmployeeList });
    }
    let accountRes;
    try {
      accountRes = await TransactionAccountClientService.BatchGet(
        new TransactionAccount(),
      );
    } catch (err) {
      console.error(
        `An error occurred while getting transaction accounts: ${err}`,
      );
    }
    if (accountRes) {
      dispatch({ type: ACTIONS.SET_COST_CENTER_DATA, data: accountRes });

      dispatch({
        type: ACTIONS.SET_COST_CENTERS,
        data: accountRes.getResultsList().map(account => ({
          label: `${account.getId()}-${account.getDescription()}`,
          value: account.getId(),
        })),
      });
    }

    const userReq = new User();
    userReq.setId(loggedUserId);
    let user;
    try {
      user = await UserClientService.Get(userReq);
    } catch (err) {
      console.error(`An error occurred while getting a user: ${err}`);
    }
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

    if (user) {
      const role = user
        .getPermissionGroupsList()
        .find(p => p.getType() === 'role');

      if (role) {
        dispatch({ type: ACTIONS.SET_ROLE, data: role.getName() as RoleType });
      }
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
    dispatch({
      type: ACTIONS.UPDATE_LOCAL_STATUS,
      data: { transactionId: id, statusId: statusID },
    });

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
    }
  };
  const updateStatusProcessed = async (txn: Transaction) => {
    const ok = confirm(
      `Are you sure you want to mark this transaction as Processed?`,
    );
    if (ok) {
      await makeUpdateStatus(txn.getId(), 5, 'Recorded and Processed');
    }
  };
  const forceAccept = async (txn: Transaction) => {
    const ok = confirm(
      `Are you sure you want to mark this transaction as accepted?`,
    );
    if (ok) {
      await makeUpdateStatus(txn.getId(), 3, 'accepted');
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
    if (!d.jobNumber) {
      d.jobNumber = 0;
    }
    filter.departmentId = d.departmentId;
    filter.employeeId = d.employeeId;
    filter.jobNumber = d.jobNumber;
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
        const temp = transactionToSave;
        transactionToSave.setCostCenterId(
          parseInt(transactionToSave.getCostCenterId().toString()),
        );
        transactionToSave.setDepartmentId(
          parseInt(transactionToSave.getDepartmentId().toString()),
        );
        const costCenterReq = new TransactionAccount();
        costCenterReq.setId(transactionToSave.getCostCenterId());
        const costCenterResult = await TransactionAccountClientService.Get(
          costCenterReq,
        );
        transactionToSave.setCostCenter(costCenterResult);
        const departmentReq = new TimesheetDepartment();
        departmentReq.setId(transactionToSave.getDepartmentId());
        const departmentResult = await TimesheetDepartmentClientService.Get(
          departmentReq,
        );
        const txnDepartment = new TxnDepartment();
        txnDepartment.setDescription(departmentResult.getDescription());
        transactionToSave.setDepartment(txnDepartment);
        dispatch({
          type: ACTIONS.SET_UPDATE_FROM_LOCAL_LIST,
          data: transactionToSave,
        });

        dispatch({ type: ACTIONS.SET_TRANSACTION_TO_EDIT, data: undefined });
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
    [loggedUserId, state.page],
  );
  const getJobNumberInfo = async (number: number) => {
    let returnString = ['No Job Info Found'];
    if (number != 0) {
      try {
        const eventReq = new Event();
        eventReq.setId(number);
        const res = await EventClientService.Get(eventReq);
        const descritpion = 'Job Description: ' + res.getDescription();
        const customer =
          'Customer: ' +
          (res.getCustomer() === undefined
            ? 'No Customer '
            : `${res.getCustomer()!.getFirstname()} ${res
                .getCustomer()!
                .getLastname()}`);
        const property =
          'Property: ' +
          (res.getProperty() === undefined
            ? 'No Property'
            : `${res.getProperty()!.getAddress()} ${res
                .getProperty()!
                .getCity()}`);
        returnString = [descritpion, customer, property];
      } catch (error) {
        console.log('Not a number');
      }
    }
    return returnString;
  };
  const changeSort = (newSort: string) => {
    let newSortDir: OrderDir | undefined;
    let sortDir = state.orderDir;
    if (newSort === state.orderBy) {
      if (sortDir === 'ASC') {
        newSortDir = 'DESC';
      }
      if (sortDir === 'DESC') {
        newSortDir = undefined;
      }
      if (sortDir === undefined) {
        newSortDir = 'ASC';
      }
    } else {
      newSortDir = 'ASC';
    }
    dispatch({ type: ACTIONS.SET_PAGE, data: 0 });

    dispatch({
      type: ACTIONS.SET_ORDER,
      data: { orderBy: newSort, orderDir: newSortDir },
    });
    dispatch({ type: ACTIONS.SET_SEARCHING, data: true });
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
  const handleFileLoad = useCallback((stateFile: string, file) => {
    if (stateFile == 'document1') {
      dispatch({
        type: ACTIONS.SET_MERGE_DOCUMENT1,
        data: file,
      });
    }
    if (stateFile == 'document2') {
      dispatch({
        type: ACTIONS.SET_MERGE_DOCUMENT2,
        data: file,
      });
    }
  }, []);
  const SCHEMA_MERGE_DOCUMENTS: Schema<MergeDocuments> = [
    [
      {
        name: 'document1',
        label: 'File',
        type: 'file',
        required: true,
        onFileLoad: e => handleFileLoad('document1', e),
      },
    ],
    [
      {
        name: 'document2',
        label: 'File2',
        type: 'file',
        required: true,
        onFileLoad: e => handleFileLoad('document2', e),
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
        name: 'jobNumber',
        label: 'Search Job Number',
        type: 'search',
      },
      {
        name: 'amount',
        label: 'Search Amount',
        type: 'text',
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
      let newtimestamp = newTxn.getTimestamp();
      console.log('time we got:', newtimestamp);
      if (
        newtimestamp.includes('000') ||
        newtimestamp == '' ||
        newtimestamp == undefined ||
        newtimestamp == NULL_TIME_VALUE
      ) {
        console.log('not valid date');
        const newTimestamp = format(new Date(), 'yyyy-MM-dd hh:mm:ss');
        console.log('new date', newTimestamp);
        newTxn.setTimestamp(newTimestamp);
      }
      newTxn.setOrderNumber(saved['Order #']);
      newTxn.setAssignedEmployeeId(loggedUserId);
      if (saved['Purchaser'] == null || saved['Purchaser'] === '') {
        newTxn.setOwnerId(loggedUserId);
      } else {
        newTxn.setOwnerId(saved['Purchaser']);
      }
      newTxn.setOwnerId(saved['Purchaser']);
      newTxn.setDepartmentId(saved['Department']);
      newTxn.setJobId(saved['Job #']);
      newTxn.setNotes(saved['Notes']);
      newTxn.setCostCenterId(saved['Cost Center ID']);
      newTxn.setAmount(saved['Amount']);
      newTxn.setVendor(saved['Vendor']);
      newTxn.setStatusId(2);
      newTxn.setVendorCategory('Receipt');
      if (saved['Notes'] === '')
        newTxn.setNotes(
          `Order Number-${newTxn.getOrderNumber()},Job Number-${newTxn.getJobId()}`,
        );
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
        log.setTransactionId(res!.getId());
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
      dispatch({
        type: ACTIONS.SET_DELETE_FROM_LOCAL_LIST,
        data: state.transactionToDelete,
      });

      dispatch({ type: ACTIONS.SET_TRANSACTION_TO_DELETE, data: undefined });
    } catch (err) {
      console.error(`An error occurred while deleting a transaction: ${err}`);
    }
  }, [state.transactionToDelete]);

  useEffect(() => {
    async function refreshEverything() {
      await load();
      await resetTransactions();
    }
    if (!state.loaded) {
      load();
      resetTransactions();
    }
    if (state.changingPage) {
      load();
      resetTransactions();
    }
    if (state.searching) {
      dispatch({ type: ACTIONS.SET_PAGE, data: 0 });
      dispatch({ type: ACTIONS.SET_CHANGING_PAGE, data: true });

      dispatch({ type: ACTIONS.SET_SEARCHING, data: false });
    }
  }, [
    load,
    resetTransactions,
    state.changingPage,
    refresh,
    state.loaded,
    state.searching,
  ]);

  const imageDimensionToFit = (
    image: PDFImage,
    container: { width: number; height: number },
  ) => {
    if (
      Math.min(image.width, container.width) === image.width &&
      Math.min(image.height, container.height) === image.height
    )
      return { width: image.width, height: image.height };
    const image_ratio = image.width / image.height;
    const container_ratio = container.width / container.height;
    if (container_ratio > image_ratio) {
      return {
        width: (image.width * container.height) / image.height,
        height: container.height,
      };
    } else {
      return {
        width: container.width,
        height: (image.height * container.width) / image.width,
      };
    }
  };
  const toPdfPromise = async (file: string) => {
    const pdf = await PDFDocument.create();

    const page = pdf.addPage(PageSizes.A4);
    const imageUInt8Array = file;

    try {
      console.log('embed jpeg');
      const tempImage = await pdf.embedJpg(imageUInt8Array);
      const [a4_width, a4_height] = PageSizes.A4;
      const dimensions = imageDimensionToFit(tempImage, {
        width: a4_width,
        height: a4_height,
      });
      page.drawImage(tempImage, {
        x: (a4_width - dimensions.width) / 2,
        y: (a4_height - dimensions.height) / 2,
        width: dimensions.width,
        height: dimensions.height,
      });
      return { pdf: pdf.save(), error: '' };
    } catch (e) {
      console.log('failed to embed jpeg, trying png');
      try {
        const tempImage = await pdf.embedPng(imageUInt8Array);
        const [a4_width, a4_height] = PageSizes.A4;
        const dimensions = imageDimensionToFit(tempImage, {
          width: a4_width,
          height: a4_height,
        });
        page.drawImage(tempImage, {
          x: (a4_width - dimensions.width) / 2,
          y: (a4_height - dimensions.height) / 2,
          width: dimensions.width,
          height: dimensions.height,
        });
        return { pdf: pdf.save(), error: '' };
      } catch (e) {
        console.log('something went wrong with drawing the image', e);
        return { pdf: pdf.save(), error: 'Could not Draw Image on PDF' };
      }
    }
  };

  const mergePdf = async () => {
    const mergedPdf = await PDFDocument.create();
    let pdfA = await PDFDocument.create();
    let pdfB = await PDFDocument.create();
    let error = '';
    try {
      pdfA = await PDFDocument.load(state.document1);
    } catch (e) {
      try {
        let resultA = await toPdfPromise(state.document1);
        pdfA = await PDFDocument.load(await resultA.pdf);
        if (resultA.error != '') {
          error = resultA.error;
        }
        console.log('first document not a pdf');
      } catch (e) {
        console.log('failed to load document a as pdf or image ', e);
        dispatch({
          type: ACTIONS.SET_MERGE_DOCUMENT_ALERT,
          data: 'Could not generate PDF',
        });
      }
    }
    try {
      pdfB = await PDFDocument.load(state.document2);
    } catch (e) {
      try {
        let resultB = await toPdfPromise(state.document2);
        pdfB = await PDFDocument.load(await resultB.pdf);
        if (resultB.error != '') {
          error = resultB.error;
        }
      } catch (e) {
        console.log('failed to load document b as a pdf and image ', e);
        dispatch({
          type: ACTIONS.SET_MERGE_DOCUMENT_ALERT,
          data: 'Could not generate PDF',
        });
      }

      console.log('second document not a pdf ', e);
    }
    console.log('loading documents');
    if (error != '') {
      dispatch({
        type: ACTIONS.SET_MERGE_DOCUMENT_ALERT,
        data: 'Could not generate PDF',
      });
    } else {
      const copiedPagesA = await mergedPdf.copyPages(
        pdfA,
        pdfA.getPageIndices(),
      );
      console.log('copying from a');

      copiedPagesA.forEach(page => mergedPdf.addPage(page));

      const copiedPagesB = await mergedPdf.copyPages(
        pdfB,
        pdfB.getPageIndices(),
      );
      console.log('copying from b');

      copiedPagesB.forEach(page => mergedPdf.addPage(page));

      const mergedPdfFile = await mergedPdf.save();
      console.log('copying saving');

      var link = document.createElement('a');
      var blob = new Blob([mergedPdfFile], { type: 'application/pdf' });
      link.href = window.URL.createObjectURL(blob);
      console.log('creating url');

      var fileName = 'MergedDocument';
      link.download = fileName;
      link.click();
      dispatch({
        type: ACTIONS.SET_OPEN_MERGE,
        data: false,
      });
    }
  };
  return (
    <ErrorBoundary key="ErrorBoundary">
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
      {state.openMerge && (
        <Modal
          open={state.openMerge}
          onClose={() => {
            dispatch({ type: ACTIONS.SET_MERGE_DOCUMENT1, data: '' });
            dispatch({ type: ACTIONS.SET_MERGE_DOCUMENT2, data: '' });
            dispatch({ type: ACTIONS.SET_OPEN_MERGE, data: false });
          }}
        >
          <Alert
            open={state.mergeDocumentAlert != ''}
            onClose={() =>
              dispatch({ type: ACTIONS.SET_MERGE_DOCUMENT_ALERT, data: '' })
            }
            label="Okay"
          >
            There was an Error generating your PDF. There may be something wrong
            with the file. If you continue to notice this error, please contact
            webtech
          </Alert>
          <Form<MergeDocuments>
            key="mergeDocuments"
            title="Merge PDFs"
            schema={SCHEMA_MERGE_DOCUMENTS}
            data={{ document1: state.document1, document2: state.document2 }}
            onSave={mergePdf}
            submitLabel="Save"
            onClose={() => {
              dispatch({ type: ACTIONS.SET_MERGE_DOCUMENT1, data: '' });
              dispatch({ type: ACTIONS.SET_MERGE_DOCUMENT2, data: '' });
              dispatch({ type: ACTIONS.SET_OPEN_MERGE, data: false });
            }}
          ></Form>
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
            title="Edit Transaction"
            onSave={saved => {
              saved.setId(state.transactionToEdit!.getId());
              updateTransaction(saved);
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
          hasActions &&
          (state.role == 'AccountsPayable' || state.role == 'Manager')
            ? [
                {
                  label: 'Merge 2 Documents',
                  onClick: () => {
                    dispatch({
                      type: ACTIONS.SET_OPEN_MERGE,
                      data: true,
                    });
                  },
                },
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
            : [
                {
                  label:
                    'Upload Pick Ticket, Invoice, or Non Credit Card Receipt',
                  onClick: () =>
                    dispatch({
                      type: ACTIONS.SET_OPEN_UPLOAD_PHOTO_TRANSACTION,
                      data: true,
                    }),
                  fixed: true,
                },
              ]
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
            columnsToIgnore: ['Actions', 'Accepted / Rejected', 'Creator'],
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
                columnType: 'eventId',
              },
              {
                columnName: 'Cost Center ID',
                columnType: 'number',
                options: state.costCenters,
              },
              {
                columnName: 'Amount',
                columnType: 'number',
              },
              {
                columnName: 'Purchaser',
                columnType: 'technician',
              },
              {
                columnName: 'Notes',
                columnType: 'text',
              },
              {
                columnName: 'Creator',
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
            dir: state.orderBy == 'timestamp' ? state.orderDir : undefined,
            onClick: () => changeSort('timestamp'),
          },
          {
            name: 'Order #',
            dir: state.orderBy == 'order_number' ? state.orderDir : undefined,
            onClick: () => changeSort('order_number'),
          },
          {
            name: 'Purchaser',
            dir: state.orderBy == 'owner_id' ? state.orderDir : undefined,
            onClick: () => changeSort('owner_id'),
          },
          {
            name: 'Creator',
            dir:
              state.orderBy == 'assigned_employee_id'
                ? state.orderDir
                : undefined,
            onClick: () => changeSort('assigned_employee_id'),
          },
          {
            name: 'Department',
            dir: state.orderBy == 'department_id' ? state.orderDir : undefined,
            onClick: () => changeSort('department_id'),
          },
          {
            name: 'Job #',
            dir: state.orderBy == 'job_id' ? state.orderDir : undefined,
            onClick: () => changeSort('job_id'),
          },
          {
            name: 'Cost Center ID',
            dir: state.orderBy == 'cost_center_id' ? state.orderDir : undefined,
            onClick: () => changeSort('cost_center_id'),
          },
          {
            name: 'Amount',
            dir: state.orderBy == 'amount' ? state.orderDir : undefined,

            onClick: () => changeSort('amount'),
          },
          {
            name: 'Vendor',
            dir: state.orderBy == 'vendor' ? state.orderDir : undefined,
            onClick: () => changeSort('vendor'),
          },
          {
            name: 'Notes',
            dir: state.orderBy == 'notes' ? state.orderDir : undefined,
            onClick: () => changeSort('notes'),
          },
          { name: 'Actions' },
          {
            name: 'Accepted / Rejected',
          },
        ]}
        data={
          state.loading
            ? makeFakeRows(11, 15)
            : (state.transactions?.map((selectorParam, idx) => {
                let txnWithId = state.selectedTransactions.filter(
                  txn => txn.getId() === selectorParam.txn.getId(),
                );
                try {
                  return [
                    {
                      value: (
                        <div key="selected">
                          {txnWithId.length == 1 ? 'SELECTED' : ''}
                        </div>
                      ),
                      invisible: !isSelector,
                    },
                    {
                      value: (
                        <div key="Time">
                          {selectorParam.txn.getTimestamp() != NULL_TIME &&
                          selectorParam.txn.getTimestamp() !=
                            '0000-00-00 00:00:00'
                            ? format(
                                new Date(
                                  parseISO(selectorParam.txn.getTimestamp()),
                                ),
                                'yyyy-MM-dd',
                              )
                            : '-'}
                        </div>
                      ),
                      onClick: isSelector
                        ? () => setTransactionChecked(idx)
                        : undefined,
                    },
                    {
                      value: (
                        <div key="orderNumber">{`${selectorParam.txn.getOrderNumber()}`}</div>
                      ),
                      key: '',
                      onClick: isSelector
                        ? () => setTransactionChecked(idx)
                        : undefined,
                    },
                    {
                      value: (
                        <div key="OwnernameValue">
                          {selectorParam.txn.getOwnerId() != 0
                            ? `${selectorParam.txn.getOwnerName()} (${selectorParam.txn.getOwnerId()})`
                            : 'No Purchaser'}
                        </div>
                      ),
                      onClick: isSelector
                        ? () => setTransactionChecked(idx)
                        : undefined,
                    },
                    {
                      value: (
                        <div key="CreatornameValue">{`${selectorParam.txn.getAssignedEmployeeName()} (${selectorParam.txn.getAssignedEmployeeId()})`}</div>
                      ),
                      onClick: isSelector
                        ? () => setTransactionChecked(idx)
                        : undefined,
                    },
                    {
                      value: (
                        <div key="departmentValue">{`${selectorParam.txn
                          .getDepartment()
                          ?.getDescription()}`}</div>
                      ),
                      onClick: isSelector
                        ? () => setTransactionChecked(idx)
                        : undefined,
                    },
                    {
                      value: (
                        <div key="JobIdValue">
                          {selectorParam.txn.getJobId() != 0 ? (
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
                          )}
                        </div>
                      ),
                      onClick: isSelector
                        ? () => setTransactionChecked(idx)
                        : undefined,
                    },
                    {
                      value: (
                        <div key="CostCenterValue">{`${selectorParam.txn
                          .getCostCenter()
                          ?.getId()}-${selectorParam.txn
                          .getCostCenter()
                          ?.getDescription()}`}</div>
                      ),
                      onClick: isSelector
                        ? () => setTransactionChecked(idx)
                        : undefined,
                    },
                    {
                      value: (
                        <div key="AmountValue">
                          ${prettyMoney(selectorParam.txn.getAmount())}
                        </div>
                      ),
                      onClick: isSelector
                        ? () => setTransactionChecked(idx)
                        : undefined,
                    },
                    {
                      value: (
                        <div key="VendorValue">
                          {selectorParam.txn.getVendor()}
                        </div>
                      ),
                      onClick: isSelector
                        ? () => setTransactionChecked(idx)
                        : undefined,
                    },
                    {
                      value: (
                        <div key="NotesValue">
                          {selectorParam.txn.getNotes()}
                        </div>
                      ),
                      onClick: isSelector
                        ? () => setTransactionChecked(idx)
                        : undefined,
                    },
                    {
                      actions:
                        !isSelector &&
                        (state.role == 'AccountsPayable' ||
                          state.role == 'Manager') ? (
                          [
                            <Tooltip
                              key="copy"
                              content="Copy data to clipboard"
                            >
                              <IconButton
                                key="copyIcon"
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
                                key="editIcon"
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
                                key={'uploadIcon'}
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
                                      key="auditIcon"
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
                                key="submitIcon"
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
                                key="assignIcon"
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
                                key="deleteIcon"
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
                          <div key={'NormalActions'}>
                            <Tooltip key="upload" content="Upload File">
                              <IconButton
                                key={'uploadIcon'}
                                size="small"
                                onClick={() =>
                                  dispatch({
                                    type: ACTIONS.SET_PENDING_UPLOAD_PHOTO,
                                    data: selectorParam.txn,
                                  })
                                }
                              >
                                <UploadIcon />
                              </IconButton>
                            </Tooltip>
                            <AltGallery
                              key="Gallery"
                              fileList={[]}
                              title="Transaction Uploads"
                              text="View Photos and Documents"
                              transactionID={selectorParam.txn.getId()}
                              iconButton
                            />
                            <Tooltip
                              key="editAll"
                              content="Edit this transaction"
                            >
                              <IconButton
                                key="editIcon"
                                disabled={
                                  selectorParam.txn.getAssignedEmployeeId() !=
                                    loggedUserId ||
                                  selectorParam.txn.getOwnerId() != loggedUserId
                                }
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
                            </Tooltip>
                          </div>
                        ),
                      actionsFullWidth: true,
                    },
                    {
                      actions: [
                        <div key="Actions">
                          {selectorParam.txn.getStatusId() === 3 ? (
                            <Tooltip key="accepted" content="Accepted">
                              <IconButton size="small" key={'doneIcon'}>
                                <DoneIcon />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <> </>
                          )}
                          {selectorParam.txn.getStatusId() == 4 ? (
                            <div key="rectionReason">
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
                                <IconButton size="small" key="closeIcon">
                                  <CloseIcon />
                                </IconButton>
                              </Tooltip>
                            </div>
                          ) : (
                            <> </>
                          )}
                          {selectorParam.txn.getStatusId() === 5 ? (
                            <Tooltip key="processed" content="Processesd">
                              <IconButton size="small" key="checkCircleIcon">
                                <CheckCircleOutlineIcon
                                  style={{ color: 'green' }}
                                />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <> </>
                          )}
                        </div>,
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
      {state.openUploadPhotoTransaction ? (
        <Modal
          open={state.openUploadPhotoTransaction}
          onClose={() =>
            dispatch({
              type: ACTIONS.SET_OPEN_UPLOAD_PHOTO_TRANSACTION,
              data: false,
            })
          }
        >
          <UploadPhotoTransaction
            loggedUserId={loggedUserId}
            bucket="kalos-transactions"
            costCenters={state.costCenterData}
            onClose={() =>
              dispatch({
                type: ACTIONS.SET_OPEN_UPLOAD_PHOTO_TRANSACTION,
                data: false,
              })
            }
          />
        </Modal>
      ) : (
        <></>
      )}
    </ErrorBoundary>
  );
};
