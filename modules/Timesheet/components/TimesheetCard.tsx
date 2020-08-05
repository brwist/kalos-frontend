import React, { FC } from 'react';
import clsx from 'clsx';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered';
import { TimesheetLine } from '@kalos-core/kalos-rpc/TimesheetLine';
import { format, differenceInMinutes } from 'date-fns';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { colorsMapping } from '../constants';
import { useEditTimesheet } from '../hooks';
import { roundNumber } from '../../../helpers';
import './timesheetCard.less';

type ColorIndicatorProps = {
  status: string;
};

const ColorIndicator = ({ status }: ColorIndicatorProps) => (
  <span
    className="TimesheetTimesheetCardColorIndicator"
    style={{ backgroundColor: colorsMapping[status] }}
  />
);

type TimesheetLineProps = {
  card: TimesheetLine.AsObject;
};

export const TimesheetLineCard: FC<TimesheetLineProps> = ({
  card,
}): JSX.Element => {
  const { editTimesheetCard } = useEditTimesheet();
  const {
    timeStarted,
    timeFinished,
    userApprovalDatetime,
    adminApprovalDatetime,
    briefDescription,
    classCode,
  } = card;
  let status;
  if (adminApprovalDatetime) {
    status = 'Approved';
  } else if (userApprovalDatetime) {
    status = 'User Submitted';
  } else {
    status = 'Pending';
  }

  const payrollDiff = classCode?.billable
    ? differenceInMinutes(new Date(timeFinished), new Date(timeStarted)) / 60
    : 0;

  return (
    <Card
      className="TimesheetTimesheetCardCard"
      onClick={() => {
        editTimesheetCard(card);
      }}
    >
      <CardActionArea>
        <CardHeader
          className="TimesheetTimesheetCardCardHeader"
          avatar={<ColorIndicator status={status} />}
          title={status}
        />
        <CardContent className="TimesheetTimesheetCardCardContent">
          <Typography
            className="TimesheetTimesheetCardDate"
            variant="body2"
            color="textSecondary"
          >
            <span>
              {format(new Date(timeStarted), 'p')}
              {timeFinished && ` - ${format(new Date(timeFinished), 'p')}`}
            </span>
            {payrollDiff > 0 && <strong>{roundNumber(payrollDiff)}</strong>}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {name}
          </Typography>
          <Typography>{classCode?.description}</Typography>
          {briefDescription && (
            <Typography variant="body2" color="textSecondary">
              {briefDescription}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

type ServicesRenderedProps = {
  card: ServicesRendered.AsObject;
};

export const ServicesRenderedCard: FC<ServicesRenderedProps> = ({
  card,
}): JSX.Element => {
  const { editServicesRenderedCard } = useEditTimesheet();
  const { timeStarted, timeFinished, status } = card;
  return (
    <Card
      className={clsx('TimesheetTimesheetCardCard', 'servicesRendered')}
      onClick={() => {
        editServicesRenderedCard(card);
      }}
    >
      <CardActionArea>
        <CardHeader
          className="TimesheetTimesheetCardCardHeader"
          avatar={<ColorIndicator status={status} />}
          title={status}
        />
        <CardContent className="TimesheetTimesheetCardCardContent">
          <Typography
            className="TimesheetTimesheetCardDate"
            variant="body2"
            color="textSecondary"
          >
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
