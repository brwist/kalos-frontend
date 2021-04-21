import {
  Transaction,
  TransactionClient,
  TransactionList,
} from '@kalos-core/kalos-rpc/Transaction';
import { EventClient } from '@kalos-core/kalos-rpc/Event';
import { PropertyClient } from '@kalos-core/kalos-rpc/Property';
import { parseISO } from 'date-fns';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Tooltip } from '../../ComponentsLibrary/Tooltip';
import { makeFakeRows, TransactionClientService } from '../../../helpers';
import { AltGallery } from '../../AltGallery/main';
import { Prompt } from '../../Prompt/main';
import { TxnLog } from '../../transaction/components/log';
import { TxnNotes } from '../../transaction/components/notes';
import { TransactionRow } from '../../transaction/components/row';
import { Data, InfoTable } from '../InfoTable';
import { DepartmentPicker } from '../Pickers';
import { SectionBar } from '../SectionBar';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import CopyIcon from '@material-ui/icons/FileCopySharp';
import SubmitIcon from '@material-ui/icons/ThumbUpSharp';
import RejectIcon from '@material-ui/icons/ThumbDownSharp';
import KeyboardIcon from '@material-ui/icons/KeyboardSharp';
import UploadIcon from '@material-ui/icons/CloudUploadSharp';
import NotesIcon from '@material-ui/icons/EditSharp';
import CheckIcon from '@material-ui/icons/CheckCircleSharp';
import CloseIcon from '@material-ui/icons/Close';
import { EmailClient } from '@kalos-core/kalos-rpc/Email';
import { S3Client } from '@kalos-core/kalos-rpc/S3File';
import { TransactionDocumentClient } from '@kalos-core/kalos-rpc/TransactionDocument';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../../constants';
import { GalleryData } from '../Gallery';

interface Props {
  loggedUserId: number;
}

