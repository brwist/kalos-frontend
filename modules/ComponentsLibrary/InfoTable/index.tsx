import React, { ReactElement, ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Typography from '@material-ui/core/Typography';

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
}[][];

export type Columns = {
  name: string;
  dir?: Dir;
  onClick?: () => void;
}[];

interface Props extends Styles {
  columns?: Columns;
  data: Data;
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
      minHeight: 70,
      marginBottom: theme.spacing(2),
    },
    header: {
      display: 'flex',
      backgroundColor: theme.palette.grey[200],
      paddingTop: theme.spacing(),
      paddingBottom: theme.spacing(),
    },
    row: ({ compact, hoverable }: Styles) => ({
      display: 'flex',
      paddingTop: compact ? 3 : theme.spacing(),
      paddingBottom: compact ? 3 : theme.spacing(),
      '&:not(:last-of-type)': {
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: theme.palette.grey[400],
      },
      '&:hover': {
        ...(hoverable
          ? {
              backgroundColor: theme.palette.grey[100],
            }
          : {}),
      },
    }),
    column: {
      ...commonCell,
      fontWeight: 600,
    },
    item: commonCell,
    noEntries: {
      ...commonCell,
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
    link: {
      color: theme.palette.action.active,
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
  };
});

export const InfoTable = ({
  columns = [],
  data,
  loading = false,
  error = false,
  compact = false,
  hoverable = false,
}: Props) => {
  const classes = useStyles({ loading, error, compact, hoverable });
  return (
    <div className={classes.wrapper}>
      {columns.length > 0 && (
        <div className={classes.header}>
          {columns.map(({ name, dir, onClick }, idx) => {
            const ArrowIcon =
              dir === 'DESC' ? ArrowDropDownIcon : ArrowDropUpIcon;
            return (
              <Typography
                key={idx}
                className={classes.column}
                style={{ width: `${100 / columns.length}%` }}
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
          {items.map(({ label, value, href, actions }, idx) => (
            <Typography
              key={idx}
              className={classes.item}
              style={{ width: `${100 / items.length}%` }}
            >
              {label && <strong className={classes.label}>{label}: </strong>}
              {loading || error ? (
                <span className={classes.fake} />
              ) : (
                <span className={classes.value}>
                  {href ? (
                    <a className={classes.link} href={`${href}:${value}`}>
                      {value}
                    </a>
                  ) : (
                    <span>{value}</span>
                  )}
                  {actions && <span>{actions}</span>}
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
