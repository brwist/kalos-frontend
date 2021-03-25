import React, { FC } from 'react';
import { AddServiceCall, Props } from './components/AddServiceCall';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';
import { Tabs } from '../ComponentsLibrary/Tabs';

export const AddServiceCallGeneral: FC<Props & PageWrapperProps> = props => (
  <PageWrapper {...props} userID={props.loggedUserId}>
    <Tabs
      tabs={Array.from(Array(2)).map((_, idx) => ({
        label: idx == 0 ? `Add Service Call` : `Add Project`,
        content:
          idx == 0 ? (
            <AddServiceCall {...props} />
          ) : (
            <AddServiceCall {...props} asProject />
          ),
      }))}
    />
  </PageWrapper>
);
