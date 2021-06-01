import { ActivityLog } from '@kalos-core/kalos-rpc/ActivityLog';
import { EmailClient, EmailConfig } from '@kalos-core/kalos-rpc/Email';
import { S3Client } from '@kalos-core/kalos-rpc/S3File';
import {
  Transaction,
  TransactionClient,
} from '@kalos-core/kalos-rpc/Transaction';
import { TransactionAccountList } from '@kalos-core/kalos-rpc/TransactionAccount';
import {
  TransactionActivity,
  TransactionActivityClient,
} from '@kalos-core/kalos-rpc/TransactionActivity';
import { TransactionDocumentClient } from '@kalos-core/kalos-rpc/TransactionDocument';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import IconButton from '@material-ui/core/IconButton';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import CheckIcon from '@material-ui/icons/CheckCircleSharp';
import CloseIcon from '@material-ui/icons/Close';
import UploadIcon from '@material-ui/icons/CloudUploadSharp';
import DoneIcon from '@material-ui/icons/Done';
import NotesIcon from '@material-ui/icons/EditSharp';
import CopyIcon from '@material-ui/icons/FileCopySharp';
import KeyboardIcon from '@material-ui/icons/KeyboardSharp';
import RejectIcon from '@material-ui/icons/ThumbDownSharp';
import SubmitIcon from '@material-ui/icons/ThumbUpSharp';
import { format, parseISO } from 'date-fns';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { ENDPOINT, NULL_TIME, OPTION_ALL } from '../../../constants';
import {
  getSlackID,
  makeFakeRows,
  OrderDir,
  slackNotify,
  TimesheetDepartmentClientService,
  TimesheetDepartmentType,
  timestamp,
  TransactionClientService,
  UserClientService,
  UserType,
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
import { ActivityLogClientService, getRPCFields } from '../../../helpers';
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
  key: any;
}
// Date purchaser dept job # amt description actions assignment
type SortString =
  | 'timestamp'
  | 'owner_id'
  | 'assigned_employee_id'
  | 'department_id'
  | 'job_id'
  | 'amount'
  | 'vendor'
  | 'description';

type SelectorParams = {
  txn: Transaction;
  totalCount: number;
};

