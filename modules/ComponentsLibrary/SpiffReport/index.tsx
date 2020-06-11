import React, { FC, useState } from 'react';
import { PrintPage } from '../PrintPage';

interface Props {
  month: string;
  type: 'Monthly' | 'Weekly';
  users: number[];
}

export const SpiffReport: FC<Props> = ({}) => {
  const [entries, setEntries] = useState<string[]>([]);
  return <PrintPage headerProps={{ title: 'Jose' }} />;
};
