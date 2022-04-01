import React, { FC, useCallback, useState } from 'react';
import debounce from 'lodash/debounce';
import { ServiceItems, Repair } from '../../ServiceItems';
import { ProposalPrint } from './ProposalPrint';
import { Property } from '../../../../@kalos-core/kalos-rpc/Property';
import { User } from '../../../../@kalos-core/kalos-rpc/User';
import { Event } from '../../../../@kalos-core/kalos-rpc/Event';
import { ServiceItem } from '../../../../@kalos-core/kalos-rpc/ServiceItem';
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
  const localStorageKey = `SERVICE_CALL_EQUIPMENT_${serviceItem.getId()}`;
  const localStorageSelectedKey = `SERVICE_CALL_EQUIPMENT_SELECTED_${serviceItem.getId()}`;
  let repairsInitial = [];
  let selectedInitial: ServiceItem[] = [];
  try {
    repairsInitial = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
  } catch (e) {
    console.error(
      `An error occurred while parsing JSON from localStorage: ${e}`,
    );
  }
  try {
    let selectedInitialRead = JSON.parse(
      localStorage.getItem(localStorageSelectedKey) || '[]',
    );

    selectedInitial = selectedInitialRead.map((selected: any) =>
      Object.setPrototypeOf(selected, ServiceItem.prototype),
    );
  } catch (e) {
    console.error(
      `An error occurred while parsing JSON from localStorage: ${e}`,
    );
  }
  const customerName = `${customer?.getFirstname()} ${customer?.getLastname()}`;
  const [selected, setSelected] = useState<ServiceItem[]>(
    selectedInitial as ServiceItem[],
  );
  const [repairs, setRepairs] = useState<Repair[]>(repairsInitial);
  const [data, setData] = useState<Form>({
    displayName: customerName,
    withJobNotes: 0,
    jobNotes: serviceItem.getNotes(),
  });
  const handleSetRepair = useCallback(
    (repairs: Repair[]) => {
      setRepairs(repairs);
      localStorage.setItem(localStorageKey, JSON.stringify(repairs));
    },
    [setRepairs, localStorageKey],
  );
  const handleSetSelected = useCallback(
    (selected: ServiceItem[]) => {
      setSelected(selected);
      const localStorageKey = `SERVICE_CALL_EQUIPMENT_SELECTED_${serviceItem.getId()}`;
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
      disableRepair={true}
      repairs={repairs}
      onSelect={debounce(handleSetSelected, 1000)}
      selected={selected}
      onRepairsChange={debounce(handleSetRepair, 1000)}
      asideContent={
        <ProposalPrint
          displayName={data.displayName}
          notes={data.withJobNotes ? data.jobNotes : undefined}
          logJobNumber={serviceItem.getLogJobNumber()}
          property={property}
          entries={repairs}
          withDiagnosis
        />
      }
      {...props}
    />
  );
};
