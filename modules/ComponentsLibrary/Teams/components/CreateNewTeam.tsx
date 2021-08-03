import React, { FC, useCallback, useEffect, useState } from 'react';
import { Form, Schema } from '../../Form';

interface Props {
  onClose: () => any;
}

const SCHEMA_NEW_TEAM: Schema<{}> = []; // TODO just a schema so it opens

export const CreateNewTeam: FC<Props> = ({ onClose }) => {
  const [team, setTeam] = useState<{}>({}); // TODO
  const load = useCallback(() => {}, []);
  useEffect(() => load(), [load]);
  return (
    <>
      <Form
        title="New Team"
        onSave={() => alert('would save')}
        onClose={onClose}
        schema={SCHEMA_NEW_TEAM}
        data={team}
      />
    </>
  );
};
