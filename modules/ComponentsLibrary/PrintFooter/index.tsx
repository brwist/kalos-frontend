import React, { FC, ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';

export interface Props {
  height: number;
  children?: ReactNode;
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    ...theme.typography.body1,
    fontSize: 10,
    pageBreakBefore: 'always',
    overflow: 'hidden',
  },
}));

export const PrintFooter: FC<Props> = ({ height, children }) => {
  const classes = useStyles();
  return (
    <div className={classes.wrapper} style={{ height }}>
      {children}
    </div>
  );
};
