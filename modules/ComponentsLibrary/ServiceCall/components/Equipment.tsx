import React, { FC, useCallback, useState } from 'react';
import debounce from 'lodash/debounce';
import { ServiceItems, Entry, Repair } from '../../ServiceItems';
import { Property } from '@kalos-core/kalos-rpc/Property';
import { User } from '@kalos-core/kalos-rpc/User';
import { Event } from '@kalos-core/kalos-rpc/Event';

import { ProposalPrint } from './ProposalPrint';
import './equipment.less';

interface Props {
  userID: number;
  loggedUserId: number;
  propertyId: number;
  property: Property;
  serviceItem: Event;
  customer: User;
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
  //const { notes, logJobNumber, id } = serviceItem;
  const notes = serviceItem.getNotes();
  const logJobNumber = serviceItem.getLogJobNumber();
  const id = serviceItem.getId();
  const localStorageKey = `SERVICE_CALL_EQUIPMENT_${id}`;
  const localStorageSelectedKey = `SERVICE_CALL_EQUIPMENT_SELECTED_${id}`;
  let repairsInitial = [];
  let selectedInitial = [];
  try {
    repairsInitial = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
  } catch (e) {}
  try {
    selectedInitial = JSON.parse(
      localStorage.getItem(localStorageSelectedKey) || '[]',
    );
  } catch (e) {}
  const customerName = `${customer?.getFirstname()} ${customer?.getLastname()}`;
  const [selected, setSelected] = useState<Entry[]>(selectedInitial);
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
  const handleSetSelected = useCallback(
    (selected: Entry[]) => {
      setSelected(selected);
      const id = serviceItem.getId();
      const localStorageKey = `SERVICE_CALL_EQUIPMENT_SELECTED_${id}`;
      localStorage.setItem(localStorageKey, JSON.stringify(selected));
    },
    [setSelected, serviceItem],
  );
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
      onSelect={debounce(handleSetSelected, 1000)}
      selected={selected}
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
    />
  );
};
