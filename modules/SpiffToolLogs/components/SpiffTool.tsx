import React, { FC, useState, useEffect, useCallback } from 'react';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { TaskClient, Task } from '@kalos-core/kalos-rpc/Task';

type TaskType = Task.AsObject;

export interface Props {
  loggedUserId: number;
}

const SCHEMA: Schema<TaskType> = [];

export const SpiffTool: FC<Props> = ({ loggedUserId }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<TaskType>();
  const load = useCallback(async () => {
    const req = new Task();
    req.setPageNumber(0);
    req.setIsActive(1);
    req.setAdminActionId(loggedUserId);
  }, []);
  const handleSetEditing = useCallback(
    (editing?: TaskType) => () => setEditing(editing),
    [setEditing],
  );
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded]);
  return (
    <div>
      <SectionBar
        title="Spiff Report"
        actions={[
          { label: 'Add', onClick: handleSetEditing(new Task().toObject()) },
        ]}
      />
      {editing && (
        <Modal open onClose={handleSetEditing()}>
          <Form<TaskType>
            title="Spiff Request"
            schema={SCHEMA}
            onClose={handleSetEditing()}
            data={editing}
            onSave={a => console.log(a)}
          />
        </Modal>
      )}
    </div>
  );
};
