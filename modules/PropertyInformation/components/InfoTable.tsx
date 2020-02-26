import React, { ReactElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

type Styles = {
  loading?: boolean;
  error?: boolean;
  compact?: boolean;
  hoverable?: boolean;
};

type Href = 'tel' | 'mailto';

export type Data = {
  label?: string;
  value: string;
  href?: Href;
  actions?: ReactElement[];
}[][];

interface Props extends Styles {
  data: Data;
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'relative',
    minHeight: 70,
    marginBottom: theme.spacing(2),
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
            backgroundColor: theme.palette.grey[200],
          }
        : {}),
    },
  }),
  item: {
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
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
}));

export const InfoTable = ({
  data,
  loading = false,
  error = false,
  compact = false,
  hoverable = false,
}: Props) => {
  const classes = useStyles({ loading, error, compact, hoverable });
  return (
    <div className={classes.wrapper}>
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
                    value
                  )}
                  {actions && <span>{actions}</span>}
                </span>
              )}
            </Typography>
          ))}
        </div>
      ))}
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
