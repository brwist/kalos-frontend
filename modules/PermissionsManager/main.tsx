import React, { FC } from 'react';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';
import { PermissionsManager as PermissionsManagerComponent } from '../ComponentsLibrary/PermissionsManager';
// add any prop types here
interface props {
  userID: number;
}

// map your state here
interface state {}

export const PermissionsManager: FC<props & PageWrapperProps> = props => (
  <PageWrapper {...props} userID={props.userID}>
    <h1>PermissionsManager!</h1>
    <PermissionsManagerComponent
      loggedUserId={props.userID}
      onClose={() => console.log('yo')}
    ></PermissionsManagerComponent>
  </PageWrapper>
);
