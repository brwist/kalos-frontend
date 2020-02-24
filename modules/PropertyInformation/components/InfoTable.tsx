import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

interface props {
  data: Array<
    Array<{
      label: string;
      value: string;
    }>
  >;
}

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    '&:not(:last-of-type)': {
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: theme.palette.grey[400],
    },
  },
}));

const InfoTable = ({ data }: props) => {
  const classes = useStyles();
  return (
    <>
      {data.map((items, idx) => (
        <div key={idx} className={classes.row}>
          {items.map(({ label, value }, idx) => (
            <Typography key={idx} style={{ width: `${100 / items.length}%` }}>
              <strong>{label}:</strong> {value}
            </Typography>
          ))}
        </div>
      ))}
    </>
  );
};

export default InfoTable;
