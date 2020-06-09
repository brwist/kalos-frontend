import React, { FC, useCallback } from 'react';
import { parse } from 'json2csv';
import { Button, Props as ButtonProps } from '../Button';
import { downloadCSV } from '../../../helpers';

type Column = {
  label: string;
  value: string;
};

interface Props {
  buttonProps?: ButtonProps;
  filename: string;
  json: Object[];
  fields: Column[];
}

export const ExportJSON: FC<Props> = ({
  filename,
  json,
  fields,
  buttonProps,
}) => {
  const handleDownload = useCallback(() => {
    const csv = parse(json, { fields });
    downloadCSV(filename, csv);
  }, [json, filename]);
  return (
    <Button label="Export to Excel" {...buttonProps} onClick={handleDownload} />
  );
};
