import React, { FC, useEffect } from 'react';
import { UserClient } from '../../@kalos-core/kalos-rpc/User/index';
import { ServiceCall, Props } from '../ComponentsLibrary/ServiceCall';
import { ENDPOINT } from '../../constants';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

const userClient = new UserClient(ENDPOINT);

export const ServiceCallEdit: FC<Props & PageWrapperProps> = props => {
  useEffect(() => {
    userClient.GetToken('test', 'test');
  });

  return (
    <PageWrapper {...props} userID={props.loggedUserId}>
      <ServiceCall {...props} />
    </PageWrapper>
  );
};