let pageNumber = 0;
let sortDir: OrderDir | ' ' | undefined = 'DESC'; // Because I can't figure out why this isn't updating with the state
let sortBy: SortString | undefined = 'timestamp';
let filter = {
  departmentId: 0,
  employeeId: 0,
  week: OPTION_ALL,
  vendor: '',
  isAccepted: false,
};
export const TransactionTable: FC<Props> = ({
  loggedUserId,
  isSelector,
  onSelect,
  onDeselect,
  hasActions,
  key,
}) => {
  const FileInput = React.createRef<HTMLInputElement>();

  const acceptOverride = ![1734, 9646, 8418].includes(loggedUserId);
  const [transactions, setTransactions] = useState<SelectorParams[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [creatingTransaction, setCreatingTransaction] = useState<boolean>(); // for when a transaction is being made, pops up the popup
  const [mergingTransaction, setMergingTransaction] = useState<boolean>(); // When a txn is being merged with another one, effectively allowing full
  // editorial control for Dani
  const [role, setRole] = useState<RoleType>();
  const [assigningUser, setAssigningUser] =
    useState<{ isAssigning: boolean; transactionId: number }>(); // sets open an employee picker in a modal
  const [employees, setEmployees] = useState<UserType[]>([]);
  const [departments, setDepartments] = useState<TimesheetDepartmentType[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<
    Transaction[]
  >([]); // Transactions that are selected in the table if the isSelector prop is set

  const clients = {
    user: new UserClient(ENDPOINT),
    email: new EmailClient(ENDPOINT),
    docs: new TransactionDocumentClient(ENDPOINT),
    s3: new S3Client(ENDPOINT),
  };

  const transactionClient = new TransactionClient(ENDPOINT);

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

  const getGalleryData = (txn: Transaction.AsObject): GalleryData[] => {
    return txn.documentsList.map(d => {
      return {
        key: `${txn.id}-${d.reference}`,
        bucket: 'kalos-transactions',
      };
    });
  };

  const makeRecordTransaction = (id: number) => {
    return async () => {
      const txn = new Transaction();
      txn.setIsRecorded(true);
      txn.setFieldMaskList(['IsRecorded']);
      txn.setId(id);
      await transactionClient.Update(txn);
      await makeLog('Transaction recorded', id);
      await refresh();
    };
  };

  const makeAuditTransaction = async (id: number) => {
    return async () => {
      const txn = new Transaction();
      txn.setIsAudited(true);
      txn.setFieldMaskList(['IsAudited']);
      txn.setId(id);
      await transactionClient.Update(txn);
      await makeLog('Transaction audited', id);
      await refresh();
    };
  };

  const auditTxn = async (txn: Transaction.AsObject) => {
    const ok = confirm(
      'Are you sure you want to mark all the information on this transaction (including all attached photos) as correct? This action is irreversible.',
    );
    if (ok) {
      await makeAuditTransaction(txn.id);
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

  const dispute = async (reason: string, txn: Transaction.AsObject) => {
    const userReq = new User();
    userReq.setId(txn.ownerId);
    const user = await clients.user.Get(userReq);

    // Request for this user
    const sendingReq = new User();
    sendingReq.setId(loggedUserId);
    const sendingUser = await clients.user.Get(sendingReq);

    const body = getRejectTxnBody(
      reason,
      txn.amount,
      txn.description,
      txn.vendor,
    );
    const email: EmailConfig = {
      type: 'receipts',
      recipient: user.email,
      subject: 'Receipts',
      from: sendingUser.email,
      body,
    };

    try {
      //await clients.email.sendMail(email);
    } catch (err) {
      alert('An error occurred, user was not notified via email');
    }
    try {
      //const id = await getSlackID(txn.ownerName);
      // await slackNotify(
      //   id,
      //   `A receipt you submitted has been rejected | ${
      //     txn.description
      //   } | $${prettyMoney(txn.amount)}. Reason: ${reason}`,
      // );
      // await slackNotify(
      //   id,
      //   `https://app.kalosflorida.com?action=admin:reports.transactions`,
      // );
    } catch (err) {
      console.error(err);
      alert('An error occurred, user was not notified via slack');
    }

    await makeUpdateStatus(txn.id, 4, 'rejected', reason);
    await refresh();
  };

  const updateStatus = async (txn: Transaction.AsObject) => {
    const ok = confirm(
      `Are you sure you want to mark this transaction as ${
        acceptOverride ? 'accepted' : 'recorded'
      }?`,
    );
    if (ok) {
      const fn = acceptOverride
        ? async () => makeUpdateStatus(txn.id, 3, 'accepted')
        : async () => makeRecordTransaction(txn.id);
      await fn();
      await refresh();
    }
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
    await transactionClient.Update(txn);
    await makeLog(`${description} ${reason || ''}`, id);
  };

  const forceAccept = async (txn: Transaction.AsObject) => {
    const ok = confirm(
      `Are you sure you want to mark this transaction as accepted?`,
    );
    if (ok) {
      await makeUpdateStatus(txn.id, 3, 'accepted');
      await refresh();
    }
  };

  const addJobNumber = async (id: number, newJobNumber: string) => {
    try {
      let jobNumber;
      if (newJobNumber.includes('-')) {
        jobNumber = parseInt(newJobNumber.split('-')[1]);
      } else {
        jobNumber = parseInt(newJobNumber);
      }
      const txn = new Transaction();
      txn.setId(id);
      txn.setJobId(jobNumber);
      txn.setFieldMaskList(['JobId']);
      await transactionClient.Update(txn);
      await refresh();
    } catch (err) {
      alert('Job number could not be set');
      console.error(err);
    }
  };

  const updateNotes = async (id: number, updatedNotes: string) => {
    const txn = new Transaction();
    txn.setId(id);
    txn.setNotes(updatedNotes);
    txn.setFieldMaskList(['Notes']);
    await transactionClient.Update(txn);
    await refresh();
  };

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
    if (filter.vendor) req.setVendor(`%${filter.vendor}%`);
    if (filter.departmentId != 0) req.setDepartmentId(filter.departmentId);
    let res = await TransactionClientService.BatchGet(req);

    setTransactions(
      res.getResultsList().map(txn => {
        return {
          txn: txn,
          checked: false,
          totalCount: res.getTotalCount(),
        } as SelectorParams;
      }),
    );
  }, [setTransactions]);

  const load = useCallback(async () => {
    setLoading(true);
    const employees = await UserClientService.loadTechnicians();
    let sortedEmployeeList = employees.sort((a, b) =>
      a.lastname > b.lastname ? 1 : -1,
    );
    setEmployees(sortedEmployeeList);

    const departments =
      await TimesheetDepartmentClientService.loadTimeSheetDepartments();
    setDepartments(departments);

    await resetTransactions();
    setLoading(true);

    const user = await UserClientService.loadUserById(loggedUserId);

    const role = user.permissionGroupsList.find(p => p.type === 'role');

    if (role) setRole(role.name as RoleType);

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
  }, [load, resetTransactions]);

  const copyToClipboard = useCallback((text: string): void => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }, []);

  const handleFile = useCallback(
    (txn: Transaction.AsObject) => {
      const fr = new FileReader();
      fr.onload = async () => {
        try {
          const u8 = new Uint8Array(fr.result as ArrayBuffer);
          await clients.docs.upload(
            txn.id,
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
    [FileInput, clients.docs, refresh],
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

  const handleSetFilter = useCallback(
    (d: FilterData) => {
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
      // @ts-ignore
      filter.isAccepted = d.accepted ? d.accepted : undefined;

      refresh();
    },
    [refresh],
  );

  const handleChangePage = useCallback(
    (pageNumberToChangeTo: number) => {
      pageNumber = pageNumberToChangeTo;
      refresh();
    },
    [refresh],
  );

  const handleChangeSort = (newSort: SortString) => {
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
      pageNumber = 0;
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
            label: `${dept.value} | ${dept.description}`,
            value: dept.id,
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
              return el.employeeDepartmentId === filter.departmentId;
            })
            .map(el => ({
              label: `${UserClientService.getCustomerName(el)} (ID: ${el.id})`,
              value: el.id,
            })),
        ],
      },
    ],
    [
      {
        name: 'vendor',
        label: 'Search Vendor',
        type: 'search',
      },
      {
        name: 'accepted',
        label: 'Is Accepted?',
        type: 'checkbox',
      },
    ],
  ];

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    resetTransactions();
    refresh();
  }, [refresh, resetTransactions]);

  return (
    <>
      {loading ? <Loader /> : <> </>}
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
        key={String(pageNumber)}
        fixedActions
        pagination={{
          count:
            transactions && transactions.length > 0
              ? transactions![0].totalCount
              : 0,
          rowsPerPage: 50,
          page: pageNumber,
          onChangePage: handleChangePage,
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
          String(creatingTransaction) +
          transactions?.values.toString() +
          selectedTransactions.toString()
        }
        hoverable={false}
        columns={[
          {
            name: isSelector ? 'Is selected?' : '',
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
            name: 'Assigned Employee',
            dir:
              sortBy == 'assigned_employee_id'
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
                let selectedCol;
                if (isSelector) {
                  selectedCol = {
                    value: txnWithId.length == 1 ? 'SELECTED' : '',
                  };
                } else {
                  selectedCol = {
                    value: '',
                  };
                }
                return [
                  selectedCol,
                  {
                    value: selectorParam.txn.getVendorCategory(),
                    onClick: isSelector
                      ? () => setTransactionChecked(idx)
                      : undefined,
                  },
                  {
                    value:
                      selectorParam.txn.getTimestamp() != NULL_TIME
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
                    value: `${selectorParam.txn.getOwnerName()} (${selectorParam.txn.getOwnerId()})`,
                    onClick: isSelector
                      ? () => setTransactionChecked(idx)
                      : undefined,
                  },
                  {
                    value: `${selectorParam.txn.getAssignedEmployeeName()} (${selectorParam.txn.getAssignedEmployeeId()})`,
                    onClick: isSelector
                      ? () => setTransactionChecked(idx)
                      : undefined,
                  },
                  {
                    value: `${selectorParam.txn.getDepartmentString()} - ${selectorParam.txn.getDepartmentId()}`,
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
                        <Tooltip key="upload" content="Upload File">
                          <IconButton size="small" onClick={openFileInput}>
                            <UploadIcon />
                            <input
                              type="file"
                              ref={FileInput}
                              onChange={() =>
                                handleFile(selectorParam.txn.toObject())
                              }
                              style={{ display: 'none' }}
                            />
                          </IconButton>
                        </Tooltip>,
                        <Prompt
                          key="updateJobNumber"
                          confirmFn={newJobNumber => {
                            try {
                              addJobNumber(
                                selectorParam.txn.getId(),
                                newJobNumber,
                              );
                            } catch (err) {
                              console.error('Failed to add job number: ', err);
                            }
                          }}
                          text="Update Job Number"
                          prompt="New Job Number: "
                          Icon={KeyboardIcon}
                        />,
                        <Prompt
                          key="editNotes"
                          confirmFn={updated =>
                            updateNotes(selectorParam.txn.getId(), updated)
                          }
                          text="Edit Notes"
                          prompt="Update Txn Notes: "
                          Icon={NotesIcon}
                          defaultValue={selectorParam.txn.getNotes()}
                          multiline
                        />,
                        <AltGallery
                          key="receiptPhotos"
                          title="Transaction Photos"
                          fileList={getGalleryData(
                            selectorParam.txn.toObject(),
                          )}
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
                                      ? () =>
                                          forceAccept(
                                            selectorParam.txn.toObject(),
                                          )
                                      : () =>
                                          auditTxn(selectorParam.txn.toObject())
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
                        <Tooltip
                          key="submit"
                          content={
                            acceptOverride
                              ? 'Mark as accepted'
                              : 'Mark as entered'
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              updateStatus(selectorParam.txn.toObject())
                            }
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
                            dispute(reason, selectorParam.txn.toObject())
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
                          <Tooltip key="rejected" content="Rejected">
                            <IconButton size="small">
                              <CloseIcon />
                            </IconButton>
                          </Tooltip>
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
