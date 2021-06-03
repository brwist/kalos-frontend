import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { SectionBar } from '../SectionBar';
import { InfoTable, Data, Columns } from '../InfoTable';
import { PlainForm, Schema } from '../PlainForm';
import { Modal } from '../Modal';
import { FileTags } from '../FileTags';
import { Form } from '../Form';
import { ConfirmDelete } from '../ConfirmDelete';
import {
  makeFakeRows,
  InternalDocumentType,
  DocumentKeyType,
  formatDate,
  uploadFileToS3Bucket,
  InternalDocumentClientService,
  FileClientService,
  S3ClientService,
  DocumentClientService,
} from '../../../helpers';
import {
  ROWS_PER_PAGE,
  OPTION_ALL,
  INTERNAL_DOCUMENTS_BUCKET,
} from '../../../constants';
import {
  InternalDocument,
  InternalDocumentsFilter,
  InternalDocumentsSort,
} from '@kalos-core/kalos-rpc/InternalDocument';
import './styles.less';

const defaultFilter: InternalDocumentsFilter = { tag: -1 };

export const InternalDocuments: FC = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loadedFileTags, setLoadedFileTags] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingFileTags, setLoadingFileTags] = useState<boolean>(false);
  const [entries, setEntries] = useState<InternalDocumentType[]>([]);
  const [fileTags, setFileTags] = useState<DocumentKeyType[]>([]);
  const [filter, setFilter] = useState<InternalDocumentsFilter>(defaultFilter);
  const [fileTagsOpened, setFileTagsOpened] = useState<boolean>(false);
  const [editing, setEditing] = useState<InternalDocumentType>();
  const [deleting, setDeleting] = useState<InternalDocumentType>();
  const [documentFile, setDocumentFile] = useState<string>('');
  const [formKey, setFormKey] = useState<number>(0);
  const [sort, setSort] = useState<InternalDocumentsSort>({
    orderByField: 'filename',
    orderBy: 'name',
    orderDir: 'ASC',
  });
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const load = useCallback(async () => {
    setLoading(true);
    const {
      resultsList,
      totalCount,
    } = await InternalDocumentClientService.loadInternalDocuments({
      page,
      filter,
      sort,
    });
    setEntries(resultsList);
    setCount(totalCount);
    setLoading(false);
  }, [setLoading, setEntries, setCount, page, filter, sort]);
  const loadFileTags = useCallback(async () => {
    setLoadingFileTags(true);
    const fileTags = await InternalDocumentClientService.loadDocumentKeys();
    setFileTags(fileTags);
    setLoadingFileTags(false);
  }, [setLoadingFileTags, setFileTags]);
  useEffect(() => {
    if (!loadedFileTags) {
      setLoadedFileTags(true);
      loadFileTags();
    }
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [
    loaded,
    setLoaded,
    load,
    loadedFileTags,
    setLoadedFileTags,
    loadFileTags,
  ]);
  const handleSearch = useCallback(() => {
    setPage(0);
    setLoaded(false);
  }, [setPage, setLoaded]);
  const handleReset = useCallback(() => {
    setFilter(defaultFilter);
    setFormKey(formKey + 1);
    handleSearch();
  }, [setFilter, handleSearch, formKey, setFormKey]);
  const handleChangePage = useCallback(
    (page: number) => {
      setPage(page);
      setLoaded(false);
    },
    [setPage, setLoaded],
  );
  const handleSortChange = useCallback(
    (sort: InternalDocumentsSort) => () => {
      setSort(sort);
      handleSearch();
    },
    [setSort, handleSearch],
  );
  const handleFileTagsOpenedToggle = useCallback(
    (fileTagsOpened: boolean) => () => setFileTagsOpened(fileTagsOpened),
    [setFileTagsOpened],
  );
  const handleView = useCallback(
    (entry: InternalDocumentType) => () => {
      S3ClientService.openFile(entry.filename, INTERNAL_DOCUMENTS_BUCKET);
    },
    [],
  );
  const handleSetEditing = useCallback(
    (editing?: InternalDocumentType) => () => setEditing(editing),
    [setEditing],
  );
  const handleSetDeleting = useCallback(
    (deleting?: InternalDocumentType) => () => setDeleting(deleting),
    [setDeleting],
  );
  const handleSave = useCallback(
    async (data: InternalDocumentType) => {
      setEditing(undefined);
      setLoading(true);
      await uploadFileToS3Bucket(
        data.filename,
        documentFile,
        INTERNAL_DOCUMENTS_BUCKET,
      );
      await InternalDocumentClientService.upsertInternalDocument(data);
      setLoaded(false);
    },
    [setEditing, setLoading, setLoaded, documentFile],
  );
  const handleDelete = useCallback(async () => {
    if (deleting) {
      const { id, fileId } = deleting;
      setDeleting(undefined);
      setLoading(true);
      await FileClientService.deleteFileById(fileId);
      await InternalDocumentClientService.deleteInternalDocumentById(id);
      setLoaded(false);
    }
  }, [deleting, setDeleting, setLoading, setLoaded]);
  const handleFileLoad = useCallback(
    (documentFile: string) => setDocumentFile(documentFile),
    [setDocumentFile],
  );
  const COLUMNS: Columns = useMemo(
    () =>
      [
        {
          name: 'Document Description',
          ...(sort.orderByField === 'filename'
            ? {
                dir: sort.orderDir,
              }
            : {}),
          onClick: handleSortChange({
            orderByField: 'filename',
            orderBy: 'name',
            orderDir:
              sort.orderByField === 'filename' && sort.orderDir === 'ASC'
                ? 'DESC'
                : 'ASC',
          }),
        },
        {
          name: 'Added',
          ...(sort.orderByField === 'dateCreated'
            ? {
                dir: sort.orderDir,
              }
            : {}),
          onClick: handleSortChange({
            orderByField: 'dateCreated',
            orderBy: 'idocument_date_created',
            orderDir:
              sort.orderByField === 'dateCreated' && sort.orderDir === 'ASC'
                ? 'DESC'
                : 'ASC',
          }),
        },
        {
          name: 'Modified',
          ...(sort.orderByField === 'dateModified'
            ? {
                dir: sort.orderDir,
              }
            : {}),
          onClick: handleSortChange({
            orderByField: 'dateModified',
            orderBy: 'idocument_date_modified',
            orderDir:
              sort.orderByField === 'dateModified' && sort.orderDir === 'ASC'
                ? 'DESC'
                : 'ASC',
          }),
        },
      ] as Columns,
    [sort],
  );
  const getFileTagsOptions = useCallback(
    (options = []) => [
      ...options,
      ...fileTags.map(({ id: value, name: label, color }) => ({
        value,
        label,
        color,
      })),
    ],
    [fileTags],
  );
  const SCHEMA_FILTER: Schema<InternalDocumentsFilter> = useMemo(
    () =>
      [
        [
          {
            name: 'tag',
            label: 'File Tag',
            options: getFileTagsOptions([
              { label: OPTION_ALL, value: defaultFilter.tag },
            ]),
            actions: [
              {
                label: 'View File Tags',
                onClick: handleFileTagsOpenedToggle(true),
                variant: 'text',
              },
            ],
            actionsInLabel: true,
          },
          {
            name: 'description',
            label: 'Description',
            type: 'search',
            actions: [
              {
                label: 'Reset',
                variant: 'outlined',
                onClick: handleReset,
              },
              {
                label: 'Search',
                onClick: handleSearch,
              },
            ],
          },
        ],
      ] as Schema<InternalDocumentsFilter>,
    [fileTags, formKey],
  );
  const SCHEMA_EDIT: Schema<InternalDocumentType> = useMemo(
    () =>
      [
        [
          {
            name: 'id',
            type: 'hidden',
          },
          {
            name: 'fileId',
            type: 'hidden',
          },
        ],
        [
          {
            name: 'filename',
            label: 'File',
            type: 'file',
            required: true,
            onFileLoad: handleFileLoad,
          },
        ],
        [
          {
            name: 'description',
            label: 'Description',
            helperText: '(Short and Descriptive)',
            required: true,
          },
        ],
        [
          {
            name: 'tag',
            label: 'File Tag',
            options: getFileTagsOptions(),
            required: true,
          },
        ],
      ] as Schema<InternalDocumentType>,
    [fileTags],
  );
  const data: Data =
    loading || loadingFileTags
      ? makeFakeRows(3, 5)
      : (entries.map(entry => {
          const { description, dateCreated, dateModified, tagData } = entry;
          const backgroundColor = tagData ? tagData.color : '';
          const tagName = tagData ? tagData.name : '';
          return [
            {
              value: (
                <div className="InternalDocumentsName">
                  <span
                    className="InternalDocumentsTag"
                    style={{ backgroundColor }}
                  />
                  {tagName} {description}
                </div>
              ),
              onClick: handleView(entry),
            },
            {
              value: formatDate(dateCreated),
              onClick: handleView(entry),
            },
            {
              value: formatDate(dateModified),
              onClick: handleView(entry),
              actions: [
                <IconButton key="view" size="small" onClick={handleView(entry)}>
                  <OpenInNewIcon />
                </IconButton>,
                <IconButton
                  key="edit"
                  size="small"
                  onClick={handleSetEditing(entry)}
                >
                  <EditIcon />
                </IconButton>,
                <IconButton
                  key="remove"
                  size="small"
                  onClick={handleSetDeleting(entry)}
                >
                  <DeleteIcon />
                </IconButton>,
              ],
            },
          ];
        }) as Data);
  return (
    <div>
      <SectionBar
        title="Kalos Documents"
        actions={[
          {
            label: 'Add Document',
            onClick: handleSetEditing(new InternalDocument().toObject()),
          },
        ]}
        fixedActions
        pagination={{
          count,
          rowsPerPage: ROWS_PER_PAGE,
          page,
          onChangePage: handleChangePage,
        }}
      />
      <PlainForm
        key={formKey}
        className="InternalDocumentsFilter"
        data={filter}
        schema={SCHEMA_FILTER}
        compact
        onChange={setFilter}
      />
      <InfoTable
        columns={COLUMNS}
        data={data}
        loading={loading || loadingFileTags}
      />
      {fileTagsOpened && (
        <Modal open onClose={handleFileTagsOpenedToggle(false)} fullScreen>
          <FileTags
            onClose={handleFileTagsOpenedToggle(false)}
            fileTags={fileTags}
            onFileTagsChange={setFileTags}
          />
        </Modal>
      )}
      {editing && (
        <Modal open onClose={handleSetEditing(undefined)}>
          <Form
            title={`${editing.id ? 'Edit' : 'Add'} Kalos Document`}
            schema={SCHEMA_EDIT}
            data={editing}
            onClose={handleSetEditing(undefined)}
            onSave={handleSave}
          />
        </Modal>
      )}
      {deleting && (
        <ConfirmDelete
          open
          kind="Internal Document"
          name={`${deleting.tagData?.name} ${deleting.description}`}
          onClose={handleSetDeleting(undefined)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};
