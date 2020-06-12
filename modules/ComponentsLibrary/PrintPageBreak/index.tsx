import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  wrapper: {
    pageBreakBefore: 'always',
  },
}));

export const PrintPageBreak: FC = () => {
  const classes = useStyles();
  return <div className={classes.wrapper} />;
};
