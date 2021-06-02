import {
  ActivityLog,
  ActivityLogList,
} from '@kalos-core/kalos-rpc/ActivityLog';
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  ActivityLogClientService,
  EventClientService,
} from '../../../../helpers';
import { EventClient, Event, EventList } from '@kalos-core/kalos-rpc/Event';
import { Data, InfoTable, Row } from '../../InfoTable';
import { Loader } from '../../../Loader/main';

export interface Props {}

export const LogsTab: FC<Props> = ({}) => {
  const [projectLogs, setProjectLogs] = useState<ActivityLog[]>();
  const [loading, setLoading] = useState<boolean>();

  const load = useCallback(async () => {
    setLoading(true);
    let promises = []; // Doing promise array thing because these are pretty heavy calls and loading taking 30 seconds atm is killing me
    let logs: ActivityLogList;
    let projectEvents: EventList;
    promises.push(
      new Promise<void>(async resolve => {
        try {
          let req: any = new ActivityLog();
          req.setNotEqualsList(['EventId']);
          logs = await ActivityLogClientService.BatchGet(req);
          resolve();
        } catch (err) {
          console.error(`An error occurred while getting activity logs: `, err);
          resolve();
        }
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        try {
          let req = new Event();
          req.setNotEqualsList(['DepartmentId']);
          req.setDepartmentId(0);
          projectEvents = await EventClientService.BatchGet(req);
          resolve();
        } catch (err) {
          console.error(`An error occurred while getting projects: `, err);
          resolve();
        }
      }),
    );

    Promise.all(promises).then(() => {
      // Would have done all of this with a protobuffer field and an @inject_tag in the backend,
      // but the ActivityLog would have to import Event to display an event and that would cause a
      // circular dependency

      // As a result, I'm just grabbing all of the projects and checking each real fast and filtering the logs
      // by that. This isn't the fastest solution but it works for now and it's not terrible, still ~O(n^2)

      let newResList = logs.getResultsList().filter(log => {
        let isInside = false;
        projectEvents.getResultsList().forEach(projectEvent => {
          if (projectEvent.getId() === log.getEventId()) {
            isInside = true;
          }
        });

        return isInside;
      });
      logs.setResultsList(newResList);
      setProjectLogs(logs.getResultsList());
      console.log('Has loaded! ', projectLogs);
      setLoading(false);
    });
  }, [setProjectLogs, setLoading]);
  useEffect(() => {
    load();
  }, [load]);
  return loading ? (
    <Loader />
  ) : (
    <>
      <InfoTable
        key={projectLogs?.toString()}
        data={projectLogs?.map(log => {
          return [
            { value: log.getId() },
            { value: log.getUserId() },
            { value: log.getActivityName() },
            { value: log.getActivityDate() },
            { value: log.getPropertyId() },
          ] as Row;
        })}
        columns={[
          { name: 'ID' },
          { name: 'User ID' },
          { name: 'Description' },
          { name: 'Date' },
          { name: 'Property ID' },
        ]}
      />
    </>
  );
};
