import React, { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered';
import { TimesheetLine } from '@kalos-core/kalos-rpc/TimesheetLine';
import { format, differenceInMinutes, parseISO } from 'date-fns';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { colorsMapping } from '../constants';
import { useEditTimesheet } from '../hooks';
import {
  roundNumber,
  getCFAppUrl,
  EventClientService,
  TimesheetLineClientService,
} from '../../../../helpers';
import './timesheetCard.less';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { NULL_TIME_VALUE } from '../constants';

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
  card: TimesheetLine;
};
const getURL = async (referenceNumber: string) => {
  let referenceURL = 'URL';
  if (referenceNumber) {
    try {
      console.log('we got called');
      parseInt(referenceNumber);
      const number = parseInt(referenceNumber);
      referenceURL = await TimesheetLineClientService.getReferenceURL(number);
      console.log(referenceURL);
    } catch (error) {
      console.log('Not a number');
    }
  }
  return referenceURL;
};
export const TimesheetLineCard: FC<TimesheetLineProps> = ({
  card,
}): JSX.Element => {
  const { editTimesheetCard } = useEditTimesheet();
  const adminApprovalDatetime = card.getAdminApprovalDatetime();
  const payrollProcessed = card.getPayrollProcessed();
  const userApprovalDatetime = card.getUserApprovalDatetime();
  const timeStarted = card.getTimeStarted();
  const timeFinished = card.getTimeFinished();
  const classCode = card.getClassCode();
  const eventId = card.getEventId();
  const briefDescription = card.getBriefDescription();
  const referenceNumber = card.getReferenceNumber();
  const notes = card.getNotes();
  const [loading, setLoading] = useState<boolean>(true);
  const [URL, setURL] = useState<string>('URL');

  const adminApprovalUserName = card.getAdminApprovalUserName();
  let status;
  useEffect(() => {
    async function getLink() {
      const token = await getURL(referenceNumber);
      setURL(token);
    }
    if (loading) {
      setLoading(false);
      getLink();
    }
  }, [loading, referenceNumber]);
  if (payrollProcessed) {
    status = 'Processed';
  } else if (
    adminApprovalDatetime &&
    adminApprovalDatetime != NULL_TIME_VALUE &&
    !payrollProcessed
  ) {
    status = 'Approved';
  } else if (
    userApprovalDatetime &&
    userApprovalDatetime != NULL_TIME_VALUE &&
    !payrollProcessed
  ) {
    status = 'Submitted';
  } else {
    status = 'Pending';
  }
  const payrollDiff = classCode?.getBillable()
    ? differenceInMinutes(parseISO(timeFinished), parseISO(timeStarted)) / 60
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
          <Typography className="TimesheetTimesheetCardDate" variant="body2">
            <span>
              {format(parseISO(timeStarted), 'p')}
              {timeFinished && ` - ${format(parseISO(timeFinished), 'p')}`}
            </span>
            {
              <strong>
                {roundNumber(
                  differenceInMinutes(
                    parseISO(timeFinished),
                    parseISO(timeStarted),
                  ) / 60,
                )}
              </strong>
            }
          </Typography>
          {!!eventId && (
            <Typography
              variant="body2"
              className="TimesheetTimesheetCardEventId"
              onClick={event => {
                event.stopPropagation();
                event.preventDefault();
                window.open(
                  [
                    getCFAppUrl('admin:service.editServicecall'),
                    `id=${eventId}`,
                    `user_id=${card.getEventUserId()}`,
                    `property_id=${card.getEventPropertyId()}`,
                  ].join('&'),
                  '_blank',
                );
              }}
            >
              {eventId}
            </Typography>
          )}
          <Typography>
            {classCode?.getClasscodeId() + '-' + classCode?.getDescription()}
          </Typography>
          {briefDescription && (
            <Typography variant="body2">
              Brief desc: {briefDescription}
            </Typography>
          )}
          {referenceNumber && referenceNumber != eventId.toString() && (
            <Typography
              variant="body2"
              onClick={async event => {
                if (URL != 'URL' && URL != '') {
                  event.stopPropagation();
                  event.preventDefault();
                  window.open(URL);
                }
              }}
            >
              Ref #: {referenceNumber}
            </Typography>
          )}
          {notes && notes != 'AUTOGENERATED TIMECARD' && (
            <Typography variant="body2">Notes: {notes}</Typography>
          )}
          {!!eventId && (
            <Typography variant="body2">Service Call ID: {eventId}</Typography>
          )}
          {adminApprovalUserName && (
            <Typography variant="body1">
              Approved by: {adminApprovalUserName}
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
        console.log(card);
      }}
    >
      <CardActionArea>
        <CardHeader
          className="TimesheetTimesheetCardCardHeader"
          avatar={<ColorIndicator status={status} />}
          title={status}
        />
        <CardContent className="TimesheetTimesheetCardCardContent">
          <Typography className="TimesheetTimesheetCardDate" variant="body2">
            {format(parseISO(timeStarted), 'p')}
            {timeFinished && ` - ${format(parseISO(timeFinished), 'p')}`}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
