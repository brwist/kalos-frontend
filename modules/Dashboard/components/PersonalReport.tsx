import React, { useMemo, useState } from 'react';
import { getWeekOptions } from '../../../helpers';
import Paper from '@material-ui/core/Paper';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Schema, PlainForm } from '../../ComponentsLibrary/PlainForm';
import { OPTION_ALL } from '../../../constants';
import { CostReportForEmployee } from '../../ComponentsLibrary/CostReportForEmployee';
interface PersonalReportProps {
  userId: number;
  username?: string;
}
export type FilterData = {
  week: string;
};
export const PersonalReport = ({ userId, username }: PersonalReportProps) => {
  const weekOptions = useMemo(
    () => [
      { label: OPTION_ALL, value: OPTION_ALL },
      ...getWeekOptions(52, 0, -1),
    ],
    [],
  );

  const handleSetFilter = (d: FilterData) => {
    if (!d.week) {
      d.week = OPTION_ALL;
    }
    setFilter(d);
  };
  const [filter, setFilter] = useState<FilterData>({ week: OPTION_ALL });

  const SCHEMA: Schema<FilterData> = [
    [
      {
        name: 'week' as const,
        label: 'Select Week',
        options: weekOptions,
      },
    ],
  ];
  return (
    <Paper
      elevation={7}
      style={{
        width: '90%',
        overflowY: 'scroll',
        marginBottom: 20,
      }}
    >
      <SectionBar
        subtitle={`Generate Employee Weekly Report ${
          username ? `For ${username}` : ``
        }`}
      >
        <PlainForm
          data={filter}
          onChange={handleSetFilter}
          schema={SCHEMA}
          className="PayrollFilter"
        />
        {filter.week != OPTION_ALL && (
          <CostReportForEmployee
            key={filter.week + userId}
            userId={userId}
            week={filter.week}
          ></CostReportForEmployee>
        )}
      </SectionBar>
    </Paper>
  );
};
