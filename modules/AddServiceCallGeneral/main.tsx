import React, { FC } from 'react';
import { AddServiceCall, Props } from './components/AddServiceCall';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

export const AddServiceCallGeneral: FC<Props & PageWrapperProps> = props => (
  <PageWrapper {...props} userID={props.loggedUserId}>
    <AddServiceCall {...props} />
  </PageWrapper>
);
