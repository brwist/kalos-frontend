import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

type Styles = {
  loading?: boolean;
  error?: boolean;
};

type Href = 'tel' | 'mailto';

export type Data = {
  label?: string;
  value: string;
  href?: Href;
}[][];

interface Props extends Styles {
  data: Data;
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'relative',
    minHeight: 70,
  },
  row: {
    opacity: ({ loading }: Styles) => (loading ? 0.5 : 1),
    display: 'flex',
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
    '&:not(:last-of-type)': {
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: theme.palette.grey[400],
    },
  },
  item: {
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
  },
  value: {
    whiteSpace: 'pre-line',
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
    backgroundColor: `${theme.palette.error.light}88`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.common.white,
    padding: theme.spacing(2),
  },
  fake: {
    display: 'inline-block',
    backgroundColor: theme.palette.grey[300],
    height: theme.spacing(),
    width: 100,
    borderRadius: theme.shape.borderRadius,
  },
}));

export const InfoTable = ({ data, loading = false, error = false }: Props) => {
  const classes = useStyles({ loading, error });
  return (
    <div className={classes.wrapper}>
      {data.map((items, idx) => (
        <div key={idx} className={classes.row}>
          {items.map(({ label, value, href }, idx) => (
            <Typography
              key={idx}
              className={classes.item}
              style={{ width: `${100 / items.length}%` }}
            >
              {label && <strong>{label}: </strong>}
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
                </span>
              )}
            </Typography>
          ))}
        </div>
      ))}
      {loading && !error && <CircularProgress className={classes.loader} />}
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
