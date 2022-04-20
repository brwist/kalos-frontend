import React, { FC, useState, ReactNode, useLayoutEffect } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import BackIcon from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ViewDayIcon from '@material-ui/icons/ViewDay';
import { SkeletonCard } from '../../ComponentsLibrary/SkeletonCard';
import { getDateArgs } from '../../../helpers';
import './CalendarColumn.module.less';

interface Props {
  date: string;
  header?: ReactNode;
  loading?: boolean;
  loadingRows?: number;
}

export const CalendarColumn: FC<Props> = ({
  date,
  header,
  loading,
  loadingRows = 5,
  children,
}) => {
  const [dayView, setDayView] = useState(false);
  useLayoutEffect(() => {
    document.body.style.overflow = dayView ? 'hidden' : 'visible';
  }, [dayView]);
  const dateObj = new Date(...getDateArgs(date));
  return (
    <Box className={clsx(dayView && 'CalendarColumnDayView')}>
      {dayView && (
        <Button startIcon={<BackIcon />} onClick={() => setDayView(false)}>
          {`Back to Week View`}
        </Button>
      )}
      {header}
      <Box className="CalendarColumnDateHeading">
        <>
          <Typography className="CalendarColumnDayCircle">
            {format(dateObj, 'd')}
          </Typography>
          <Typography variant="subtitle2">{format(dateObj, 'cccc')}</Typography>
          <Tooltip title="Day View">
            <IconButton
              className={clsx(
                'CalendarColumnDayViewButton',
                !dayView && 'visible',
              )}
              aria-label="dayview"
              size="small"
              onClick={() => setDayView(true)}
            >
              <ViewDayIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </>
      </Box>
      {loading ? (
        <>
          {[...Array(loadingRows)].map((e, i) => (
            <SkeletonCard key={`${date}-skeleton-${i}`} />
          ))}
        </>
      ) : (
        children
      )}
    </Box>
  );
};
