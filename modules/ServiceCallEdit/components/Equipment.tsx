import React, { FC, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  ServiceItems,
  Entry,
  Repair,
} from '../../ComponentsLibrary/ServiceItems';
import { PlainForm, Schema } from '../../ComponentsLibrary/PlainForm';
import { EventType } from './ServiceCallDetails';

interface Props {
  userID: number;
  loggedUserId: number;
  propertyId: number;
  serviceItem: EventType;
}

type Form = {
  displayName: string;
  withJobNotes: number;
  jobNotes: string;
};

const useStyles = makeStyles(theme => ({
  form: {
    marginBottom: theme.spacing(-2),
  },
}));

export const Equipment: FC<Props> = ({ serviceItem, ...props }) => {
  const classes = useStyles();
  const { customer, notes } = serviceItem;
  const customerName = `${customer?.firstname} ${customer?.lastname}`;
  const [selected, setSelected] = useState<Entry[]>([]);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [data, setData] = useState<Form>({
    displayName: customerName,
    withJobNotes: 0,
    jobNotes: notes,
  });
  const SCHEMA: Schema<Form> = [
    [
      {
        name: 'displayName',
        label: 'Display Name',
        options: [customerName, customer?.businessname || ''],
      },
      {
        name: 'withJobNotes',
        label: 'With Job Notes',
        type: 'checkbox',
      },
      {
        name: 'jobNotes',
        label: 'Job Notes',
        multiline: true,
        disabled: !data.withJobNotes,
      },
    ],
  ];
  const handleSubmit = useCallback(() => {
    console.log({
      ...data,
      selected,
      repairs,
    });
  }, [data, selected, repairs]);
  return (
    <ServiceItems
      title="Property Service Items"
      actions={[
        {
          label: 'PDF Preview',
        },
        {
          label: 'Submit',
          onClick: handleSubmit,
        },
      ]}
      selectable
      repair
      onSelect={setSelected}
      onRepairsChange={setRepairs}
      {...props}
    >
      <PlainForm
        schema={SCHEMA}
        data={data}
        onChange={setData}
        className={classes.form}
      />
    </ServiceItems>
  );
};
