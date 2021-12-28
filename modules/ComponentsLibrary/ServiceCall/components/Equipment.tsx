import React, { FC, useCallback, useState } from 'react';
import debounce from 'lodash/debounce';
import { ServiceItems, Repair } from '../../ServiceItems';
import { Property } from '@kalos-core/kalos-rpc/Property';
import { User } from '@kalos-core/kalos-rpc/User';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { ServiceCallReadings } from '../../ServiceCallReadings';
import { ProposalPrint } from './ProposalPrint';
import './equipment.less';
import { ServiceItem } from '@kalos-core/kalos-rpc/ServiceItem';

interface Props {
  userID: number;
  loggedUserId: number;
  propertyId: number;
  property: Property;
  event: Event;
  customer: User;
}

type Form = {
  displayName: string;
  withJobNotes: number;
  jobNotes: string;
};

export const Equipment: FC<Props> = ({
  event,
  customer,
  property,
  loggedUserId,
  ...props
}) => {
  const notes = event.getNotes();
  const logJobNumber = event.getLogJobNumber();
  const id = event.getId();
  const localStorageKey = `SERVICE_CALL_EQUIPMENT_${id}`;
  const localStorageSelectedKey = `SERVICE_CALL_EQUIPMENT_SELECTED_${id}`;
  let repairsInitial = [];
  let selectedInitial = [];
  try {
    repairsInitial = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
  } catch (e) {
    console.error(
      `An error occurred while attempting to get the local storage key: ${e}`,
    );
  }
  try {
    selectedInitial = JSON.parse(
      localStorage.getItem(localStorageSelectedKey) || '[]',
    );
  } catch (e) {
    console.error(
      `An error occurred while attempting to get the local storage selected key: ${e}`,
    );
  }
  const customerName = `${customer?.getFirstname()} ${customer?.getLastname()}`;

  return (
    <ServiceCallReadings
      propertyId={props.propertyId}
      eventId={event.getId()}
      loggedUserId={loggedUserId}
    ></ServiceCallReadings>
  );
};
