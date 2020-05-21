import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SectionBar } from '../SectionBar';
import { InfoTable, Data, Columns } from '../InfoTable';
import { PlainForm, Schema } from '../PlainForm';
import {
  makeFakeRows,
  InternalDocumentType,
  DocumentKeyType,
  InternalDocumentsFilter,
  InternalDocumentsSort,
  loadInternalDocuments,
  loadDocumentKeys,
  formatDate,
} from '../../../helpers';
import { ROWS_PER_PAGE, OPTION_ALL } from '../../../constants';

const useStyles = makeStyles(theme => ({
  filter: {
    marginTop: theme.spacing(),
  },
  name: {
    display: 'flex',
    alignItems: 'center',
  },
  tag: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    display: 'inline-block',
    marginRight: theme.spacing(),
    flexShrink: 0,
    borderRadius: '50%',
  },
}));

const defaultFilter: InternalDocumentsFilter = { tag: -1 };

export const InternalDocuments: FC = ({}) => {
  const classes = useStyles();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loadedFileTags, setLoadedFileTags] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingFileTags, setLoadingFileTags] = useState<boolean>(false);
  const [entries, setEntries] = useState<InternalDocumentType[]>([]);
  const [fileTags, setFileTags] = useState<DocumentKeyType[]>([]);
  const [filter, setFilter] = useState<InternalDocumentsFilter>(defaultFilter);
  const [sort, setSort] = useState<InternalDocumentsSort>({
    orderByField: 'tag',
    orderBy: 'idocument_tag',
    orderDir: 'ASC',
  });
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const load = useCallback(async () => {
    setLoading(true);
    const { resultsList, totalCount } = await loadInternalDocuments({
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
    const fileTags = await loadDocumentKeys();
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
    handleSearch();
  }, [setFilter, handleSearch]);
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
  const COLUMNS: Columns = useMemo(
    () =>
      [
        {
          name: 'Document Description',
          ...(sort.orderByField === 'tag'
            ? {
                dir: sort.orderDir,
              }
            : {}),
          onClick: handleSortChange({
            orderByField: 'tag',
            orderBy: 'idocument_tag',
            orderDir:
              sort.orderByField === 'tag' && sort.orderDir === 'ASC'
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
  const SCHEMA: Schema<InternalDocumentsFilter> = useMemo(
    () =>
      [
        [
          {
            name: 'tag',
            label: 'File Tag',
            options: [
              { label: OPTION_ALL, value: defaultFilter.tag },
              ...fileTags.map(({ id: value, name: label, color }) => ({
                value,
                label,
                color,
              })),
            ],
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
    [fileTags],
  );
  const data: Data =
    loading || loadingFileTags
      ? makeFakeRows(3, 5)
      : entries.map(entry => {
          const { description, dateCreated, dateModified, tagData } = entry;
          const backgroundColor = tagData ? tagData.color : '';
          const tagName = tagData ? tagData.name : '';
          return [
            {
              value: (
                <div className={classes.name}>
                  <span className={classes.tag} style={{ backgroundColor }} />
                  {tagName} {description}
                </div>
              ),
            },
            { value: formatDate(dateCreated) },
            { value: formatDate(dateModified) },
          ];
        });
  return (
    <div>
      <SectionBar
        title="Kalos Documents"
        actions={[{ label: 'Add Document' }]}
        fixedActions
        pagination={{
          count,
          rowsPerPage: ROWS_PER_PAGE,
          page,
          onChangePage: handleChangePage,
        }}
      />
      <PlainForm
        className={classes.filter}
        data={filter}
        schema={SCHEMA}
        compact
        onChange={setFilter}
      />
      <InfoTable
        columns={COLUMNS}
        data={data}
        loading={loading || loadingFileTags}
      />
    </div>
  );
};
