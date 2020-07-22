import React, { FC, useCallback, useState } from 'react';
import debounce from 'lodash/debounce';
import { ServiceItems, Entry, Repair } from '../../ServiceItems';
import { PlainForm, Schema } from '../../PlainForm';
import { UserType, PropertyType } from '../../../../helpers';
import { EventType } from '../';
import { ProposalPrint } from './ProposalPrint';
import './equipment.less';

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

export const Equipment: FC<Props> = ({
  serviceItem,
  customer,
  property,
  ...props
}) => {
  const { notes, logJobNumber, id } = serviceItem;
  const localStorageKey = `SERVICE_CALL_EQUIPMENT_${id}`;
  let repairsInitial = [];
  try {
    repairsInitial = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
  } catch (e) {}
  const customerName = `${customer?.firstname} ${customer?.lastname}`;
  const [selected, setSelected] = useState<Entry[]>([]);
  const [repairs, setRepairs] = useState<Repair[]>(repairsInitial);
  const [data, setData] = useState<Form>({
    displayName: customerName,
    withJobNotes: 0,
    jobNotes: notes,
  });
  const handleSetRepair = useCallback(
    (repairs: Repair[]) => {
      setRepairs(repairs);
      localStorage.setItem(localStorageKey, JSON.stringify(repairs));
    },
    [setRepairs, localStorageKey],
  );
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
      disableRepair={!id}
      repairs={repairs}
      onSelect={setSelected}
      onRepairsChange={debounce(handleSetRepair, 1000)}
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
        className="EquipmentForm"
      />
    </ServiceItems>
  );
};
