import React, { ReactElement, ReactNode, CSSProperties } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Typography from '@material-ui/core/Typography';
import { Actions, ActionsProps } from '../Actions';
import { Link } from '../Link';
import { OrderDir } from '../../../helpers';

type Styles = {
  loading?: boolean;
  error?: boolean;
  compact?: boolean;
  hoverable?: boolean;
};

type Href = 'tel' | 'mailto';

export type Row = {
  label?: string;
  value: ReactNode;
  href?: Href;
  actions?: ReactElement[];
  onClick?: () => void;
  actionsFullWidth?: boolean;
}[];

export type Data = Row[];

export type Columns = {
  name: ReactNode;
  width?: number;
  dir?: OrderDir;
  onClick?: () => void;
  actions?: ActionsProps;
  fixedActions?: boolean;
}[];

interface Props extends Styles {
  columns?: Columns;
  data?: Data;
  styles?: CSSProperties;
  className?: string;
  skipPreLine?: boolean;
}

const useStyles = makeStyles(theme => {
  const commonCell = {
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
    display: 'flex',
    alignItems: 'center',
  };
  return {
    wrapper: {
      position: 'relative',
      marginBottom: theme.spacing(2),
    },
    header: {
      backgroundColor: theme.palette.grey[200],
      paddingTop: theme.spacing(),
      paddingBottom: theme.spacing(),
      [theme.breakpoints.up('sm')]: {
        display: 'flex',
      },
    },
    row: ({ compact, hoverable }: Styles) => ({
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.grey[50],
      },
      '&:not(:last-of-type)': {
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: theme.palette.grey[400],
      },
      [theme.breakpoints.up('sm')]: {
        display: 'flex',
        paddingTop: compact ? 3 : theme.spacing(),
        paddingBottom: compact ? 3 : theme.spacing(),
        '&:hover': {
          ...(hoverable
            ? {
                backgroundColor: `${theme.palette.grey[100]} !important`,
              }
            : {}),
        },
      },
    }),
    column: {
      ...commonCell,
      boxSizing: 'border-box',
      fontWeight: 600,
      justifyContent: 'space-between',
    },
    item: ({ compact }: Styles) => ({
      ...commonCell,
      boxSizing: 'border-box',
      [theme.breakpoints.down('xs')]: {
        marginTop: compact ? 3 : theme.spacing(0.5),
        marginBottom: compact ? 3 : theme.spacing(0.5),
      },
    }),
    noEntries: {
      ...commonCell,
      boxSizing: 'border-box',
      color: theme.palette.grey[600],
    },
    dir: {
      display: 'flex',
      alignItems: 'center',
    },
    label: {
      marginRight: theme.spacing(),
    },
    value: {
      whiteSpace: 'pre-line',
      display: 'inline-flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexGrow: 1,
    },
    valueContent: {
      flexGrow: 1,
      wordBreak: 'break-word',
    },
    loader: {
      position: 'absolute',
      top: 'calc(50% - 20px)',
      left: 'calc(50% - 20px)',
    },
    error: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: `${theme.palette.error.light}44`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      backgroundColor: theme.palette.error.dark,
      color: theme.palette.common.white,
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
    },
    fake: ({ compact }: Styles) => ({
      display: 'inline-block',
      backgroundColor: theme.palette.grey[300],
      height: theme.spacing(),
      width: '100%',
      maxWidth: 100,
      borderRadius: theme.shape.borderRadius,
      marginTop: compact ? 11 : 6,
      marginBottom: compact ? 11 : 6,
    }),
    actions: {
      flexShrink: 0,
    },
  };
});

export const InfoTable = ({
  columns = [],
  data,
  loading = false,
  error = false,
  compact = false,
  hoverable = false,
  skipPreLine = false,
  className = '',
  styles,
}: Props) => {
  const classes = useStyles({ loading, error, compact, hoverable });
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down('xs'));
  return (
    <div className={className + ' ' + classes.wrapper} style={styles}>
      {columns.length > 0 && (
        <div className={classes.header}>
          {columns.map(
            ({ name, dir, onClick, actions, fixedActions, width }, idx) => {
              const ArrowIcon =
                dir === 'DESC' ? ArrowDropDownIcon : ArrowDropUpIcon;
              return (
                <Typography
                  key={idx}
                  className={classes.column}
                  style={{
                    width: md ? '100%' : width || `${100 / columns.length}%`,
                    flexGrow: md || width === -1 ? 1 : 0,
                    flexShrink: width && width! > -1 ? 0 : 1,
                  }}
                  component="div"
                >
                  <span
                    onClick={onClick}
                    className={classes.dir}
                    style={{ cursor: onClick ? 'pointer' : 'default' }}
                  >
                    {name} {dir && <ArrowIcon />}
                  </span>
                  {actions && (
                    <Actions actions={actions} fixed={fixedActions} />
                  )}
                </Typography>
              );
            },
          )}
        </div>
      )}
      {data &&
        data.map((items, idx) => (
          <div key={idx} className={classes.row}>
            {items.map(
              (
                {
                  label,
                  value,
                  href,
                  actions,
                  onClick,
                  actionsFullWidth = false,
                },
                idx2,
              ) => (
                <Typography
                  key={idx2}
                  className={classes.item}
                  component="div"
                  style={{
                    width: md
                      ? '100%'
                      : columns && columns[idx2] && columns[idx2].width
                      ? columns[idx2].width
                      : `${100 / items.length}%`,
                    flexGrow:
                      md ||
                      (columns && columns[idx2] && columns[idx2].width === -1)
                        ? 1
                        : 0,
                    flexShrink:
                      columns &&
                      columns[idx2] &&
                      columns[idx2].width &&
                      columns[idx2].width! > -1
                        ? 0
                        : 1,
                    cursor: onClick ? 'pointer' : 'default',
                  }}
                  onClick={loading || error ? undefined : onClick}
                >
                  {label && (
                    <strong className={classes.label}>{label}: </strong>
                  )}
                  {loading || error ? (
                    <span className={classes.fake} />
                  ) : (
                    <div
                      className={classes.value}
                      style={{
                        whiteSpace: skipPreLine ? 'initial' : 'pre-line',
                      }}
                    >
                      {href ? (
                        <Link href={`${href}:${value}`}>{value}</Link>
                      ) : (
                        <div className={classes.valueContent}>{value}</div>
                      )}
                      {actions && (
                        <span
                          className={classes.actions}
                          onClick={event => event.stopPropagation()}
                          style={
                            actionsFullWidth
                              ? { width: '100%', textAlign: 'right' }
                              : {}
                          }
                        >
                          {actions}
                        </span>
                      )}
                    </div>
                  )}
                </Typography>
              ),
            )}
          </div>
        ))}
      {!loading && !error && data && data.length === 0 && (
        <div className={classes.row}>
          <Typography className={classes.noEntries}>
            No entries found.
          </Typography>
        </div>
      )}
      {error && (
        <div className={classes.error}>
          <Typography className={classes.errorText}>
            Error loading data
          </Typography>
        </div>
      )}
    </div>
  );
};
