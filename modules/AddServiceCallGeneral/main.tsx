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
  const [projects, setProjects] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [parentId, setParentId] = useState<number | null>(null);
  const [confirmedParentId, setConfirmedParentId] = useState<number | null>(
    null,
  );

  const handleSetParentId = useCallback(
    id => {
      console.log('Set parent id: ', id);
      setParentId(id);
    },
    [setParentId],
  );

  const handleSetConfirmedIsChild = useCallback(
    id => {
      console.log('Confirmed is child: ', id);
      //setConfirmedIsChild(confirmed);
      setConfirmedParentId(id);
    },
    [setConfirmedParentId],
  );

  const load = useCallback(async () => {
    setLoading(true);
    const projects = await loadProjects();
    console.log('Got projects: ', projects);
    setProjects(projects);
    setLoading(false);
    setLoaded(true);
  }, [setProjects, setLoading, setLoaded]);

  useEffect(() => {
    load();
  }, [load, setProjects, setLoading, setLoaded]);

  return (
    <PageWrapper {...props} userID={props.loggedUserId}>
      <>
        <Tabs
          tabs={Array.from(Array(2)).map((_, idx) => ({
            label: idx == 0 ? `Add Service Call` : `Add Project`,
            content: (
              <AddServiceCall {...props} asProject={idx == 0 ? false : true} />
            ),
          }))}
        />
        {parentId != confirmedParentId && parentId != null && (
          <Confirm
            title="Confirm Parent"
            open={true}
            onClose={() => handleSetParentId(null)}
            onConfirm={() => handleSetConfirmedIsChild(parentId)}
          >
            Are you sure you want to set this project as the parent to the new
            project?
          </Confirm>
        )}
        {loaded ? (
          <GanttChart
            events={projects.map(task => {
              const {
                id,
                description,
                dateStarted: dateStart,
                dateEnded: dateEnd,
                logJobStatus,
                color,
              } = task;
              const [startDate, startHour] = dateStart.split(' ');
              const [endDate, endHour] = dateEnd.split(' ');
              return {
                id,
                startDate,
                endDate,
                startHour,
                endHour,
                notes: description,
                statusColor: '#' + color,
                onClick: () => {
                  console.log('Service call id of clicked: ', id);
                  handleSetParentId(id);
                  // setServiceCallId(id);
                  // setLoaded(false);
                  // setLoadedInit(false);
                  // // load();
                },
              };
            })}
            startDate={projects[0].dateStarted.substr(0, 10)}
            endDate={projects[projects.length - 1].dateEnded.substr(0, 10)}
            loading={loading}
          />
        ) : (
          <Loader />
        )}
      </>
    </PageWrapper>
  );
};
