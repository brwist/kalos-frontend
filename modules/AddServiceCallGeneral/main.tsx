import React, { FC, useCallback, useEffect, useState } from 'react';
import { AddServiceCall, Props } from './components/AddServiceCall';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';
import { Tabs } from '../ComponentsLibrary/Tabs';
import { ServiceCallSearch } from '../ServiceCallSearch/main';
import { AdvancedSearch } from '../ComponentsLibrary/AdvancedSearch';
import { GanttChart } from '../ComponentsLibrary/GanttChart';
import { EventType, loadProjects } from '../../helpers';
import { Loader } from '../Loader/main';
import { Confirm } from '../ComponentsLibrary/Confirm';

export const AddServiceCallGeneral: FC<Props & PageWrapperProps> = props => {
  return (
    <PageWrapper {...props} userID={props.loggedUserId}>
      <>
        <Tabs
          tabs={Array.from(Array(2)).map((_, idx) => ({
            label: idx == 0 ? `Add Service Call` : `Add Project`,
            content: (
              <>
                <AddServiceCall
                  {...props}
                  asProject={idx == 0 ? false : true}
                />
              </>
            ),
          }))}
        />
      </>
    </PageWrapper>
  );
};
