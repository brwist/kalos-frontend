import React, { FC, useCallback, useEffect, useState } from 'react';
import { EventClientService, UserType } from '../../../../helpers';
import { EventType, ServicesRenderedType } from '../';
import { CheckInProjectTask } from '../../CheckInProjectTask';
import { Loader } from '../../../Loader/main';

interface Props {
  serviceCallId: number;
  loggedUser: UserType;
}

export const Services: FC<Props> = ({ serviceCallId, loggedUser }) => {
  const [project, setProject] = useState<EventType>();
  const [loading, setLoading] = useState<Boolean>();
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const proj = await EventClientService.LoadEventByServiceCallID(
        serviceCallId,
      );
      setProject(proj);
    } catch (err) {
      console.error(
        `An error occurred while getting the project event: ${err}`,
      );
    }
    setLoading(false);
  }, [setProject, setLoading]);
  useEffect(() => {
    load();
  }, []);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <CheckInProjectTask
          loggedUserId={loggedUser.id}
          serviceCallId={serviceCallId}
          projectToUse={project!}
        />
      )}
    </>
  );
};
