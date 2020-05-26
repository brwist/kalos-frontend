import React, { FC, useState, useCallback, useEffect, useMemo } from 'react';
import { startOfWeek, format, addDays } from 'date-fns';
import { PerDiemRow } from '@kalos-core/kalos-rpc/PerDiem';
import { makeStyles } from '@material-ui/core/styles';
import CardTravel from '@material-ui/icons/CardTravel';
import { CalendarHeader } from '../CalendarHeader';
import { Calendar } from '../Calendar';
import { CalendarColumn } from '../CalendarColumn';
import { CalendarCard } from '../CalendarCard';
import { AddNewButton } from '../AddNewButton';
import { Form, Schema } from '../Form';
import { Modal } from '../Modal';
import {
  loadUserById,
  loadPerDiemByUserIdAndDateStarted,
  UserType,
  PerDiemType,
  PerDiemRowType,
  getCustomerName,
} from '../../../helpers';
import { JOB_STATUS_COLORS } from '../../../constants';

export interface Props {
  userId: number;
}

const useStyles = makeStyles(theme => ({
  row: {
    marginBottom: theme.spacing(0.5),
  },
}));

const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

const SCHEMA: Schema<PerDiemRowType> = [
  [
    {
      label: 'Date',
      name: 'dateString',
      type: 'date',
      required: true,
    },
  ],
  [
    {
      label: 'Zip Code',
      name: 'zipCode',
      required: true,
    },
  ],
  [
    {
      label: 'Service Call',
      name: 'serviceCallId',
      required: true,
    },
  ],
  [
    {
      label: 'Notes',
      name: 'notes',
      multiline: true,
    },
  ],
  [
    {
      label: 'Meals Only',
      name: 'mealsOnly',
      type: 'checkbox',
    },
  ],
];

const APPROVED = 'APPROVED';
const PENDING_APPROVE = 'PENDING_APPROVE';
const PENDING_SUBMIT = 'PENDING_SUBMIT';

export const PerDiem: FC<Props> = ({ userId }) => {
  const classes = useStyles();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [userLoaded, setUserLoaded] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [user, setUser] = useState<UserType>();
  const [perDiem, setPerDiem] = useState<PerDiemType>();
  const [dateStarted, setDateStarted] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 6 }),
  );
  const [pendingEdit, setPendingEdit] = useState<PerDiemRowType>();
  const load = useCallback(async () => {
    setLoading(true);
    const { resultsList } = await loadPerDiemByUserIdAndDateStarted(
      userId,
      formatDate(dateStarted),
    );
    setPerDiem(resultsList[0]);
    setLoading(false);
  }, [userId, setLoading, setPerDiem]);
  const loadUser = useCallback(async () => {
    setLoadingUser(true);
    const user = await loadUserById(userId);
    setUser(user);
    setLoadingUser(false);
  }, [userId, setLoadingUser, setUser]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  useEffect(() => {
    if (!userLoaded) {
      setUserLoaded(true);
      loadUser();
    }
  }, [userLoaded, setUserLoaded, loadUser]);
  const handlePendingEditToggle = useCallback(
    (pendingEdit?: PerDiemRowType) => () => setPendingEdit(pendingEdit),
    [setPendingEdit],
  );
  const status = useMemo(() => {
    if (perDiem) {
      if (perDiem.dateApproved)
        return {
          status: APPROVED,
          button: 'Approve Per Diems',
          text: 'Approved',
          color: '#' + JOB_STATUS_COLORS['Completed'],
        };
      if (perDiem.dateSubmitted)
        return {
          status: PENDING_APPROVE,
          button: 'Approve Per Diems',
          text: 'Pending approve',
          color: '#' + JOB_STATUS_COLORS['Pend Sched'],
        };
    }
    return {
      status: PENDING_SUBMIT,
      button: 'Submit Per Diems',
      text: 'Pending submit',
      color: '#' + JOB_STATUS_COLORS['Incomplete'],
    };
  }, [perDiem]);
  const rowsList = perDiem ? perDiem.rowsList : [];
  return (
    <div>
      <CalendarHeader
        onDateChange={setDateStarted}
        onSubmit={console.log}
        selectedDate={dateStarted}
        userName={getCustomerName(user)}
        weekStartsOn={6}
        submitLabel={status.button}
      />
      <Calendar>
        {[...Array(7)].map((_, dayOffset) => {
          const date = formatDate(addDays(dateStarted, dayOffset));
          const rows = rowsList.filter(({ dateString }) =>
            dateString.startsWith(date),
          );
          return (
            <CalendarColumn
              key={dayOffset}
              date={date}
              loading={loading || loadingUser}
            >
              {rows.map(entry => {
                const { id, notes, zipCode, serviceCallId, mealsOnly } = entry;
                return (
                  <CalendarCard
                    key={id}
                    title={status.text.toUpperCase()}
                    statusColor={status.color}
                    onClick={handlePendingEditToggle(entry)}
                  >
                    <div className={classes.row}>
                      <strong>Zip Code: </strong>
                      {zipCode}
                    </div>
                    <div className={classes.row}>
                      <strong>Service Call Id: </strong>
                      {serviceCallId}
                    </div>
                    <div className={classes.row}>
                      <strong>Meals only: </strong>
                      {mealsOnly ? 'YES' : 'NO'}
                    </div>
                    <div className={classes.row}>
                      <strong>Notes: </strong>
                      {notes}
                    </div>
                  </CalendarCard>
                );
              })}
            </CalendarColumn>
          );
        })}
      </Calendar>
      <AddNewButton
        options={[
          {
            name: 'Add Per Diem',
            icon: <CardTravel />,
            action: handlePendingEditToggle(new PerDiemRow().toObject()),
          },
        ]}
      />
      {pendingEdit && (
        <Modal open onClose={handlePendingEditToggle(undefined)}>
          <Form
            title={`${pendingEdit.id ? 'Edit' : 'Add'} Per Diem Row`}
            schema={SCHEMA}
            data={pendingEdit}
            onClose={handlePendingEditToggle(undefined)}
            onSave={console.log}
          />
        </Modal>
      )}
    </div>
  );
};
