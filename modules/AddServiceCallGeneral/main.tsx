import React, { FC } from 'react';
import { AddServiceCall, Props } from './components/AddServiceCall';
import { PageWrapper } from '../PageWrapper/main';

export const AddServiceCallGeneral: FC<Props> = (props) => (
  <PageWrapper userID={props.loggedUserId}>
    <AddServiceCall {...props} />
  </PageWrapper>
);
