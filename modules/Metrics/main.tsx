import React, { FC, useEffect, useCallback, useState } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { Chart, Data } from '../ComponentsLibrary/Chart';
import {
  loadTimesheetDepartments,
  loadUsersByDepartmentId,
  loadMetricByUserIds,
  MetricType,
} from '../../helpers';

const GROUP_BY_KEYS = [{ label: 'Role', value: 'role' }];

interface Props {
  title: string;
  metrics: {
    dataKey: MetricType;
    name: string;
    fill: string;
  }[];
}

const loadData = async (metrics: MetricType[]) => {
  const departments = await loadTimesheetDepartments();
  const departmentById: { [key: number]: string } = departments.reduce(
    (aggr, { id, value }) => ({ ...aggr, [id]: value }),
    {},
  );
  const departmentIds = departments.map(({ id }) => id);
  const users: { [key: number]: any } = (
    await Promise.all(
      departmentIds.map(
        async departmentId => await loadUsersByDepartmentId(departmentId),
      ),
    )
  )
    .reduce((aggr, items) => [...aggr, ...items], [])
    .map(({ id, firstname, lastname, employeeDepartmentId }) => ({
      id,
      name: `${firstname} ${lastname}`,
      role: departmentById[employeeDepartmentId],
    }))
    .reduce((aggr, item) => ({ ...aggr, [item.id]: item }), {});
  const userIds = Object.keys(users).map(id => +id);
  (
    await Promise.all(
      metrics.map(async metricType => ({
        metricType,
        values: await loadMetricByUserIds(userIds, metricType),
      })),
    )
  ).forEach(({ metricType, values }) => {
    values.forEach(({ id, value }) => {
      users[id][metricType] = value;
    });
  });
  return Object.values(users);
};

export const Metrics: FC<Props> = ({ title, metrics }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Data>([]);
  const load = useCallback(async () => {
    setLoading(true);
    const data = await loadData(metrics.map(({ dataKey }) => dataKey));
    setData(data);
    setLoading(false);
  }, [setData, setLoading, metrics]);
  useEffect(() => {
    if (!loaded) {
      load();
      setLoaded(true);
    }
  }, [load, loaded, setLoaded]);
  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      <Chart
        title={title}
        config={{
          x: {
            dataKey: 'name',
            label: 'Name',
          },
          bars: metrics,
        }}
        data={data}
        groupByKeys={GROUP_BY_KEYS}
        loading={loading}
      />
    </ThemeProvider>
  );
};
