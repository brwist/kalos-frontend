// This is the module that allows for users to add logs with photos, etc uploaded with them

import { ActivityLog } from '@kalos-core/kalos-rpc/ActivityLog';
import { getRPCFields } from '@kalos-core/kalos-rpc/Common';
import { Typography } from '@material-ui/core';
import React, { FC, useCallback, useState } from 'react';
import { ActivityLogClientService } from '../../../helpers';
import { Loader } from '../../Loader/main';
import { Alert } from '../Alert';
import { Form, Schema } from '../Form';

interface Props {
  onClose: () => any;
}

export const AddLog: FC<Props> = ({ onClose }) => {
  const [log] = useState<ActivityLog.AsObject>(new ActivityLog().toObject());
  const [error, setError] = useState<string>('');
  const [saving, setSaving] = useState<boolean>();

  const handleSaveLog = useCallback(
    async (logToSave: ActivityLog) => {
      try {
        setSaving(true);
        const response = await ActivityLogClientService.Create(logToSave);
        setSaving(false);
        if (!response) {
          throw new Error(
            `No response was given from the client service - an error occurred. `,
          );
        }
        console.log('Response: ', response);
      } catch (err) {
        console.error(
          `An error occurred while attempting to create a new log: ${err}`,
        );
        setError(
          `An error occurred while attempting to create a new log: ${err}. If this issue persists, please contact the webtech team.`,
        );
        setSaving(false);
      }
    },
    [setSaving],
  );

  const handleSetError = useCallback(
    (err: string) => setError(err),
    [setError],
  );

  // TODO This is set as an AsObject until the Form and Schema can handle non-AsObject forms
  const SCHEMA: Schema<ActivityLog.AsObject> = [
    [
      {
        name: 'activityName',
        label: 'Description',
      },
      {
        name: 'activityDate',
        label: 'Date',
        type: 'mui-datetime',
      },
    ],
  ];
  return (
    <>
      {saving && <Loader />}
      {error && (
        <Alert open={true} onClose={() => handleSetError('')}>
          <Typography>{error}</Typography>{' '}
        </Alert>
      )}
      <Form
        title="Log Details"
        onSave={(savedLog: ActivityLog.AsObject) => {
          let saved = new ActivityLog();
          for (const field in savedLog) {
            // @ts-ignore
            saved[getRPCFields(field).methodName](savedLog[field]);
          }
          handleSaveLog(saved);
        }}
        onClose={() => onClose()}
        schema={SCHEMA}
        data={log}
        submitLabel="Save"
        cancelLabel="Close"
      />
    </>
  );
};
