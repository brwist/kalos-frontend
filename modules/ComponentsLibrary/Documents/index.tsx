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
import DownloadIcon from '@material-ui/icons/CloudDownload';
import { DocumentClient, Document } from '@kalos-core/kalos-rpc/Document';
import { S3Client, URLObject, FileObject } from '@kalos-core/kalos-rpc/S3File';
import { InfoTable, Data } from '../InfoTable';
import { SectionBar } from '../SectionBar';
import { Link } from '../Link';
import { ConfirmDelete } from '../ConfirmDelete';
import { Modal } from '../Modal';
import { ENDPOINT, ROWS_PER_PAGE } from '../../../constants';
import { makeFakeRows, formatDateTime } from '../../../helpers';

const DocumentClientService = new DocumentClient(ENDPOINT);

type DocumentType = Document.AsObject;

interface Props {
  title: string;
  userId?: number;
  propertyId?: number;
  taskId?: number;
  actions?: (document: DocumentType) => ReactElement[];
  addUrl?: string;
  className?: string;
  renderAdding?: (
    onClose: () => void,
    onReload: () => Promise<void>,
  ) => ReactNode;
  renderEditing?: (
    onClose: () => void,
    onReload: () => Promise<void>,
    document: DocumentType,
  ) => ReactNode;
  withDateCreated?: boolean;
  withDownloadIcon?: boolean;
  deletable?: boolean;
  stickySectionBar?: boolean;
}

export const Documents: FC<Props> = ({
  title,
  userId,
  propertyId,
  taskId,
  actions = () => [],
  addUrl,
  className,
  renderAdding,
  renderEditing,
  withDateCreated = false,
  withDownloadIcon = false,
  deletable = true,
  stickySectionBar = true,
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
  const load = useCallback(async () => {
    if (!propertyId && !taskId) {
      return;
    }
    setLoading(true);
    const entry = new Document();
    entry.setPageNumber(page);
    if (userId) {
      entry.setUserId(userId);
    }
    if (propertyId) {
      entry.setPropertyId(propertyId);
    }
    if (taskId) {
      entry.setTaskId(taskId);
    }
    try {
      const response = await DocumentClientService.BatchGet(entry);
      const { resultsList, totalCount } = response.toObject();
      setEntries(resultsList);
      setCount(totalCount);
    } catch (e) {
      setError(true);
    }
    setLoading(false);
  }, [
    setLoading,
    setEntries,
    setCount,
    setError,
    userId,
    propertyId,
    taskId,
    page,
  ]);
  const handleDownload = useCallback(
    (filename: string, type: number, realDownload: boolean = false) => async (
      event: React.MouseEvent<
        HTMLButtonElement | HTMLAnchorElement,
        MouseEvent
      >,
    ) => {
      event.preventDefault();
      const S3 = new S3Client(ENDPOINT);
      const url = new URLObject();
      url.setKey(filename);
      url.setBucket(type === 5 ? 'testbuckethelios' : 'kalosdocs-prod');
      const dlURL = await S3.GetDownloadURL(url);
      if (realDownload) {
        window.open(dlURL.url, '_blank'); // TODO: implement real download, instead of opening in new tab
      } else {
        window.open(dlURL.url, '_blank');
      }
    },
    [],
  );
  const handleSetDeleting = useCallback(
    (entry?: DocumentType) => () => setDeleting(entry),
    [setDeleting],
  );
  const handleChangePage = useCallback(
    (page: number) => {
      setPage(page);
      load();
    },
    [setPage, load],
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
        const { filename, type } = deleting;
        setLoading(true);
        setDeleting(undefined);
        const S3 = new S3Client(ENDPOINT);
        const file = new FileObject();
        file.setKey(filename);
        file.setBucket(type === 5 ? 'testbuckethelios' : 'kalosdocs-prod');
        await S3.Delete(file);
        const entry = new Document();
        entry.setId(deleting.id);
        await DocumentClientService.Delete(entry);
        load();
      } catch (e) {
        setError(true);
        setLoading(false);
      }
    }
  }, [deleting, setLoading, setError, setDeleting]);
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
        const { id, filename, type, description: value, dateCreated } = entry;
        return [
          ...(withDateCreated
            ? [
                {
                  value: formatDateTime(dateCreated),
                },
              ]
            : []),
          {
            value: (
              <Link onClick={handleDownload(filename, type)}>{value}</Link>
            ),
            actions: [
              <IconButton
                key="open"
                style={{ marginLeft: 4 }}
                size="small"
                onClick={handleDownload(filename, type)}
              >
                <OpenIcon />
              </IconButton>,
              ...actions(entry),
              ...(withDownloadIcon
                ? [
                    <IconButton
                      key="download"
                      style={{ marginLeft: 4 }}
                      size="small"
                      onClick={handleDownload(filename, type, true)}
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
          name={deleting.description}
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
