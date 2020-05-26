import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CalendarHeader } from '../CalendarHeader';
import { Calendar } from '../Calendar';
import { CalendarColumn } from '../CalendarColumn';
import { CalendarCard } from '../CalendarCard';

export interface Props {}

const useStyles = makeStyles(theme => ({}));

export const PerDiem: FC<Props> = ({}) => {
  const classes = useStyles();
  return (
    <div>
      <CalendarHeader
        onDateChange={console.log}
        onSubmit={console.log}
        selectedDate={new Date()}
        userName="John Doe"
      />
      <Calendar>
        {[...Array(7)].map((_, idx) => (
          <CalendarColumn key={idx} date={`2020-03-1${idx}`}>
            <CalendarCard
              title="Lorem"
              statusColor="#FFF000"
              onClick={console.log}
            />
          </CalendarColumn>
        ))}
      </Calendar>
    </div>
  );
};
