import {
  ActivityLog,
  ActivityLogList,
} from '@kalos-core/kalos-rpc/ActivityLog';
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  ActivityLogClientService,
  EventClientService,
  EventType,
} from '../../../../helpers';
import { Event, EventList } from '@kalos-core/kalos-rpc/Event';
import { InfoTable, Row } from '../../InfoTable';
import { Loader } from '../../../Loader/main';
import { CheckInProjectTask } from '../../CheckInProjectTask';
import { RoleType } from '../../Payroll';

export interface Props {
  serviceCallId: number;
  loggedUserId: number;
  project: EventType;
  role: RoleType;
}

export const LogsTab: FC<Props> = ({
  serviceCallId,
  loggedUserId,
  project,
  role,
}) => {
  const [projectLogs, setProjectLogs] = useState<ActivityLog[]>();
  const [loading, setLoading] = useState<boolean>();

  const load = useCallback(async () => {
    setLoading(true);
    let promises = []; // Doing promise array thing because these are pretty heavy calls and loading taking 30 seconds atm is killing me
    let logs: ActivityLogList;
    promises.push(
      new Promise<void>(async resolve => {
        try {
          let req: any = new ActivityLog();
          req.setPageNumber(0);
          req.setEventId(project.id);
          if (role !== 'Manager') req.setUserId(loggedUserId);
          logs = await ActivityLogClientService.BatchGet(req);
          resolve();
        } catch (err) {
          console.error(`An error occurred while getting activity logs: `, err);
          resolve();
        }
      }),
    );

    Promise.all(promises).then(() => {
      setProjectLogs(logs.getResultsList());
      setLoading(false);
    });
  }, [setProjectLogs, setLoading, project.id, loggedUserId, role]);
  useEffect(() => {
    load();
  }, [load]);
  return loading ? (
    <Loader />
  ) : (
    <>
      <CheckInProjectTask
        projectToUse={project!}
        loggedUserId={loggedUserId}
        serviceCallId={serviceCallId}
      />
      <InfoTable
        key={projectLogs?.toString()}
        columns={[
          { name: 'ID' },
          { name: 'User ID' },
          { name: 'Description' },
          { name: 'Date' },
          { name: 'Property ID' },
        ]}
        data={projectLogs?.map(log => {
          return [
            { value: log.getId() },
            { value: log.getUserId() },
            { value: log.getActivityName() },
            { value: log.getActivityDate() },
            { value: log.getPropertyId() },
          ] as Row;
        })}
      />
    </>
  );
};
