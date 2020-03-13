import React, { FC } from 'react';
import { ServiceItems } from '../../ComponentsLibrary/ServiceItems';

interface Props {
  userID: number;
  loggedUserId: number;
  propertyId: number;
}

export const Equipment: FC<Props> = props => (
  <ServiceItems selectable title="Property Service Items" {...props} />
);
