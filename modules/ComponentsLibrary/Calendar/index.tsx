import React, { FC } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

interface Props {
  error?: string;
  className?: string;
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    overflow: 'auto',
  },
  week: {
    minWidth: 1500,
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    gridGap: theme.spacing(2),
  },
}));

export const Calendar: FC<Props> = ({ error, className, children }) => {
  const classes = useStyles();
  return (
    <Box className={classes.wrapper}>
      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Container className={className + ' ' + classes.week} maxWidth={false}>
          {children}
        </Container>
      )}
    </Box>
  );
};
