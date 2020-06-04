import React, { FC, ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';

export interface Props {
  children?: ReactNode;
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    marginTop: theme.spacing(),
    ...theme.typography.body1,
    fontSize: 10,
  },
}));

export const PrintFooter: FC = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.wrapper}>{children}</div>;
};
