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
import { format, parseISO } from 'date-fns';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { ENDPOINT, NULL_TIME, OPTION_ALL } from '../../../constants';
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
import { Modal } from '../Modal';
import { FilterData, RoleType } from '../Payroll';
import { PlainForm, Schema } from '../PlainForm';
import { SectionBar } from '../SectionBar';
import { UploadPhotoTransaction } from '../UploadPhotoTransaction';
import LineWeightIcon from '@material-ui/icons/LineWeight';
import { EditTransaction } from '../EditTransaction';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { StatusPicker } from './components/StatusPicker';
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

interface FilterType {
  departmentId: number;
  employeeId: number;
  week: string;
  vendor: string;
  isAccepted: boolean | undefined;
  isRejected: boolean | undefined;
  amount: number | undefined;
  billingRecorded: boolean;
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
};
export const TransactionTable: FC<Props> = ({
  loggedUserId,
  isSelector,
  onSelect,
  onDeselect,
  hasActions,
}) => {
  const FileInput = React.createRef<HTMLInputElement>();

  const [transactions, setTransactions] = useState<SelectorParams[]>();
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [transactionActivityLogs, setTransactionActivityLogs] = useState<
    TransactionActivity[]
  >([]);
  const [transactionToEdit, setTransactionToEdit] = useState<
    Transaction | undefined
  >();
  const [loading, setLoading] = useState<boolean>(true);
  const [creatingTransaction, setCreatingTransaction] = useState<boolean>(); // for when a transaction is being made, pops up the popup
  const [mergingTransaction, setMergingTransaction] = useState<boolean>(); // When a txn is being merged with another one, effectively allowing full
  // editorial control for Dani
  const [role, setRole] = useState<RoleType>();
  const [assigningUser, setAssigningUser] = useState<{
    isAssigning: boolean;
    transactionId: number;
  }>(); // sets open an employee picker in a modal
  const [employees, setEmployees] = useState<User[]>([]);
  const [departments, setDepartments] = useState<TimesheetDepartment[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<
    Transaction[]
  >([]); // Transactions that are selected in the table if the isSelector prop is set
  const [pageNumber, setPageNumber] = useState<number>(0);

  const [status, setStatus] = useState<
    'Accepted' | 'Rejected' | 'Accepted / Rejected'
  >('Accepted / Rejected');

  const handleSetTransactionToEdit = useCallback(
    (transaction: Transaction | undefined) => {
      setTransactionToEdit(transaction);
    },
    [setTransactionToEdit],
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

  const getGalleryData = (txn: Transaction): GalleryData[] => {
    return txn.getDocumentsList().map(d => {
      return {
        key: `${txn.getId()}-${d.getReference()}`,
        bucket: 'kalos-transactions',
      };
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

  const handleChangePage = useCallback(
    (pageNumberToChangeTo: number) => {
      setPageNumber(pageNumberToChangeTo);
    },
    [setPageNumber],
  );

  const resetTransactions = useCallback(async () => {
    let req = new Transaction();
    req.setOrderBy(sortBy ? sortBy : 'timestamp');
    req.setOrderDir(
      sortDir && sortDir != ' ' ? sortDir : sortDir == ' ' ? 'DESC' : 'DESC',
    );
    req.setPageNumber(pageNumber);

    req.setIsActive(1);
    req.setVendorCategory("'PickTicket','Receipt'");
    if (filter.isAccepted) {
      req.setStatusId(3);
    }
    if (filter.isRejected) {
      req.setStatusId(4);
    }
    if (filter.vendor) req.setVendor(`%${filter.vendor}%`);
    if (filter.departmentId != 0) req.setDepartmentId(filter.departmentId);
    if (filter.employeeId != 0) req.setAssignedEmployeeId(filter.employeeId);
    if (filter.amount) req.setAmount(filter.amount);
    req.setIsBillingRecorded(filter.billingRecorded);
    req.setFieldMaskList(['IsBillingRecorded']);
    let res: TransactionList | null = null;
    try {
      res = await TransactionClientService.BatchGet(req);
      if (res.getTotalCount() < totalTransactions) {
        setTotalTransactions(res.getTotalCount());
        handleChangePage(0);
      }
    } catch (err) {
      console.error(
        `An error occurred while batch-getting transactions in TransactionTable: ${err}`,
      );
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

    setTransactionActivityLogs(logList);
    setTotalTransactions(res.getTotalCount());
    setTransactions(
      res.getResultsList().map(txn => {
        return {
          txn: txn,
          checked: false,
          totalCount: res!.getTotalCount(),
        } as SelectorParams;
      }),
    );
  }, [pageNumber, totalTransactions, handleChangePage]);

  const load = useCallback(async () => {
    setLoading(true);
    const employees = await UserClientService.loadTechnicians();
    let sortedEmployeeList = employees.sort((a, b) =>
      a.getLastname() > b.getLastname() ? 1 : -1,
    );
    setEmployees(sortedEmployeeList);

    let departments;
    try {
      departments =
        await TimesheetDepartmentClientService.loadTimeSheetDepartments();
      setDepartments(departments);
    } catch (err) {
      console.error(
        `An error occurred while getting the timesheet departments: ${err}`,
      );
    }

    await resetTransactions();
    setLoading(true);

    const user = await UserClientService.loadUserById(loggedUserId);

    const role = user
      .getPermissionGroupsList()
      .find(p => p.getType() === 'role');

    if (role) setRole(role.getName() as RoleType);

    setLoading(false);
  }, [
    setLoading,
    resetTransactions,
    setDepartments,
    setEmployees,
    loggedUserId,
  ]);

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

  const handleFile = useCallback(
    (txn: Transaction) => {
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
    },
    [FileInput, refresh],
  );

  const handleSetAssigningUser = useCallback(
    (isAssigningUser: boolean, transactionId: number) => {
      setAssigningUser({
        isAssigning: isAssigningUser,
        transactionId: transactionId,
      });
    },
    [setAssigningUser],
  );

  const handleSetFilter = useCallback((d: FilterData) => {
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
  }, []);

  const handleUpdateTransaction = useCallback(
    async (transactionToSave: Transaction) => {
      try {
        await TransactionClientService.Update(transactionToSave);
        setTransactionToEdit(undefined);
        refresh();
      } catch (err) {
        console.error('An error occurred while updating a transaction: ', err);
        setTransactionToEdit(undefined);
      }
    },
    [setTransactionToEdit, refresh],
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
      setPageNumber(0);
    }

    sortBy = newSort;
    sortDir = newSortDir;

    refresh();
  };

  const handleSetCreatingTransaction = useCallback(
    (isCreatingTransaction: boolean) => {
      setCreatingTransaction(isCreatingTransaction);
    },
    [setCreatingTransaction],
  );

  const handleSetMergingTransaction = useCallback(
    (isMergingTransaction: boolean) => {
      setMergingTransaction(isMergingTransaction);
    },
    [setMergingTransaction],
  );

  const handleAssignEmployee = useCallback(
    async (employeeIdToAssign: number, transactionId: number) => {
      try {
        let req = new Transaction();
        req.setId(transactionId);
        req.setAssignedEmployeeId(employeeIdToAssign);
        req.setFieldMaskList(['AssignedEmployeeId']);
        let result = await TransactionClientService.Update(req);
        if (!result) {
          console.error('Unable to assign employee.');
        }
        setAssigningUser({ isAssigning: false, transactionId: -1 });
      } catch (err) {
        console.error('An error occurred while assigning an employee: ', err);
      }
    },
    [setAssigningUser],
  );

  const openFileInput = () => {
    FileInput.current && FileInput.current.click();
  };

  const handleSetFilterAcceptedRejected = useCallback(
    (option: 'Accepted' | 'Rejected' | 'Accepted / Rejected') => {
      setStatus(option);
      switch (option) {
        case 'Accepted':
          filter.isAccepted = true;
          break;
        case 'Rejected':
          filter.isRejected = true;
          break;
        case 'Accepted / Rejected':
          filter.isAccepted = undefined;
          filter.isRejected = undefined;

          break;
        default:
          console.error(
            'Unhandled string passed to handleSetFilterAcceptedRejected. ',
          );
          break;
      }
    },
    [setStatus],
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
        setSelectedTransactions([
          ...selectedTransactions,
          transactions[idx].txn,
        ]);
        if (onSelect)
          onSelect(transactions[idx].txn, [
            ...selectedTransactions,
            transactions[idx].txn,
          ]);
      } else {
        setSelectedTransactions(
          selectedTransactions.filter(
            txn => txn.getId() !== transactions[idx].txn.getId(),
          ),
        );
        if (onDeselect)
          onDeselect(
            transactions[idx].txn,
            selectedTransactions.filter(
              txn => txn.getId() !== transactions[idx].txn.getId(),
            ),
          );
      }
    },
    [
      transactions,
      setSelectedTransactions,
      selectedTransactions,
      onDeselect,
      onSelect,
    ],
  );

  const SCHEMA: Schema<FilterData> = [
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
              if (filter.departmentId === 0) return true;
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
        label: 'Is already marked accepted or rejected?',
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

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      {loading ? <Loader /> : <> </>}
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
                    filter.employeeId,
                    assigningUser.transactionId,
                  ),
              },
            ]}
          />
          <PlainForm
            data={filter}
            onChange={handleSetFilter}
            schema={SCHEMA}
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
              refresh();
            }}
          />
        </Modal>
      ) : (
        <> </>
      )}
      <PlainForm
        data={filter}
        onChange={handleSetFilter}
        schema={SCHEMA}
        className="PayrollFilter"
      />
      <SectionBar
        title="Transactions"
        key={pageNumber.toString() + totalTransactions.toString()}
        fixedActions
        pagination={{
          count: totalTransactions,
          rowsPerPage: 50,
          page: pageNumber,
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
                      selectorParam.txn.getTimestamp() != '0000-00-00 00:00:00'
                        ? format(
                            new Date(selectorParam.txn.getTimestamp()),
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
                        <Tooltip key="editAll" content="Edit this transaction">
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
                          <IconButton size="small" onClick={openFileInput}>
                            <UploadIcon />
                            <input
                              type="file"
                              ref={FileInput}
                              onChange={() => handleFile(selectorParam.txn)}
                              style={{ display: 'none' }}
                            />
                          </IconButton>
                        </Tooltip>,
                        <AltGallery
                          key="receiptPhotos"
                          title="Transaction Photos"
                          fileList={getGalleryData(selectorParam.txn)}
                          transactionID={selectorParam.txn.getId()}
                          text="View photos"
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
              }) as Data)
        }
        loading={loading}
      />
    </>
  );
};
