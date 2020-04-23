import React, { FC } from 'react';
import {
  ServicesRendered,
} from '@kalos-core/kalos-rpc/ServicesRendered';
import {
  TimesheetLine
} from '@kalos-core/kalos-rpc/TimesheetLine';
import { format, differenceInMinutes } from 'date-fns';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { colorsMapping } from '../constants';
import { useEditTimesheet } from '../hooks';
import { roundNumber } from '../../../helpers';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      margin: `${theme.spacing(1)}px 0`,
    },
    cardHeader: {
      padding: theme.spacing(1),
      '&.jobNumber': {
        paddingTop: theme.spacing(2.5),
      },
    },
    cardContent: {
      padding: `0 ${theme.spacing(1)}px ${theme.spacing(1)}px`,
    },
    date: {
      fontSize: '0.75rem',
      fontWeight: 100,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    colorIndicator: {
      display: 'block',
      width: theme.spacing(2),
      height: theme.spacing(2),
      borderRadius: theme.spacing(1),
    },
    jobNumber: {
      position: 'absolute',
      top: theme.spacing(0.5),
      right: theme.spacing(1),
    },
  }),
);

type ColorIndicatorProps = {
  status: string;
};

const ColorIndicator = ({ status }: ColorIndicatorProps) => {
  const classes = useStyles();
  let colorToUse;
  return (
    <span
      className={classes.colorIndicator}
      style={{ backgroundColor: colorsMapping[status] }}
    />
  );
};

type TimesheetLineProps = {
  card: TimesheetLine.AsObject,
};

export const TimesheetLineCard: FC<TimesheetLineProps> = ({ card }): JSX.Element => {
  const classes = useStyles();
  const { editTimesheetCard } = useEditTimesheet();
  const { timeStarted, timeFinished, userApprovalDatetime, adminApprovalDatetime, briefDescription, classCode } = card;
  let status;
  if (adminApprovalDatetime) {
    status = 'Approved';
  } else if (userApprovalDatetime) {
    status = 'User Submitted';
  } else {
    status = 'Pending';
  }

  const payrollDiff =  classCode?.billable ? differenceInMinutes(new Date(timeFinished), new Date(timeStarted))/60 : 0;

  return (
    <Card
      className={classes.card}
      onClick={() => {
        editTimesheetCard(card);
      }}
    >
      <CardActionArea>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <ColorIndicator status={status} />
          }
          title={status}
        />
        <CardContent className={classes.cardContent}>
          <Typography className={classes.date} variant="body2" color="textSecondary">
            <span>
              {format(new Date(timeStarted), 'p')}
              {timeFinished && ` - ${format(new Date(timeFinished), 'p')}`}
            </span>
            {payrollDiff > 0 && (
              <strong>
                {roundNumber(payrollDiff)}
              </strong>
            )}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {name}
          </Typography>
          <Typography>
            {classCode?.description}
          </Typography>
          {briefDescription && (
            <Typography variant="body2" color="textSecondary">{briefDescription}</Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

type ServicesRenderedProps = {
  card: ServicesRendered.AsObject,
};

export const ServicesRenderedCard: FC<ServicesRenderedProps> = ({ card }): JSX.Element => {
  const classes = useStyles();
  const { editServicesRenderedCard } = useEditTimesheet();
  const { timeStarted, timeFinished, status } = card;
  return (
    <Card
      className={classes.card}
      onClick={() => {
        editServicesRenderedCard(card);
      }}
    >
      <CardActionArea>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <ColorIndicator status={status} />
          }
          title={status}
        />
        <CardContent className={classes.cardContent}>
          <Typography className={classes.date} variant="body2" color="textSecondary">
            {format(new Date(timeStarted), 'p')}
            {timeFinished && ` - ${format(new Date(timeFinished), 'p')}`}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};