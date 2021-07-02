import React, {
  FC,
  useCallback,
  useState,
  useEffect,
  ReactElement,
  ReactNode,
} from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import OpenIcon from '@material-ui/icons/OpenInNew';
import MailIcon from '@material-ui/icons/Mail';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import { Prompt } from '../../Prompt/main';
import { DocumentClient, Document } from '@kalos-core/kalos-rpc/Document';
import { S3Client, URLObject, FileObject } from '@kalos-core/kalos-rpc/S3File';
import { InfoTable, Data } from '../InfoTable';
import { SectionBar } from '../SectionBar';
import { Link } from '../Link';
import { ConfirmDelete } from '../ConfirmDelete';
import { Modal } from '../Modal';
import { ENDPOINT, ROWS_PER_PAGE } from '../../../constants';
import {
  makeFakeRows,
  formatDateTime,
  cfURL,
  cleanOrderByField,
} from '../../../helpers';

const DocumentClientService = new DocumentClient(ENDPOINT);

type DocumentType = Document;

type OrderByDirective =
  | 'document_date_created'
  | 'document_filename'
  | 'document_description';
interface Props {
  title: string;
  userId?: number;
  propertyId?: number;
  taskId?: number;
  contractId?: number;
  fieldMask?: Array<string>;
  actions?: (document: Document) => ReactElement[];
  addUrl?: string;
  className?: string;
  renderAdding?: (
    onClose: () => void,
    onReload: () => Promise<void>,
  ) => ReactNode;
  renderEditing?: (
    onClose: () => void,
    onReload: () => Promise<void>,
    document: Document,
  ) => ReactNode;
  withDateCreated?: boolean;
  withDownloadIcon?: boolean;
  deletable?: boolean;
  stickySectionBar?: boolean;
  displayInAscendingOrder?: boolean;
  orderBy?: OrderByDirective;
  ignoreUserId?: boolean;
}

