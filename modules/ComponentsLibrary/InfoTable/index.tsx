import React, { ReactElement, ReactNode, CSSProperties } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Typography from '@material-ui/core/Typography';
import { Link } from '../Link';

type Styles = {
  loading?: boolean;
  error?: boolean;
  compact?: boolean;
  hoverable?: boolean;
};

type Href = 'tel' | 'mailto';

export type Dir = 'DESC' | 'ASC';

export type Data = {
  label?: string;
  value: ReactNode;
  href?: Href;
  actions?: ReactElement[];
  onClick?: () => void;
}[][];

export type Columns = {
  name: string;
  dir?: Dir;
  onClick?: () => void;
}[];

interface Props extends Styles {
  columns?: Columns;
  data: Data;
  styles?: CSSProperties;
  className?: string;
}

const useStyles = makeStyles(theme => {
  const commonCell = {
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
    display: 'flex',
    alignItems: 'flex-start',
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
      width: 100,
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
  className = '',
  styles,
}: Props) => {
  const classes = useStyles({ loading, error, compact, hoverable });
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <div className={className + ' ' + classes.wrapper} style={styles}>
      {columns.length > 0 && (
        <div className={classes.header}>
          {columns.map(({ name, dir, onClick }, idx) => {
            const ArrowIcon =
              dir === 'DESC' ? ArrowDropDownIcon : ArrowDropUpIcon;
            return (
              <Typography
                key={idx}
                className={classes.column}
                style={{ width: `${100 / (md ? 1 : columns.length)}%` }}
              >
                <span
                  onClick={onClick}
                  className={classes.dir}
                  style={{ cursor: onClick ? 'pointer' : 'default' }}
                >
                  {name} {dir && <ArrowIcon />}
                </span>
              </Typography>
            );
          })}
        </div>
      )}
      {data.map((items, idx) => (
        <div key={idx} className={classes.row}>
          {items.map(({ label, value, href, actions, onClick }, idx2) => (
            <Typography
              key={idx2}
              className={classes.item}
              component="div"
              style={{
                width: `${100 / (md ? 1 : items.length)}%`,
                cursor: onClick ? 'pointer' : 'default',
              }}
              onClick={loading || error ? undefined : onClick}
            >
              {label && <strong className={classes.label}>{label}: </strong>}
              {loading || error ? (
                <span className={classes.fake} />
              ) : (
                <span className={classes.value}>
                  {href ? (
                    <Link href={`${href}:${value}`}>{value}</Link>
                  ) : (
                    <span>{value}</span>
                  )}
                  {actions && (
                    <span
                      className={classes.actions}
                      onClick={event => event.stopPropagation()}
                    >
                      {actions}
                    </span>
                  )}
                </span>
              )}
            </Typography>
          ))}
        </div>
      ))}
      {!loading && !error && data.length === 0 && (
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
