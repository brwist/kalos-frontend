import React, { FC, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ServiceItems, Entry, Repair } from '../../ServiceItems';
import { PlainForm, Schema } from '../../PlainForm';
import { UserType, PropertyType } from '../../../../helpers';
import { EventType } from '../';
import { ProposalPrint } from './ProposalPrint';

interface Props {
  userID: number;
  loggedUserId: number;
  propertyId: number;
  property: PropertyType;
  serviceItem: EventType;
  customer: UserType;
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

export const Equipment: FC<Props> = ({
  serviceItem,
  customer,
  property,
  ...props
}) => {
  const classes = useStyles();
  const { notes, logJobNumber } = serviceItem;
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
    // TODO handle submit
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
          label: 'Submit',
          onClick: handleSubmit,
        },
      ]}
      selectable
      repair
      onSelect={setSelected}
      onRepairsChange={setRepairs}
      asideContent={
        <ProposalPrint
          displayName={data.displayName}
          notes={data.withJobNotes ? data.jobNotes : undefined}
          logJobNumber={logJobNumber}
          property={property}
          entries={repairs}
          withDiagnosis
        />
      }
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
