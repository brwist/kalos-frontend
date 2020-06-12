import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';

interface Props {
  height: number;
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    pageBreakAfter: 'always',
  },
}));

export const PrintPageBreak: FC<Props> = ({ height }) => {
  const classes = useStyles();
  return <div className={classes.wrapper} style={{ height }} />;
};
