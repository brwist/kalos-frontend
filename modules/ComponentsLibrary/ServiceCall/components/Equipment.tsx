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
  onSelectServiceItems?: (data: number[]) => void;
  selectedServiceItems?: number[];
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
  onSelectServiceItems,
  selectedServiceItems,
  ...props
}) => {
  return (
    <div>
      <ServiceItems
        userID={props.userID}
        eventId={event.getId()}
        loggedUserId={loggedUserId}
        propertyId={props.propertyId}
        onSelect={onSelectServiceItems}
        selectable={onSelectServiceItems ? true : false}
        selected={selectedServiceItems}
      ></ServiceItems>
    </div>
  );
};
