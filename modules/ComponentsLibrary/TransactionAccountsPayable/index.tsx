import {
  Transaction,
  TransactionClient,
  TransactionList,
} from '@kalos-core/kalos-rpc/Transaction';
import { parseISO } from 'date-fns';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Tooltip } from '../../ComponentsLibrary/Tooltip';
import {
  getCustomerName,
  getSlackID,
  loadTechnicians,
  loadTimesheetDepartments,
  makeFakeRows,
  OrderDir,
  slackNotify,
  TimesheetDepartmentType,
  timestamp,
  TransactionClientService,
  UserClientService,
  UserType,
} from '../../../helpers';
import { AltGallery } from '../../AltGallery/main';
import { Prompt } from '../../Prompt/main';
import { TxnLog } from '../../transaction/components/log';
import { TxnNotes } from '../../transaction/components/notes';
import { prettyMoney } from '../../transaction/components/row';
import { Data, InfoTable } from '../InfoTable';
import { DepartmentPicker, EmployeePicker } from '../Pickers';
import { SectionBar } from '../SectionBar';
import IconButton from '@material-ui/core/IconButton';
import CopyIcon from '@material-ui/icons/FileCopySharp';
import SubmitIcon from '@material-ui/icons/ThumbUpSharp';
import RejectIcon from '@material-ui/icons/ThumbDownSharp';
import KeyboardIcon from '@material-ui/icons/KeyboardSharp';
import UploadIcon from '@material-ui/icons/CloudUploadSharp';
import NotesIcon from '@material-ui/icons/EditSharp';
import CheckIcon from '@material-ui/icons/CheckCircleSharp';
import { EmailClient, EmailConfig } from '@kalos-core/kalos-rpc/Email';
import { S3Client } from '@kalos-core/kalos-rpc/S3File';
import { TransactionDocumentClient } from '@kalos-core/kalos-rpc/TransactionDocument';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT, OPTION_ALL } from '../../../constants';
import { GalleryData } from '../Gallery';
import {
  TransactionActivityClient,
  TransactionActivity,
} from '@kalos-core/kalos-rpc/TransactionActivity';
import { reject } from 'lodash';
import { UploadPhotoTransaction } from '../UploadPhotoTransaction';
import { TransactionAccountList } from '@kalos-core/kalos-rpc/TransactionAccount';
import { Modal } from '../Modal';
import { FilterData, RoleType } from '../Payroll';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import { PlainForm, Schema } from '../PlainForm';
import { Loader } from '../../Loader/main';

interface Props {
  loggedUserId: number;
}
// Date purchaser dept job # amt description actions assignment
type SortString =
  | 'timestamp'
  | 'owner_id'
  | 'department_id'
  | 'job_id'
  | 'amount'
  | 'description';

