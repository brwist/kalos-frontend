import React, { FC, useCallback, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { parse } from 'json2csv';
import { Button, Props as ButtonProps } from '../Button';
import { downloadCSV } from '../../../helpers';

export type Status = 'idle' | 'loading' | 'loaded';

type Column = {
  label: string;
  value: string;
};

interface Props {
  buttonProps?: ButtonProps;
  filename: string;
  json: Object[];
  fields: Column[];
  onPrint?: () => void;
  status?: Status;
}

export const ExportJSON: FC<Props> = ({
  filename,
  json,
  fields,
  buttonProps,
  onPrint,
  status,
}) => {
  const handleDownload = useCallback(() => {
    const csv = parse(json, { fields });
    downloadCSV(filename, csv);
  }, [json, filename]);
  useEffect(() => {
    if (status === 'loaded') {
      handleDownload!();
    }
  }, [status, handleDownload]);
  return (
    <Button
      label="Export to Excel"
      onClick={onPrint || handleDownload}
      children={
        status === 'loading' && (
          <CircularProgress
            style={{ color: '#FFF', marginRight: 8 }}
            size={16}
          />
        )
      }
      disabled={status === 'loading'}
      {...buttonProps}
    />
  );
};
