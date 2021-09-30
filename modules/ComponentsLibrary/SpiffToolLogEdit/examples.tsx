import React, { useCallback, useEffect, useState } from 'react';
import { SpiffToolLogEdit } from './';
import { ExampleTitle } from '../helpers';
import { Task } from '@kalos-core/kalos-rpc/Task';
import { TaskClientService } from '../../../helpers';

export default () => {
  const [results, setResults] = useState<Task[]>([]);
  const load = useCallback(async () => {
    // Load the example data
    let req = new Task();
    req.setId(104483);
    const res = await TaskClientService.Get(req);

    req.setId(104456);
    const res2 = await TaskClientService.Get(req);

    setResults([res, res2]);
  }, [setResults]);
  useEffect(() => {
    load();
  }, [load]);
  if (results.length == 0) return <>Loading dev data...</>;
  return (
    <>
      <ExampleTitle>Spiff</ExampleTitle>
      <SpiffToolLogEdit
        data={results[0]!}
        role=""
        loggedUserId={101253}
        type="Spiff"
        onClose={() => console.log('CLOSE')}
        onSave={() => console.log('SAVE')}
        onStatusChange={() => console.log('UPSERT STATUS')}
        loading={false}
      />
      <ExampleTitle>Tool</ExampleTitle>
      <SpiffToolLogEdit
        data={results[1]!}
        loggedUserId={101253}
        type="Tool"
        role=""
        onClose={() => console.log('CLOSE')}
        onSave={() => console.log('SAVE')}
        onStatusChange={() => console.log('UPSERT STATUS')}
        loading={false}
      />
    </>
  );
};
