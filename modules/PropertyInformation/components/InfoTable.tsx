import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

type Styles = {
  loading?: boolean;
};
interface Props extends Styles {
  data: {
    label: string;
    value: string;
  }[][];
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'relative',
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
  loader: {
    position: 'absolute',
    top: 'calc(50% - 20px)',
    left: 'calc(50% - 20px)',
  },
}));

const InfoTable = ({ data, loading = false }: Props) => {
  const classes = useStyles({ loading });
  return (
    <div className={classes.wrapper}>
      {data.map((items, idx) => (
        <div key={idx} className={classes.row}>
          {items.map(({ label, value }, idx) => (
            <Typography
              key={idx}
              className={classes.item}
              style={{ width: `${100 / items.length}%` }}
            >
              <strong>{label}:</strong> {value}
            </Typography>
          ))}
        </div>
      ))}
      {loading && <CircularProgress className={classes.loader} />}
    </div>
  );
};

export default InfoTable;
