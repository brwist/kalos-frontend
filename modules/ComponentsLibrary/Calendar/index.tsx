import React, { FC } from 'react';
import clsx from 'clsx';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import './styles.less';

interface Props {
  error?: string;
  className?: string;
}

export const Calendar: FC<Props> = ({ error, className, children }) => (
  <Box className="Calendar">
    {error ? (
      <Alert severity="error">{error}</Alert>
    ) : (
      <Container className={clsx('CalendarWeek', className)} maxWidth={false}>
        {/* @ts-ignore */}
        {children}
      </Container>
    )}
  </Box>
);
