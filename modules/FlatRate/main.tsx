import React, { FC } from 'react';
import { FlatRateSheet, Props } from '../ComponentsLibrary/FlatRate';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

// add any prop types here

export const FlatRate: FC<Props & PageWrapperProps> = props => (
  <PageWrapper {...props} userID={props.loggedUserId} withHeader>
    <FlatRateSheet {...props} />
  </PageWrapper>
);