export const TransactionAccountsPayable: FC<Props> = ({ loggedUserId }) => {
  const FileInput = React.createRef<HTMLInputElement>();

  const acceptOverride = ![1734, 9646, 8418].includes(loggedUserId);
  const [transactions, setTransactions] = useState<TransactionList>();
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [departmentSelected, setDepartmentSelected] = useState<number>(22); // Set to 22 initially so it's not just a "choose department" thing
  const [loading, setLoading] = useState<boolean>(true);
  const clients = {
    user: new UserClient(ENDPOINT),
    email: new EmailClient(ENDPOINT),
    docs: new TransactionDocumentClient(ENDPOINT),
    s3: new S3Client(ENDPOINT),
  };

  const transactionClient = new TransactionClient(ENDPOINT);
  const eventClient = new EventClient(ENDPOINT);
  const propertyClient = new PropertyClient(ENDPOINT);

  const getGalleryData = (txn: Transaction.AsObject): GalleryData[] => {
    return txn.documentsList.map(d => {
      return {
        key: `${txn.id}-${d.reference}`,
        bucket: 'kalos-transactions',
      };
    });
  };

  const addJobNumber = (id: number) => {
    return async (jobString: string) => {
      try {
        let jobNumber;
        if (jobString.includes('-')) {
          jobNumber = parseInt(jobString.split('-')[1]);
        } else {
          jobNumber = parseInt(jobString);
        }
        const txn = new Transaction();
        txn.setId(id);
        txn.setJobId(jobNumber);
        txn.setFieldMaskList(['JobId']);
        await transactionClient.Update(txn);
        await refresh();
      } catch (err) {
        alert('Job number could not be set');
        console.log(err);
      }
    };
  };

  const updateNotes = (id: number) => {
    return async (notes: string) => {
      const txn = new Transaction();
      txn.setId(id);
      txn.setNotes(notes);
      txn.setFieldMaskList(['Notes']);
      await transactionClient.Update(txn);
      await refresh();
    };
  };

  const refresh = async () => {
    let req = new Transaction();
    req.setPageNumber(pageNumber);
    setTransactions(await TransactionClientService.BatchGet(req));
  };

  const copyToClipboard = useCallback((text: string): void => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }, []);

  const handleFile = useCallback((e: any) => {
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
        console.log(err);
      }

      await refresh();
      alert('Upload complete!');
    };
    if (FileInput.current && FileInput.current.files) {
      fr.readAsArrayBuffer(FileInput.current.files[0]);
    }
  }, []);

  const handleChangePage = useCallback(
    (pageNumberToChangeTo: number) => {
      setPageNumber(pageNumberToChangeTo);
    },
    [setPageNumber],
  );

  const handleSetDepartmentSelected = useCallback(
    (departmentId: number) => {
      setDepartmentSelected(departmentId);
    },
    [setDepartmentSelected],
  );

  const openFileInput = () => {
    FileInput.current && FileInput.current.click();
  };

  const load = useCallback(async () => {
    let req = new Transaction();
    req.setPageNumber(pageNumber);
    setTransactions(await TransactionClientService.BatchGet(req));
    setLoading(false);
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  return (
    <>
      <DepartmentPicker
        selected={departmentSelected}
        renderItem={i => (
          <option value={i.id} key={`${i.id}-department-select`}>
            {i.description} - {i.value}
          </option>
        )}
        onSelect={handleSetDepartmentSelected}
      />
      <SectionBar
        title="Transactions"
        pagination={{
          count: transactions ? transactions!.getTotalCount() : 0,
          rowsPerPage: 25,
          page: pageNumber,
          onChangePage: handleChangePage,
        }}
      />
      <InfoTable
        columns={[
          {
            name: 'Date',
            dir: 'DESC',
          },
          { name: 'Purchaser' },
          {
            name: 'Department',
          },
          { name: 'Job #' },
          {
            name: 'Amount',
            dir: 'DESC',
          },
          { name: 'Description' },
          { name: 'Actions' },
        ]}
        data={
          loading
            ? makeFakeRows(8, 5)
            : transactions?.getResultsList().map(txn => [
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
                          onChange={handleFile}
                          style={{ display: 'none' }}
                        />
                      </IconButton>
                    </Tooltip>,
                    <Prompt
                      key="updateJobNumber"
                      confirmFn={id => {
                        try {
                          addJobNumber(Number(id));
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
                      confirmFn={id => updateNotes(Number(id))}
                      text="Edit Notes"
                      prompt="Update Txn Notes: "
                      Icon={NotesIcon}
                      defaultValue={txn.notes}
                      multiline
                    />,
                    <AltGallery
                      key="receiptPhotos"
                      title="Transaction Photos"
                      fileList={getGalleryData(txn)}
                      transactionID={txn.id}
                      text="View photos"
                      iconButton
                    />,
                    <TxnLog key="txnLog" iconButton txnID={txn.id} />,
                    <TxnNotes
                      key="viewNotes"
                      iconButton
                      text="View notes"
                      notes={txn.notes}
                      disabled={txn.notes === ''}
                    />,
                    ...([9928, 9646, 1734].includes(loggedUserId)
                      ? [
                          <Tooltip
                            key="audit"
                            content={
                              txn.isAudited && loggedUserId !== 1734
                                ? 'This transaction has already been audited'
                                : 'Mark as correct'
                            }
                          >
                            <IconButton
                              size="small"
                              onClick={
                                loggedUserId === 1734 ? forceAccept : auditTxn
                              }
                              disabled={txn.isAudited && loggedUserId !== 1734}
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
                      <IconButton size="small" onClick={updateStatus}>
                        <SubmitIcon />
                      </IconButton>
                    </Tooltip>,
                    <Prompt
                      key="reject"
                      confirmFn={dispute}
                      text="Reject transaction"
                      prompt="Enter reason for rejection: "
                      Icon={RejectIcon}
                    />,
                  ],
                },
              ])
        }
        loading={loading}
      />
    </>
  );
};
