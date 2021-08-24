import { EmailConfig } from '@kalos-core/kalos-rpc/Email';
import {
  Transaction,
  TransactionList,
} from '@kalos-core/kalos-rpc/Transaction';
import { TransactionAccountList } from '@kalos-core/kalos-rpc/TransactionAccount';
import {
  TransactionActivity,
  TransactionActivityClient,
} from '@kalos-core/kalos-rpc/TransactionActivity';
import { User } from '@kalos-core/kalos-rpc/User';
import IconButton from '@material-ui/core/IconButton';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import CheckIcon from '@material-ui/icons/CheckCircleSharp';
import CloseIcon from '@material-ui/icons/Close';
import UploadIcon from '@material-ui/icons/CloudUploadSharp';
import DoneIcon from '@material-ui/icons/Done';
import CopyIcon from '@material-ui/icons/FileCopySharp';
import RejectIcon from '@material-ui/icons/ThumbDownSharp';
import SubmitIcon from '@material-ui/icons/ThumbUpSharp';
import DeleteIcon from '@material-ui/icons/Delete';
import { format, parseISO } from 'date-fns';
import React, { FC, useCallback, useEffect, useState, useReducer } from 'react';
import { ENDPOINT, NULL_TIME, OPTION_ALL } from '../../../constants';
import { FilterType, reducer } from './reducer';

import {
  makeFakeRows,
  OrderDir,
  TimesheetDepartmentClientService,
  timestamp,
  TransactionClientService,
  UserClientService,
  TransactionActivityClientService,
  EmailClientService,
  TransactionDocumentClientService,
} from '../../../helpers';
import { AltGallery } from '../../AltGallery/main';
import { Tooltip } from '../../ComponentsLibrary/Tooltip';
import { Loader } from '../../Loader/main';
import { Prompt } from '../../Prompt/main';
import { TxnLog } from '../../transaction/components/log';
import { TxnNotes } from '../../transaction/components/notes';
import { prettyMoney } from '../../transaction/components/row';
import { CompareTransactions } from '../CompareTransactions';
import { GalleryData } from '../Gallery';
import { Data, InfoTable } from '../InfoTable';
import { Alert } from '../Alert';
import { Modal } from '../Modal';
import { FilterData, RoleType, AssignedUserData } from '../Payroll';
import { PlainForm, Schema } from '../PlainForm';
import { SectionBar } from '../SectionBar';
import { UploadPhotoTransaction } from '../UploadPhotoTransaction';
import LineWeightIcon from '@material-ui/icons/LineWeight';
import { EditTransaction } from '../EditTransaction';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { StatusPicker } from './components/StatusPicker';
import {
  TransactionDocument,
  TransactionDocumentList,
} from '@kalos-core/kalos-rpc/TransactionDocument';
import { ErrorBoundary } from '../ErrorBoundary';
import { ConfirmDelete } from '../ConfirmDelete';
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
};

let assigned: AssignedEmployeeType = {
  employeeId: 0,
};

