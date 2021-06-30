import React, { useEffect, useState } from 'react';
import { CheckInProjectTask } from '.';
import { EventClientService } from '../../../helpers';
import { Event } from '@kalos-core/kalos-rpc/Event/index';
import { ExampleTitle } from '../helpers';

export default () => {
  const [project, setProject] = useState<Event>(new Event());
  const load = async () => {
    const req = new Event();
    req.setId(70);
    setProject(await EventClientService.Get(req));
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <>
      <ExampleTitle>Default (logged as 8418)</ExampleTitle>
      <CheckInProjectTask
        projectToUse={project}
        loggedUserId={8418}
        serviceCallId={1}
      />
    </>
  );
};
