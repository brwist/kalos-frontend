import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';

interface Props {
  align?: 'left' | 'center' | 'right';
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    fontFamily: theme.typography.body1.fontFamily,
    fontSize: 10,
    marginTop: theme.spacing(),
    marginBottom: theme.spacing(),
  },
}));

export const PrintParagraph: FC<Props> = ({ align = 'left', children }) => {
  const classes = useStyles();
  return (
    <p className={classes.wrapper} style={{ textAlign: align }}>
      {children}
    </p>
  );
};
