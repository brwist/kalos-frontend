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
  formatDate,
  uploadFileToS3Bucket,
  InternalDocumentClientService,
  FileClientService,
  S3ClientService,
  DocumentClientService,
  makeSafeFormObject,
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
  DocumentKey,
} from '@kalos-core/kalos-rpc/InternalDocument';
import './styles.less';

const defaultFilter: InternalDocumentsFilter = { tag: -1 };

export const InternalDocuments: FC = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loadedFileTags, setLoadedFileTags] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingFileTags, setLoadingFileTags] = useState<boolean>(false);
  const [entries, setEntries] = useState<InternalDocument[]>([]);
  const [fileTags, setFileTags] = useState<DocumentKey[]>([]);
  const [filter, setFilter] = useState<InternalDocumentsFilter>(defaultFilter);
  const [fileTagsOpened, setFileTagsOpened] = useState<boolean>(false);
  const [editing, setEditing] = useState<InternalDocument>();
  const [deleting, setDeleting] = useState<InternalDocument>();
  const [documentFile, setDocumentFile] = useState<string>('');
  const [formKey, setFormKey] = useState<number>(0);
  const [sort, setSort] = useState<InternalDocumentsSort>({
    orderByField: 'getFilename',
    orderBy: 'name',
    orderDir: 'ASC',
  });
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const load = useCallback(async () => {
    setLoading(true);
    const results = await InternalDocumentClientService.loadInternalDocuments({
      page,
      filter,
      sort,
    });

    setEntries(results.getResultsList());
    setCount(results.getTotalCount());
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
    (entry: InternalDocument) => () => {
      S3ClientService.openFile(entry.getFilename(), INTERNAL_DOCUMENTS_BUCKET);
    },
    [],
  );
  const handleSetEditing = useCallback(
    (editing?: InternalDocument) => () => setEditing(editing),
    [setEditing],
  );
  const handleSetDeleting = useCallback(
    (deleting?: InternalDocument) => () => setDeleting(deleting),
    [setDeleting],
  );
  const handleSave = useCallback(
    async (data: InternalDocument) => {
      setEditing(undefined);
      setLoading(true);
      const temp = makeSafeFormObject(data, new InternalDocument());
      await uploadFileToS3Bucket(
        temp.getFilename(),
        documentFile,
        INTERNAL_DOCUMENTS_BUCKET,
      );
      await InternalDocumentClientService.upsertInternalDocument(temp);
      setLoaded(false);
    },
    [setEditing, setLoading, setLoaded, documentFile],
  );
  const handleDelete = useCallback(async () => {
    if (deleting) {
      const id = deleting.getId();
      const fileId = deleting.getFileId();
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
          ...(sort.orderByField === 'getFilename'
            ? {
                dir: sort.orderDir,
              }
            : {}),
          onClick: handleSortChange({
            orderByField: 'getFilename',
            orderBy: 'name',
            orderDir:
              sort.orderByField === 'getFilename' && sort.orderDir === 'ASC'
                ? 'DESC'
                : 'ASC',
          }),
        },
        {
          name: 'Added',
          ...(sort.orderByField === 'getDateCreated'
            ? {
                dir: sort.orderDir,
              }
            : {}),
          onClick: handleSortChange({
            orderByField: 'getDateCreated',
            orderBy: 'idocument_date_created',
            orderDir:
              sort.orderByField === 'getDateCreated' && sort.orderDir === 'ASC'
                ? 'DESC'
                : 'ASC',
          }),
        },
        {
          name: 'Modified',
          ...(sort.orderByField === 'getDateModified'
            ? {
                dir: sort.orderDir,
              }
            : {}),
          onClick: handleSortChange({
            orderByField: 'getDateModified',
            orderBy: 'idocument_date_modified',
            orderDir:
              sort.orderByField === 'getDateModified' && sort.orderDir === 'ASC'
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
      ...fileTags.map(file => (file.getId(), file.getName(), file.getColor())),
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
  const SCHEMA_EDIT: Schema<InternalDocument> = useMemo(
    () =>
      [
        [
          {
            name: 'getId',
            type: 'hidden',
          },
          {
            name: 'getFileId',
            type: 'hidden',
          },
        ],
        [
          {
            name: 'getFilename',
            label: 'File',
            type: 'file',
            required: true,
            onFileLoad: handleFileLoad,
          },
        ],
        [
          {
            name: 'getDescription',
            label: 'Description',
            helperText: '(Short and Descriptive)',
            required: true,
          },
        ],
        [
          {
            name: 'getTag',
            label: 'File Tag',
            options: getFileTagsOptions(),
            required: true,
          },
        ],
      ] as Schema<InternalDocument>,
    [fileTags],
  );
  const data: Data =
    loading || loadingFileTags
      ? makeFakeRows(3, 5)
      : (entries.map(entry => {
          //const { description, dateCreated, dateModified, tagData } = entry;
          const description = entry.getDescription();
          const dateCreated = entry.getDateCreated();
          const dateModified = entry.getDateModified();
          const tagData = entry.getTagData();
          const backgroundColor = tagData ? tagData.getColor() : '';
          const tagName = tagData ? tagData.getName() : '';
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
            onClick: handleSetEditing(new InternalDocument()),
          },
        ]}
        fixedActions
        pagination={{
          count,
          rowsPerPage: ROWS_PER_PAGE,
          page,
          onPageChange: handleChangePage,
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
            title={`${editing.getId() ? 'Edit' : 'Add'} Kalos Document`}
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
          name={`${deleting
            .getTagData()
            ?.getName()} ${deleting.getDescription()}`}
          onClose={handleSetDeleting(undefined)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};
