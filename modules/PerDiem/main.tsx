import React, { FC } from 'react';
import { PerDiemComponent, Props } from '../ComponentsLibrary/PerDiem';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

export const PerDiem: FC<Props & PageWrapperProps> = props => (
  <PageWrapper {...props} userID={props.loggedUserId}>
    <PerDiemComponent {...props} />
  </PageWrapper>
);