export const Documents: FC<Props> = ({
  title,
  userId,
  propertyId,
  taskId,
  fieldMask,
  actions = () => [],
  addUrl,
  className,
  renderAdding,
  renderEditing,
  displayInAscendingOrder,
  contractId,
  withDateCreated = false,
  withDownloadIcon = false,
  deletable = true,
  stickySectionBar = true,
  orderBy = 'document_date_created',
  ignoreUserId,
}) => {
  const [entries, setEntries] = useState<DocumentType[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [deleting, setDeleting] = useState<DocumentType>();
  const [adding, setAdding] = useState<boolean>(false);
  const [editing, setEditing] = useState<DocumentType>();
  const load = useCallback(
    async (p = 0) => {
      setLoading(true);
      const entry = new Document();
      entry.setPageNumber(p);
      if (fieldMask) {
        entry.setFieldMaskList(fieldMask);
      }
      if (userId && !ignoreUserId) {
        console.log('setting userID');
        entry.setUserId(userId);
      }
      if (propertyId) {
        entry.setPropertyId(propertyId);
      }
      if (taskId) {
        entry.setTaskId(taskId);
      }
      try {
        entry.setOrderDir(displayInAscendingOrder ? 'asc' : 'desc');
        entry.setOrderBy(cleanOrderByField(orderBy));
        const response = await DocumentClientService.BatchGet(entry);
        setEntries(response.getResultsList());
        setCount(response.getTotalCount());
      } catch (e) {
        console.error(
          `An error was caught while batch-getting documents from DocumentClientService: ${e}`,
        );
        setError(true);
      }
      setLoading(false);
    },
    [
      displayInAscendingOrder,
      fieldMask,
      orderBy,
      propertyId,
      taskId,
      userId,
      ignoreUserId,
    ],
  );

  const handleEditFilename = (entry: Document) => async (filename: string) => {
    const req = new Document();
    req.setId(entry.getId());
    req.setDescription(filename);
    await DocumentClientService.Update(req);
    load();
  };

  const handleDownload = useCallback(
    (
      filename: string,
      type: number,
      docId: number,
      realDownload: boolean = false,
    ) => async (
      event: React.MouseEvent<
        HTMLButtonElement | HTMLAnchorElement,
        MouseEvent
      >,
    ) => {
      event.preventDefault();
      const res = filename.match(/\d{2}-(\d{3,})[A-z]?-/);
      if (filename.toLowerCase().startsWith('maintenance') && res) {
        window.open(
          `https://app.kalosflorida.com/index.cfm?action=admin:properties.showMaintenanceSheet&event_id=${res[1]}&user_id=${userId}&document_id=${docId}&property_id=${propertyId}`,
        );
      } else {
        const S3 = new S3Client(ENDPOINT);
        const url = new URLObject();
        url.setKey(filename);
        url.setBucket(type === 5 ? 'testbuckethelios' : 'kalosdocs-prod');
        const dlURL = await S3.GetDownloadURL(url);
        if (realDownload) {
          window.open(dlURL.getUrl(), '_blank'); // TODO: implement real download, instead of opening in new tab
        } else {
          window.open(dlURL.getUrl(), '_blank');
        }
      }
    },
    [propertyId, userId],
  );

  const handleSetDeleting = useCallback(
    (entry?: DocumentType) => () => setDeleting(entry),
    [setDeleting],
  );

  const handleChangePage = useCallback(
    (p: number) => {
      setPage(p);
      load(p);
    },
    [load],
  );

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [load, loaded, setLoaded]);

  const handleDelete = useCallback(async () => {
    if (deleting) {
      try {
        setLoading(true);
        setDeleting(undefined);
        const S3 = new S3Client(ENDPOINT);
        const file = new FileObject();
        file.setKey(deleting.getFilename());
        file.setBucket(
          deleting.getType() === 5 ? 'testbuckethelios' : 'kalosdocs-prod',
        );
        await S3.Delete(file);
        const entry = new Document();
        entry.setId(deleting.getId());
        await DocumentClientService.Delete(entry);
        load();
      } catch (e) {
        console.error(
          `An error was caught while deleting an S3 bucket entry and deleting a document: ${e}`,
        );
        setError(true);
        setLoading(false);
      }
    }
  }, [deleting, setLoading, setError, setDeleting, load]);
  const handleToggleAdding = useCallback(
    (adding: boolean) => () => setAdding(adding),
    [setAdding],
  );
  const handleToggleEditing = useCallback(
    (editing?: DocumentType) => () => setEditing(editing),
    [setEditing],
  );
  const data: Data = loading
    ? makeFakeRows(withDateCreated ? 2 : 1, 3)
    : entries.map(entry => {
        return [
          ...(withDateCreated
            ? [
                {
                  value: formatDateTime(entry.getDateCreated()),
                },
              ]
            : []),
          {
            value: (
              <Link
                onClick={handleDownload(
                  entry.getFilename(),
                  entry.getType(),
                  entry.getId(),
                )}
              >
                {entry.getDescription()}
              </Link>
            ),
            actions: [
              <IconButton
                key="open"
                style={{ marginLeft: 4 }}
                size="small"
                onClick={handleDownload(
                  entry.getFilename(),
                  entry.getType(),
                  entry.getId(),
                )}
              >
                <OpenIcon />
              </IconButton>,
              ...actions(entry),
              <IconButton
                key="mail"
                style={{ marginLeft: 4 }}
                size="small"
                onClick={() => {
                  const URL = cfURL(
                    !ignoreUserId
                      ? 'contracts.docemail&'
                      : 'properties.docemail&',
                    !ignoreUserId
                      ? [
                          `user_id=${userId}`,
                          `document_id=${entry.getId()}`,
                          `p=1`,
                        ].join('&')
                      : [
                          `user_id=${userId}`,
                          `document_id=${entry.getId()}`,
                          `property_id=${propertyId}`,
                          `p=2`,
                        ].join('&'),
                  );
                  document.location.href = URL;
                }}
              >
                <MailIcon />
              </IconButton>,
              ...(withDownloadIcon
                ? [
                    <IconButton
                      key="download"
                      style={{ marginLeft: 4 }}
                      size="small"
                      onClick={handleDownload(
                        entry.getFilename(),
                        entry.getType(),
                        entry.getId(),
                        true,
                      )}
                    >
                      <DownloadIcon />
                    </IconButton>,
                  ]
                : []),
              ...(renderEditing
                ? [
                    <IconButton
                      key="edit"
                      style={{ marginLeft: 4 }}
                      size="small"
                      onClick={handleToggleEditing(entry)}
                    >
                      <EditIcon />
                    </IconButton>,
                  ]
                : []),
              ...(deletable
                ? [
                    <IconButton
                      key="delete"
                      style={{ marginLeft: 4 }}
                      size="small"
                      onClick={handleSetDeleting(entry)}
                    >
                      <DeleteIcon />
                    </IconButton>,
                  ]
                : []),
              <Prompt
                key="editFilename"
                Icon={EditIcon}
                prompt={'Update Filename'}
                text="Update Filename"
                defaultValue={entry.getFilename()}
                confirmFn={handleEditFilename(entry)}
              />,
            ],
          },
        ];
      });
  return (
    <div className={className}>
      <SectionBar
        title={title}
        actions={
          addUrl || renderAdding
            ? [
                {
                  label: 'Add',
                  ...(addUrl
                    ? { url: addUrl }
                    : { onClick: handleToggleAdding(true) }),
                },
              ]
            : []
        }
        pagination={{
          count,
          page,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: handleChangePage,
        }}
        sticky={stickySectionBar}
      >
        <InfoTable
          data={data}
          loading={loading}
          error={error}
          compact
          hoverable
        />
      </SectionBar>
      {deleting && (
        <ConfirmDelete
          open
          onClose={handleSetDeleting()}
          onConfirm={handleDelete}
          kind="Document"
          name={deleting.getDescription()}
        />
      )}
      {adding && renderAdding && (
        <Modal open onClose={handleToggleAdding(false)}>
          {renderAdding(handleToggleAdding(false), load)}
        </Modal>
      )}
      {editing && renderEditing && (
        <Modal open onClose={handleToggleEditing()}>
          {renderEditing(handleToggleEditing(), load, editing)}
        </Modal>
      )}
    </div>
  );
};
