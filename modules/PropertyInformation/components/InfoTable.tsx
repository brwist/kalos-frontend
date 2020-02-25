import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

interface Props {
  data: {
    label: string;
    value: string;
  }[][];
}

const useStyles = makeStyles(theme => ({
  row: {
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
}));

const InfoTable = ({ data }: Props) => {
  const classes = useStyles({ a: 1 });
  return (
    <div>
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
    </div>
  );
};

export default InfoTable;