let pageNumber = 0;
let sortDir: OrderDir | ' ' | undefined = 'DESC'; // Because I can't figure out why this isn't updating with the state
let sortBy: SortString | undefined = 'timestamp';
let filter = {
  departmentId: 0,
  employeeId: 0,
  week: OPTION_ALL,
};
export const TransactionAccountsPayable: FC<Props> = ({ loggedUserId }) => {
  const FileInput = React.createRef<HTMLInputElement>();

  const acceptOverride = ![1734, 9646, 8418].includes(loggedUserId);
  const [transactions, setTransactions] = useState<TransactionList>();
  const [loading, setLoading] = useState<boolean>(true);
  const [creatingTransaction, setCreatingTransaction] = useState<boolean>(); // for when a transaction is being made, pops up the popup
  const [role, setRole] = useState<RoleType>();
  const [assigningUser, setAssigningUser] = useState<boolean>(); // sets open an employee picker in a modal
  const [employees, setEmployees] = useState<UserType[]>([]);
  const [departments, setDepartments] = useState<TimesheetDepartmentType[]>([]);

  const clients = {
    user: new UserClient(ENDPOINT),
    email: new EmailClient(ENDPOINT),
    docs: new TransactionDocumentClient(ENDPOINT),
    s3: new S3Client(ENDPOINT),
  };

  const transactionClient = new TransactionClient(ENDPOINT);

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
      await clients.email.sendMail(email);
    } catch (err) {
      alert('An error occurred, user was not notified via email');
    }
    try {
      const id = await getSlackID(txn.ownerName);
      await slackNotify(
        id,
        `A receipt you submitted has been rejected | ${
          txn.description
        } | $${prettyMoney(txn.amount)}. Reason: ${reason}`,
      );
      await slackNotify(
        id,
        `https://app.kalosflorida.com?action=admin:reports.transactions`,
      );
    } catch (err) {
      console.error(err);
      alert('An error occurred, user was not notified via slack');
    }

    reject(reason);
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
  ) => {
    return async (reason?: string) => {
      const txn = new Transaction();
      txn.setId(id);
      txn.setStatusId(statusID);
      txn.setFieldMaskList(['StatusId']);
      await transactionClient.Update(txn);
      await makeLog(`${description} ${reason || ''}`, id);
    };
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

  const refresh = async () => {
    setLoading(true);
    await resetTransactions();
    await load();
    setLoading(false);
  };

  const copyToClipboard = useCallback((text: string): void => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }, []);

  const handleFile = useCallback((txn: Transaction.AsObject) => {
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
  }, []);

  const handleSetAssigningUser = useCallback(
    (isAssigningUser: boolean) => {
      setAssigningUser(isAssigningUser);
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
      filter.departmentId = d.departmentId;
      filter.employeeId = d.employeeId;
      // {departmentId: 18, week: undefined, employeeId: undefined}

      refresh();
    },
    [filter],
  );

  const handleChangePage = useCallback(
    (pageNumberToChangeTo: number) => {
      pageNumber = pageNumberToChangeTo;
      refresh();
    },
    [pageNumber],
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

  const openFileInput = () => {
    FileInput.current && FileInput.current.click();
  };

  const resetTransactions = useCallback(async () => {
    let req = new Transaction();
    req.setOrderBy(sortBy ? sortBy : 'timestamp');
    req.setOrderDir(
      sortDir && sortDir != ' ' ? sortDir : sortDir == ' ' ? 'DESC' : 'DESC',
    );
    req.setPageNumber(pageNumber);
    if (filter.departmentId != 0) req.setDepartmentId(filter.departmentId);
    if (filter.employeeId != 0) req.setOwnerId(filter.employeeId);
    setTransactions(await TransactionClientService.BatchGet(req));
  }, [setTransactions]);

  const load = useCallback(async () => {
    const employees = await loadTechnicians();
    let sortedEmployeeList = employees.sort((a, b) =>
      a.lastname > b.lastname ? 1 : -1,
    );
    setEmployees(sortedEmployeeList);

    const departments = await loadTimesheetDepartments();
    setDepartments(departments);

    resetTransactions();

    const user = await UserClientService.loadUserById(loggedUserId);

    const role = user.permissionGroupsList.find(p => p.type === 'role');

    if (role) setRole(role.name as RoleType);

    setLoading(false);
  }, [
    setLoading,
    resetTransactions,
    setDepartments,
    loadTimesheetDepartments,
    setEmployees,
    loadTechnicians,
  ]);

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
            label: dept.value + ' | ' + dept.description,
            value: dept.id,
          })),
        ],
      },
    ],
    [
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
              label: getCustomerName(el) + ' (ID: ' + el.id + ')',
              value: el.id,
            })),
        ],
      },
    ],
  ];

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    resetTransactions();
    refresh();
  }, [filter]);

  return (
    <>
      {loading ? <Loader /> : <> </>}
      {assigningUser ? (
        <Modal
          open={assigningUser}
          onClose={() => handleSetAssigningUser(false)}
        >
          <SectionBar
            title="Assign Employee to Task"
            actions={[
              { label: 'Assign', onClick: () => alert('Clicked assign') },
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
        pagination={{
          count: transactions ? transactions!.getTotalCount() : 0,
          rowsPerPage: 25,
          page: pageNumber,
          onChangePage: handleChangePage,
        }}
        actions={[
          {
            label: 'New Transaction',
            onClick: () => handleSetCreatingTransaction(true), // makes uploadPhotoTransaction appear in a modal
          },
        ]}
      />
      <InfoTable
        key={
          transactions?.getResultsList().toString() +
          String(creatingTransaction)
        }
        columns={[
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
            name: 'Description',
            dir:
              sortBy == 'description'
                ? sortDir != ' '
                  ? sortDir
                  : undefined
                : undefined,
            onClick: () => handleChangeSort('description'),
          },
          { name: 'Actions' },
          {
            name: 'Assignment',
          }, // So Dani can assign employees to task
        ]}
        data={
          loading
            ? makeFakeRows(8, 5)
            : (transactions?.getResultsList().map(txn => [
                {
                  value: txn.getTimestamp(),
                },
                {
                  value: txn.getOwnerName(),
                },
                {
                  value: `${txn.getDepartmentString()} - ${txn.getDepartmentId()}`,
                },
                {
                  value: txn.getJobId(),
                },
                {
                  value: txn.getAmount(),
                },
                {
                  value: txn.getDescription(),
                },
                {
                  actions: [
                    <Tooltip key="copy" content="Copy data to clipboard">
                      <IconButton
                        size="small"
                        onClick={() =>
                          copyToClipboard(
                            `${parseISO(
                              txn.getTimestamp().split(' ').join('T'),
                            ).toLocaleDateString()},${txn.getDescription()},${txn.getAmount()},${txn.getOwnerName()},${txn.getVendor()}`,
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
                          onChange={() => handleFile(txn.toObject())}
                          style={{ display: 'none' }}
                        />
                      </IconButton>
                    </Tooltip>,
                    <Prompt
                      key="updateJobNumber"
                      confirmFn={newJobNumber => {
                        try {
                          addJobNumber(txn.getId(), newJobNumber);
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
                      confirmFn={updated => updateNotes(txn.getId(), updated)}
                      text="Edit Notes"
                      prompt="Update Txn Notes: "
                      Icon={NotesIcon}
                      defaultValue={txn.getNotes()}
                      multiline
                    />,
                    <AltGallery
                      key="receiptPhotos"
                      title="Transaction Photos"
                      fileList={getGalleryData(txn.toObject())}
                      transactionID={txn.getId()}
                      text="View photos"
                      iconButton
                    />,
                    <TxnLog key="txnLog" iconButton txnID={txn.getId()} />,
                    <TxnNotes
                      key="viewNotes"
                      iconButton
                      text="View notes"
                      notes={txn.getNotes()}
                      disabled={txn.getNotes() === ''}
                    />,
                    ...([9928, 9646, 1734].includes(loggedUserId)
                      ? [
                          <Tooltip
                            key="audit"
                            content={
                              txn.getIsAudited() && loggedUserId !== 1734
                                ? 'This transaction has already been audited'
                                : 'Mark as correct'
                            }
                          >
                            <IconButton
                              size="small"
                              onClick={
                                loggedUserId === 1734
                                  ? () => forceAccept(txn.toObject())
                                  : () => auditTxn(txn.toObject())
                              }
                              disabled={
                                txn.getIsAudited() && loggedUserId !== 1734
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
                        acceptOverride ? 'Mark as accepted' : 'Mark as entered'
                      }
                    >
                      <IconButton
                        size="small"
                        onClick={() => updateStatus(txn.toObject())}
                      >
                        <SubmitIcon />
                      </IconButton>
                    </Tooltip>,
                    <Prompt
                      key="reject"
                      confirmFn={reason => dispute(reason, txn.toObject())}
                      text="Reject transaction"
                      prompt="Enter reason for rejection: "
                      Icon={RejectIcon}
                    />,
                  ],
                  actionsFullWidth: true,
                },
                {
                  actions: [
                    <Tooltip
                      key="assign"
                      content="Assign an employee to this task"
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleSetAssigningUser(true)}
                      >
                        <AssignmentIndIcon />
                      </IconButton>
                    </Tooltip>,
                  ],
                },
              ]) as Data)
        }
        loading={loading}
      />
    </>
  );
};