let transactionOfFileUploading: Transaction | undefined = undefined;
export const TransactionTable: FC<Props> = ({
  loggedUserId,
  isSelector,
  onSelect,
  onDeselect,
  hasActions,
}) => {
  const FileInput = React.createRef<HTMLInputElement>();

  //const [transactions, setTransactions] = useState<SelectorParams[]>();
  //const [totalTransactions, setTotalTransactions] = useState<number>(0);
  //const [transactionActivityLogs, setTransactionActivityLogs] = useState<
  //  TransactionActivity[]
  //>([]);
  // const [transactionToEdit, setTransactionToEdit] = useState<
  //   Transaction | undefined
  // >();
  //const [loading, setLoading] = useState<boolean>(true);
  //const [loadTransactions, setloadTransactions] = useState<boolean>(true);

  //const [creatingTransaction, setCreatingTransaction] = useState<boolean>(); // for when a transaction is being made, pops up the popup
  //const [mergingTransaction, setMergingTransaction] = useState<boolean>(); // When a txn is being merged with another one, effectively allowing full
  // editorial control for Dani
  //const [role, setRole] = useState<RoleType>();
  //const [assigningUser, setAssigningUser] = useState<{
  //  isAssigning: boolean;
  //  transactionId: number;
  //}>(); // sets open an employee picker in a modal
  //const [employees, setEmployees] = useState<User[]>([]);
  //const [departments, setDepartments] = useState<TimesheetDepartment[]>([]);
  //const [selectedTransactions, setSelectedTransactions] = useState<
  //  Transaction[]
  //>([]); // Transactions that are selected in the table if the isSelector prop is set
  //const [pageNumber, setPageNumber] = useState<number>(0);
  // For assigning employees, this will store the last chosen one for the form
  //const [assignedEmployee, setAssignedEmployee] = useState<number | undefined>(
  //  undefined,
  //);
  //const [error, setError] = useState<string | undefined>(undefined);
  /*
  const [status, setStatus] = useState<
    'Accepted' | 'Rejected' | 'Accepted / Rejected'
  >('Accepted / Rejected');
  */
  //const [loaded, setLoaded] = useState<boolean>(false);
  //const [changingPage, setChangingPage] = useState<boolean>(false); // To fix a bunch of issues with callbacks going in
  // front of other callbacks
  const [state, dispatch] = useReducer(reducer, {
    transactionFilter: filter,
    transactions: undefined,
    totalTransactions: 0,
    transactionActivityLogs: [],
    transactionToEdit: undefined,
    loading: true,
    loadTransactions: true,
    creatingTransaction: false,
    mergingTransaction: false,
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
  });
  const {
    transactionFilter,
    transactions,
    totalTransactions,
    transactionActivityLogs,
    transactionToEdit,
    transactionToDelete,
    loading,
    loaded,
    loadTransactions,
    creatingTransaction,
    mergingTransaction,
    role,
    assigningUser,
    employees,
    selectedTransactions,
    departments,
    page,
    changingPage,
    assignedEmployee,
    error,
    status,
  } = state;

  const handleSetTransactionToEdit = useCallback(
    (transaction: Transaction | undefined) => {
      dispatch({ type: 'setTransactionToEdit', data: transaction });
    },
    [],
  );

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

  const getGalleryData = async (txn: Transaction) => {
    let documents: TransactionDocumentList = new TransactionDocumentList();
    try {
      let req = new TransactionDocument();
      req.setTransactionId(txn.getId());
      documents = await TransactionDocumentClientService.BatchGet(req);
    } catch (err) {
      console.error(
        `An error occurred while getting transaction documents for transaction #${txn.getId()}: ${err}`,
      );
    }
    return documents.getResultsList().map(result => {
      return {
        key: `${txn.getId()}-${result.getReference()}`,
        bucket: 'kalos-transactions',
      } as GalleryData;
    });
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

  const handleChangePage = useCallback((pageNumberToChangeTo: number) => {
    dispatch({ type: 'setPage', data: pageNumberToChangeTo });
    dispatch({ type: 'setChangingPage', data: true });
  }, []);
  const resetTransactions = useCallback(async () => {
    let req = new Transaction();
    req.setOrderBy(sortBy ? sortBy : 'timestamp');
    req.setOrderDir(
      sortDir && sortDir != ' ' ? sortDir : sortDir == ' ' ? 'DESC' : 'DESC',
    );
    req.setPageNumber(state.page);

    req.setIsActive(1);
    req.setVendorCategory("'PickTicket','Receipt','Invoice'");
    if (transactionFilter.isAccepted) {
      req.setStatusId(3);
    }
    if (transactionFilter.isRejected) {
      req.setStatusId(4);
    }
    if (transactionFilter.vendor)
      req.setVendor(`%${transactionFilter.vendor}%`);
    if (transactionFilter.departmentId != 0)
      req.setDepartmentId(transactionFilter.departmentId);
    if (transactionFilter.employeeId != 0)
      req.setAssignedEmployeeId(transactionFilter.employeeId);
    if (transactionFilter.amount) req.setAmount(transactionFilter.amount);
    req.setIsBillingRecorded(transactionFilter.billingRecorded);
    req.setFieldMaskList(['IsBillingRecorded']);
    let res: TransactionList | null = null;
    if (transactionFilter.universalSearch) {
      try {
        req.setSearchPhrase(`%${transactionFilter.universalSearch}%`);
        res = await TransactionClientService.Search(req);
      } catch (err) {
        console.error(
          `An error occurred while searching for transactions in TransactionTable: ${err}`,
        );
      }
    } else {
      try {
        res = await TransactionClientService.BatchGet(req);
        if (res.getTotalCount() < totalTransactions) {
          dispatch({ type: 'setTotalTransactions', data: res.getTotalCount() });

          handleChangePage(0);
        }
      } catch (err) {
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
        console.error(
          `An error occurred while getting a transaction activity log: ${err}`,
        );
      }
    });
    dispatch({ type: 'setTransactionActivityLogs', data: logList });

    dispatch({ type: 'setTotalTransactions', data: res.getTotalCount() });
    let transactions = res.getResultsList().map(txn => {
      return {
        txn: txn,
        checked: false,
        totalCount: res!.getTotalCount(),
      } as SelectorParams;
    });
    const temp = transactions.map(txn => txn);
    dispatch({ type: 'setTransactions', data: temp });
  }, [totalTransactions, state.page, transactionFilter, handleChangePage]);

  const load = useCallback(async () => {
    dispatch({ type: 'setLoading', data: true });
    const employees = await UserClientService.loadTechnicians();
    let sortedEmployeeList = employees.sort((a, b) =>
      a.getLastname() > b.getLastname() ? 1 : -1,
    );
    dispatch({ type: 'setEmployees', data: sortedEmployeeList });

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
      let userDepartments = user
        .getPermissionGroupsList()
        .filter(a => a.getType() == 'department');
      //let filteredDepartments = departments.filter((a, b) =>
      dispatch({ type: 'setDepartments', data: departments });
    } catch (err) {
      console.error(
        `An error occurred while getting the timesheet departments: ${err}`,
      );
    }

    dispatch({ type: 'setLoading', data: true });

    const role = user
      .getPermissionGroupsList()
      .find(p => p.getType() === 'role');

    if (role) {
      dispatch({ type: 'setRole', data: role.getName() as RoleType });
    }

    dispatch({ type: 'setChangingPage', data: false });

    dispatch({ type: 'setLoading', data: false });
    dispatch({ type: 'setLoaded', data: true });
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
  const handleFile = (txn: Transaction) => {
    const fr = new FileReader();
    fr.onload = async () => {
      try {
        const u8 = new Uint8Array(fr.result as ArrayBuffer);
        await TransactionDocumentClientService.upload(
          txn.getId(),
          FileInput.current!.files![0].name,
          u8,
        );
      } catch (err) {
        alert('File could not be uploaded');
        console.error(err);
      }

      await refresh();
      alert('Upload complete!');
    };
    if (FileInput.current && FileInput.current.files) {
      fr.readAsArrayBuffer(FileInput.current.files[0]);
    }
  };

  const handleSetError = useCallback(
    (error: string | undefined) => dispatch({ type: 'setError', data: error }),
    [],
  );

  const handleSetAssigningUser = useCallback(
    (isAssigningUser: boolean, transactionId: number) => {
      if (isAssigningUser) {
        dispatch({
          type: 'setAssignedEmployee',
          data: undefined,
        });
      }
      dispatch({
        type: 'setAssigningUser',
        data: {
          isAssigning: isAssigningUser,
          transactionId: transactionId,
        },
      });
    },
    [],
  );

  const handleSetAssignedEmployee = useCallback(
    assignedEmployee =>
      dispatch({
        type: 'setAssignedEmployee',
        data: assignedEmployee,
      }),
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
    dispatch({ type: 'setFilter', data: filter });
    dispatch({ type: 'setLoadTransactions', data: true });
  }, []);

  const handleUpdateTransaction = useCallback(
    async (transactionToSave: Transaction) => {
      try {
        await TransactionClientService.Update(transactionToSave);
        dispatch({ type: 'setTransactionToEdit', data: undefined });
        refresh();
      } catch (err) {
        console.error('An error occurred while updating a transaction: ', err);
        dispatch({ type: 'setTransactionToEdit', data: undefined });
      }
    },
    [refresh],
  );

  const handleChangeSort = (newSort: string) => {
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
      dispatch({ type: 'setPage', data: 0 });
    }

    sortBy = newSort;
    sortDir = newSortDir;

    refresh();
  };

  const handleSetCreatingTransaction = useCallback(
    (isCreatingTransaction: boolean) => {
      dispatch({ type: 'setCreatingTransaction', data: isCreatingTransaction });
    },
    [],
  );

  const handleSetMergingTransaction = useCallback(
    (isMergingTransaction: boolean) => {
      dispatch({ type: 'setMergingTransaction', data: isMergingTransaction });
    },
    [],
  );

  const handleAssignEmployee = useCallback(
    async (employeeIdToAssign: number | undefined, transactionId: number) => {
      if (employeeIdToAssign == undefined) {
        dispatch({ type: 'setError', data: 'There is no employee to assign.' });
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
          type: 'setAssigningUser',
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

  const openFileInput = useCallback(
    (idx: number) => {
      FileInput.current && FileInput.current.click();
    },
    [FileInput],
  );

  const handleSetFilterAcceptedRejected = useCallback(
    (option: 'Accepted' | 'Rejected' | 'Accepted / Rejected') => {
      let tempFilter = transactionFilter;
      dispatch({ type: 'setStatus', data: option });
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
      dispatch({ type: 'setFilter', data: tempFilter });
      dispatch({ type: 'setLoadTransactions', data: true });
    },
    [transactionFilter],
  );

  const setTransactionChecked = useCallback(
    (idx: number) => {
      if (!transactions) {
        console.error(
          'No transactions exist but setTransactionChecked is being called. This is a no-op, returning.',
        );
        return;
      }
      transactions[idx] = { ...transactions[idx] };

      // selectedTransactions.includes fails and I'm not sure why, so I'm writing this loop to do the same thing but check Ids
      let contained = false;
      selectedTransactions.forEach(txn => {
        if (txn.getId() === transactions[idx].txn.getId()) {
          contained = true;
        }
      });

      if (!contained) {
        // We want to toggle it
        dispatch({
          type: 'setSelectedTransactions',
          data: [...selectedTransactions, transactions[idx].txn],
        });
        if (onSelect)
          onSelect(transactions[idx].txn, [
            ...selectedTransactions,
            transactions[idx].txn,
          ]);
      } else {
        dispatch({
          type: 'setSelectedTransactions',
          data: selectedTransactions.filter(
            txn => txn.getId() !== transactions[idx].txn.getId(),
          ),
        });
        if (onDeselect)
          onDeselect(
            transactions[idx].txn,
            selectedTransactions.filter(
              txn => txn.getId() !== transactions[idx].txn.getId(),
            ),
          );
      }
    },
    [transactions, selectedTransactions, onDeselect, onSelect],
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
          ...departments.map(dept => ({
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
          ...employees
            .filter(el => {
              if (transactionFilter.departmentId === 0) return true;
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
        label: 'Was processed?',
        type: 'checkbox',
      },
    ],
    [
      {
        content: (
          <StatusPicker
            key={status}
            options={['Accepted / Rejected', 'Accepted', 'Rejected']}
            selected={
              status == 'Accepted / Rejected' ? 0 : status == 'Accepted' ? 1 : 2
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
            onClick: () => refresh(),
          },
        ],
      },
    ],
  ];

  const handleDeleteTransaction = useCallback(async () => {
    try {
      if (state.transactionToDelete === undefined) {
        throw new Error(
          'There is no transaction to delete defined in state, yet handleDeleteTransaction was called.',
        );
      }
      await TransactionClientService.Delete(state.transactionToDelete);
      dispatch({ type: 'setTransactionToDelete', data: undefined });
      await resetTransactions();
      await refresh();
    } catch (err) {
      console.error(`An error occurred while deleting a transaction: ${err}`);
    }
  }, [state.transactionToDelete, refresh, resetTransactions]);

  useEffect(() => {
    if (!loaded) load();
    if (changingPage) {
      load();
      resetTransactions();
    }
  }, [load, loaded, changingPage, resetTransactions]);
  useEffect(() => {
    if (loadTransactions) {
      resetTransactions();
      dispatch({ type: 'setLoadTransactions', data: false });
    }
  }, [loadTransactions, resetTransactions]);
  return (
    <ErrorBoundary>
      {loading ? <Loader /> : <> </>}
      {error && (
        <Alert
          open={error != undefined}
          onClose={() => handleSetError(undefined)}
          title="Error"
        >
          {error}
        </Alert>
      )}
      {state.transactionToDelete && (
        <ConfirmDelete
          open={state.transactionToDelete != undefined}
          onClose={() =>
            dispatch({ type: 'setTransactionToDelete', data: undefined })
          }
          onConfirm={() => handleDeleteTransaction()}
          kind="this transaction"
          name=""
          title="Delete"
        >
          Are you sure you want to delete this transaction?
        </ConfirmDelete>
      )}
      {transactionToEdit && (
        <Modal
          open={true}
          onClose={() => handleSetTransactionToEdit(undefined)}
        >
          <EditTransaction
            transactionInput={transactionToEdit}
            onSave={saved => {
              saved.setId(transactionToEdit.getId());
              handleUpdateTransaction(saved);
            }}
            onClose={() => handleSetTransactionToEdit(undefined)}
          />
        </Modal>
      )}
      {assigningUser ? (
        <Modal
          open={assigningUser.isAssigning}
          onClose={() => handleSetAssigningUser(false, -1)}
        >
          <SectionBar
            title="Assign Employee to Task"
            actions={[
              {
                label: 'Assign',
                onClick: () =>
                  handleAssignEmployee(
                    assignedEmployee,
                    assigningUser.transactionId,
                  ),
              },
            ]}
          />
          <PlainForm
            data={assigned}
            onChange={(type: AssignedEmployeeType) =>
              handleSetAssignedEmployee(type.employeeId)
            }
            schema={SCHEMA_ASSIGN_USER}
            className="PayrollFilter"
          />
        </Modal>
      ) : (
        <></>
      )}
      {mergingTransaction ? (
        <Modal
          open={mergingTransaction}
          onClose={() => handleSetMergingTransaction(false)}
        >
          <CompareTransactions
            loggedUserId={loggedUserId}
            onClose={() => handleSetMergingTransaction(false)}
            onMerge={() => resetTransactions()}
          />
        </Modal>
      ) : (
        <></>
      )}
      {creatingTransaction ? (
        <Modal
          open={creatingTransaction}
          onClose={() => handleSetCreatingTransaction(false)}
        >
          <UploadPhotoTransaction
            loggedUserId={loggedUserId}
            bucket="testbuckethelios"
            onClose={() => handleSetCreatingTransaction(false)}
            costCenters={new TransactionAccountList()}
            fullWidth={false}
            role={role}
            onUpload={() => {
              handleSetCreatingTransaction(false);
              resetTransactions();
              refresh();
            }}
          />
        </Modal>
      ) : (
        <> </>
      )}
      <PlainForm
        data={transactionFilter}
        onChange={handleSetFilter}
        schema={SCHEMA}
        className="PayrollFilter"
      />
      <SectionBar
        title="Transactions"
        key={page.toString() + totalTransactions.toString()}
        fixedActions
        pagination={{
          count: totalTransactions,
          rowsPerPage: 50,
          page: page,
          onPageChange: number => handleChangePage(number),
        }}
        actions={
          hasActions
            ? [
                {
                  label: 'New Transaction',
                  onClick: () => handleSetCreatingTransaction(true), // makes uploadPhotoTransaction appear in a modal
                },
                {
                  label: 'Merge Transactions',
                  onClick: () => handleSetMergingTransaction(true), // makes merge popup come up
                },
              ]
            : []
        }
      />
      <InfoTable
        key={
          transactions?.toString() +
          (creatingTransaction ? creatingTransaction.toString() : '') +
          transactions?.values.toString() +
          selectedTransactions.toString()
        }
        hoverable={false}
        // onSaveRowButton={saved => console.log('SAVED: ', saved)}
        // rowButton={{
        //   columnsToIgnore: ['Actions', 'Accepted / Rejected'],
        //   columnTypeOverrides: [
        //     { columnName: 'Type', columnType: 'text' },
        //     {
        //       columnName: 'Date',
        //       columnType: 'date',
        //     },
        //     {
        //       columnName: 'Department',
        //       columnType: 'department',
        //     },
        //     {
        //       columnName: 'Job #',
        //       columnType: 'number',
        //     },
        //     {
        //       columnName: 'Amount',
        //       columnType: 'number',
        //     },
        //     {
        //       columnName: 'Purchaser',
        //       columnType: 'technician',
        //     },
        //   ],
        // }}
        columns={[
          {
            name: isSelector ? 'Is selected?' : '',
            invisible: true,
          },
          {
            name: 'Type',
            dir:
              sortBy == 'vendor'
                ? sortDir != ' '
                  ? sortDir
                  : undefined
                : undefined,
            onClick: () => handleChangeSort('vendor'),
          },
          {
            name: 'Date',
            dir:
              sortBy == 'timestamp'
                ? sortDir != ' '
                  ? sortDir
                  : undefined
                : undefined,
            onClick: () => handleChangeSort('timestamp'),
          },
          {
            name: 'Order #',
            dir:
              sortBy == 'order_number'
                ? sortDir != ' '
                  ? sortDir
                  : undefined
                : undefined,
            onClick: () => handleChangeSort('order_number'),
          },
          {
            name: 'Purchaser',
            dir:
              sortBy == 'owner_id'
                ? sortDir != ' '
                  ? sortDir
                  : undefined
                : undefined,
            onClick: () => handleChangeSort('owner_id'),
          },
          {
            name: 'Department',
            dir:
              sortBy == 'department_id'
                ? sortDir != ' '
                  ? sortDir
                  : undefined
                : undefined,
            onClick: () => handleChangeSort('department_id'),
          },
          {
            name: 'Job #',
            dir:
              sortBy == 'job_id'
                ? sortDir != ' '
                  ? sortDir
                  : undefined
                : undefined,
            onClick: () => handleChangeSort('job_id'),
          },
          {
            name: 'Amount',
            dir:
              sortBy == 'amount'
                ? sortDir != ' '
                  ? sortDir
                  : undefined
                : undefined,
            onClick: () => handleChangeSort('amount'),
          },
          {
            name: 'Vendor',
            dir:
              sortBy == 'vendor'
                ? sortDir != ' '
                  ? sortDir
                  : undefined
                : undefined,
            onClick: () => handleChangeSort('vendor'),
          },
          { name: 'Actions' },
          {
            name: 'Accepted / Rejected',
          },
        ]}
        data={
          loading
            ? makeFakeRows(10, 15)
            : (transactions?.map((selectorParam, idx) => {
                let txnWithId = selectedTransactions.filter(
                  txn => txn.getId() === selectorParam.txn.getId(),
                );
                try {
                  return [
                    {
                      value: txnWithId.length == 1 ? 'SELECTED' : '',
                      invisible: !isSelector,
                    },
                    {
                      value: selectorParam.txn.getVendorCategory(),
                      onClick: isSelector
                        ? () => setTransactionChecked(idx)
                        : undefined,
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
                      value: selectorParam.txn.getJobId(),
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
                                handleSetTransactionToEdit(selectorParam.txn)
                              }
                            >
                              <LineWeightIcon />
                            </IconButton>
                          </Tooltip>,
                          <Tooltip key="upload" content="Upload File">
                            <IconButton
                              size="small"
                              onClick={event => {
                                if (!event.isTrusted) {
                                  // This is likely a duplicate event called for some reason I couldn't figure out
                                  return;
                                }
                                event.preventDefault();
                                // Working around the input (since it isn't a React-based element, idx is just the last value in the loop)
                                // As a result, I'm simply setting a variable outside of react to work with it at the top. Could fix this
                                // at some point so FIXME but it works
                                transactionOfFileUploading =
                                  transactions[idx].txn;
                                openFileInput(idx);
                              }}
                            >
                              <UploadIcon />
                              <input
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
                              />
                            </IconButton>
                          </Tooltip>,
                          <AltGallery
                            key="Gallery"
                            fileList={[]}
                            title="Transaction Uploads"
                            text="View Photos and Documents"
                            transactionID={transactions[idx].txn.getId()}
                            iconButton
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
                          // <Tooltip key="delete" content="Delete this task">
                          //   <IconButton
                          //     size="small"
                          //     onClick={() =>
                          //       dispatch({
                          //         type: 'setTransactionToDelete',
                          //         data: selectorParam.txn,
                          //       })
                          //     }
                          //   >
                          //     <DeleteIcon />
                          //   </IconButton>
                          // </Tooltip>,
                          <Prompt
                            key="reject"
                            confirmFn={reason =>
                              dispute(reason, selectorParam.txn)
                            }
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
                                content={`Rejected ${transactionActivityLogs
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
        loading={loading}
      />
    </ErrorBoundary>
  );
};
