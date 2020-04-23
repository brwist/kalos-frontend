import React, { FC, useCallback, useState, useRef, useEffect } from 'react';
import ReactToPrint from 'react-to-print';
import uniq from 'lodash/uniq';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
  ResponsiveContainerProps,
} from 'recharts';
import { SectionBar } from '../SectionBar';
import { Button } from '../Button';
import { Field, Value } from '../Field';
import { InfoTable, Data as InfoTableData } from '../InfoTable';
import { PlainForm, Schema, Option } from '../PlainForm';
import { Modal } from '../Modal';
import { makeFakeRows } from '../../../helpers';
import './styles.css';

const PRINT_WIDTH = 1200;
const CHART_ASPECT_RATIO = 16 / 9;

export type DataItem = { [key: string]: any };
export type Data = DataItem[];
export type Config = {
  x: {
    dataKey: string;
    label: string;
  };
  bars: {
    dataKey: string;
    name: string;
    fill: string;
  }[];
};

type ChartForm = {
  orderBy: string;
  ratio: number;
  groupBy: string;
};

type Style = {
  loading?: boolean;
};

export interface Props extends Style {
  title?: string;
  data: Data;
  config: Config;
  skipOrdering?: boolean;
  skipRatio?: boolean;
  groupByKeys?: Option[];
  groupByLabels?: { [key: string]: string };
  loggedUserId?: number;
}

const useStyles = makeStyles(theme => ({
  form: {
    marginBottom: theme.spacing(-3),
  },
  panel: {
    display: 'flex',
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      marginTop: 0,
    },
  },
  role: {
    display: 'flex',
    alignItems: 'center',
  },
  users: {
    width: 220,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  filterButton: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      marginTop: 0,
      marginBottom: theme.spacing(3),
      position: 'relative',
      left: `calc(100% - ${theme.spacing(3)}px)`,
      transform: 'translateX(-100%)',
    },
  },
  usersList: {
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  wrapper: ({ loading }: Style) => ({
    flexGrow: 1,
    position: 'relative',
    filter: `grayscale(${loading ? 1 : 0})`,
    pointerEvents: loading ? 'none' : 'auto',
  }),
  container: {
    position: 'relative',
    width: '100%',
    '&:before': {
      content: "' '",
      display: 'block',
      paddingTop: `${100 / CHART_ASPECT_RATIO}%`,
    },
  },
  responsive: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  chart: {
    ...theme.typography.body1,
  },
  print: {
    display: 'none',
    '@media print': {
      display: 'block',
    },
  },
  printHeader: {
    marginBottom: theme.spacing(),
  },
  printBody: {
    width: PRINT_WIDTH,
  },
  checkboxRole: {
    marginTop: `${theme.spacing(-1.5)}px !important`,
    marginBottom: `${theme.spacing(-1.5)}px !important`,
  },
  checkboxUser: {
    marginLeft: `${theme.spacing(2)}px !important`,
    marginTop: `${theme.spacing(-1.5)}px !important`,
    marginBottom: `${theme.spacing(-1.5)}px !important`,
  },
  loading: {
    ...theme.typography.caption,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

const toPercent = (decimal: number, fixed: number = 0) =>
  `${(decimal * 100).toFixed(fixed)}%`;

export const Chart: FC<Props> = ({
  title,
  data,
  config: {
    x: { dataKey, label },
    bars,
  },
  skipOrdering = false,
  skipRatio = false,
  groupByKeys = [],
  groupByLabels = {},
  loading = false,
  loggedUserId,
}) => {
  const classes = useStyles({ loading });
  const roles = uniq(data.map(({ role }) => role));
  const loggedUser = data.find(({ id }) => id === loggedUserId);
  const loggedUserRole = loggedUser ? loggedUser.role : undefined;
  const initSelectedRoles = (
    loggedUserRole?: string,
    defaultChecked: number = 1,
  ) =>
    roles.reduce(
      (aggr, key) => ({
        ...aggr,
        [key]: loggedUserRole
          ? loggedUserRole === key
            ? 1
            : 0
          : defaultChecked,
      }),
      {},
    );
  const initCollapsedRoles = (loggedUserRole?: string) =>
    roles.reduce(
      (aggr, key) => ({
        ...aggr,
        [key]: loggedUserRole ? (loggedUserRole === key ? 0 : 1) : 0,
      }),
      {},
    );
  const initSelectedData = (
    loggedUserRole?: string,
    defaultChecked: number = 1,
  ) =>
    data.reduce(
      (aggr, { id, role }) => ({
        ...aggr,
        [id]: loggedUserRole
          ? loggedUserRole === role
            ? 1
            : 0
          : defaultChecked,
      }),
      {},
    );
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [selectedRoles, setSelectedRoles] = useState<{ [key: string]: number }>(
    initSelectedRoles(loggedUserRole),
  );
  const [collapsedRoles, setCollapsedRoles] = useState<{
    [key: string]: number;
  }>(initCollapsedRoles(loggedUserRole));
  const [selectedData, setSelectedData] = useState<{ [key: number]: number }>(
    initSelectedData(loggedUserRole),
  );
  const [width, setWidth] = useState<number>(0);
  const wrapperRef = useCallback(
    node => {
      if (node !== null) {
        setWidth(node.getBoundingClientRect().width);
      }
    },
    [setWidth],
  );
  const printRef = useRef<HTMLDivElement>(null);
  const resize = useCallback(() => wrapperRef(printRef.current), [
    wrapperRef,
    printRef,
  ]);
  const initializeStates = useCallback(() => {
    setSelectedRoles(initSelectedRoles(loggedUserRole));
    setCollapsedRoles(initCollapsedRoles(loggedUserRole));
    setSelectedData(initSelectedData(loggedUserRole));
  }, [
    setSelectedRoles,
    initSelectedRoles,
    setCollapsedRoles,
    initCollapsedRoles,
    setSelectedData,
    initSelectedData,
  ]);
  useEffect(() => {
    if (!loading && !initialized) {
      setInitialized(true);
      initializeStates();
    }
    window.addEventListener('resize', resize); // TODO removeEventListener
  }, [loading, initialized, setInitialized, initializeStates]);
  const [chartFormData, setChartFormData] = useState<ChartForm>({
    orderBy: bars[0]!.dataKey,
    ratio: 0,
    groupBy: dataKey,
  });
  const handleFilterOpenToggle = useCallback(() => setFilterOpen(!filterOpen), [
    filterOpen,
    setFilterOpen,
  ]);
  const handleChangeData = useCallback(
    (id: number, role: string) => (checked: Value) => {
      const newSelectedData = { ...selectedData, [id]: +checked };
      setSelectedData(newSelectedData);
      if (!checked) {
        setSelectedRoles({ ...selectedRoles, [role]: 0 });
      } else {
        const allRolesChecked = data
          .filter(item => item.role === role)
          .map(({ id }) => id)
          .reduce((aggr, id) => aggr && newSelectedData[id] === 1, true);
        if (allRolesChecked) {
          setSelectedRoles({ ...selectedRoles, [role]: 1 });
        }
      }
    },
    [selectedData, setSelectedData, selectedRoles, setSelectedRoles],
  );
  const handleChangeRole = useCallback(
    (role: string) => (checked: Value) => {
      setSelectedRoles({ ...selectedRoles, [role]: +checked });
      setSelectedData({
        ...selectedData,
        ...data
          .filter(item => item.role === role)
          .reduce((aggr, item) => ({ ...aggr, [item.id]: +checked }), {}),
      });
    },
    [data, selectedRoles, setSelectedRoles, selectedData, setSelectedData],
  );
  const handleChangeCollapsedRole = useCallback(
    (role: string) => () => {
      setCollapsedRoles({
        ...collapsedRoles,
        [role]: collapsedRoles[role] ? 0 : 1,
      });
    },
    [collapsedRoles, setCollapsedRoles],
  );
  const handleAllUsersChange = useCallback(
    (checked: number) => {
      setSelectedRoles(initSelectedRoles(undefined, checked));
      setSelectedData(initSelectedData(undefined, checked));
    },
    [setSelectedRoles, setSelectedData, initSelectedRoles, initSelectedData],
  );
  const { orderBy, ratio, groupBy } = chartFormData;
  const SCHEMA: Schema<ChartForm> = [
    [
      ...(groupByKeys.length === 0
        ? []
        : [
            {
              label: 'Group By',
              name: 'groupBy' as const,
              options: [{ label, value: dataKey }, ...groupByKeys],
            },
          ]),
      ...(skipOrdering
        ? []
        : [
            {
              label: 'Order by',
              name: 'orderBy' as const,
              options: bars.map(({ dataKey, name, fill }) => ({
                label: name,
                value: dataKey,
                color: fill,
              })),
            },
          ]),
      ...(skipRatio
        ? []
        : [
            {
              label: 'Show As Ratio',
              name: 'ratio' as const,
              type: 'checkbox' as const,
              disabled: bars.length < 2,
            },
          ]),
    ],
  ];
  const sort = useCallback(
    (key: string) => (a: DataItem, b: DataItem) => {
      const A = ratio
        ? a[key] / bars.reduce((aggr, item) => aggr + a[item.dataKey], 0)
        : a[key];
      const B = ratio
        ? b[key] / bars.reduce((aggr, item) => aggr + b[item.dataKey], 0)
        : b[key];
      if (A > B) return -1;
      if (A < b) return 1;
      return 0;
    },
    [ratio, bars],
  );
  const selectedDataIds = Object.keys(selectedData)
    .filter(id => selectedData[+id])
    .map(id => +id);
  const getRoleCount = (roleMatch: string, fraction: boolean = false) => {
    const roleIds = data
      .filter(({ role }) => role === roleMatch)
      .map(({ id }) => +id);
    const count = selectedDataIds.filter(id => roleIds.includes(id)).length;
    if (fraction) return `${count}/${roleIds.length}`;
    return count === roleIds.length ? 'all' : count;
  };
  const groupedData = JSON.parse(
    JSON.stringify(data.filter(({ id }) => selectedDataIds.includes(id))),
  ).reduce((aggr: Data, item: DataItem) => {
    if (groupBy !== dataKey) {
      item[groupBy] =
        (groupByLabels[item[groupBy]] || item[groupBy]) +
        ` (${getRoleCount(item[groupBy], true)})`;
    }
    const element = aggr.find(el => el[groupBy] === item[groupBy]);
    if (element) {
      bars.forEach(({ dataKey }) => (element[dataKey] += item[dataKey]));
    } else {
      aggr.push(item);
    }
    return aggr;
  }, []);
  const barCharData = groupedData.sort(sort(orderBy));
  const barChartKey = [orderBy].join('|');
  const ChartContent = ({
    print = false,
    width,
    height,
  }: {
    print?: boolean;
    width?: number;
    height?: number;
  }) => (
    <BarChart
      key={barChartKey}
      width={print ? PRINT_WIDTH : width}
      height={print ? PRINT_WIDTH / CHART_ASPECT_RATIO : height}
      data={barCharData}
      className={classes.chart}
      stackOffset="expand"
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={groupBy} />
      <YAxis tickFormatter={ratio ? toPercent : undefined} />
      <Tooltip
        formatter={(value, name, { payload }) => {
          if (ratio === 0) return value;
          const sum = bars.reduce(
            (aggr, { dataKey }) => aggr + payload[dataKey],
            0,
          );
          if (sum === 0) return toPercent(0, 2);
          return toPercent(+value / sum, 2);
        }}
      />
      <Legend
        verticalAlign="top"
        iconType="circle"
        iconSize={14}
        wrapperStyle={{ top: -5 }}
      />
      {[
        bars.find(({ dataKey }) => dataKey === orderBy)!,
        ...bars.filter(({ dataKey }) => dataKey !== orderBy),
      ].map(props => (
        <Bar
          key={props.dataKey}
          {...props}
          name={props.name}
          stackId={ratio ? '1' : undefined}
          isAnimationActive={false}
        />
      ))}
    </BarChart>
  );
  const CustomResponsiveContainer = (props: ResponsiveContainerProps) => (
    <div className={classes.container}>
      <div className={classes.responsive}>
        <ResponsiveContainer {...props} />
      </div>
    </div>
  );
  const usersData: InfoTableData = roles
    .map(role => [
      {
        value: (
          <div className={classes.role}>
            <Field
              name={`role-${role}`}
              value={selectedRoles[role]}
              label={
                (groupByLabels[role] || role) + ` (${getRoleCount(role, true)})`
              }
              type="checkbox"
              className={classes.checkboxRole + ' ' + 'checkboxRole'}
              onChange={handleChangeRole(role)}
            />
            <IconButton size="small" onClick={handleChangeCollapsedRole(role)}>
              {collapsedRoles[role] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </div>
        ),
      },
      ...data
        .filter(item => item.role === role && !collapsedRoles[role])
        .map(({ id, name, role }) => ({
          value: (
            <Field
              name={`data-${id}`}
              value={selectedData[id]}
              label={name}
              type="checkbox"
              className={classes.checkboxUser}
              onChange={handleChangeData(id, role)}
            />
          ),
        })),
    ])
    .reduce((aggr, item) => [...aggr, ...item], [])
    .map(item => [item]);
  return (
    <div>
      <SectionBar
        title={title}
        asideContent={
          <ReactToPrint
            trigger={() => <Button label="Print" disabled={loading} />}
            content={() => printRef.current}
            bodyClass={classes.printBody}
          />
        }
      />
      <PlainForm
        schema={SCHEMA}
        data={chartFormData}
        onChange={setChartFormData}
        disabled={loading}
        className={classes.form}
      />
      <Button
        label={`Filter (${selectedDataIds.length} selected)`}
        className={classes.filterButton}
        onClick={handleFilterOpenToggle}
        disabled={loading}
      />
      <div className={classes.panel}>
        <div className={classes.users}>
          <SectionBar
            title="Users"
            subtitle={
              loading ? 'Loading...' : `${selectedDataIds.length} selected`
            }
            small
            onCheck={handleAllUsersChange}
            checked={
              loading ? 0 : data.length === selectedDataIds.length ? 1 : 0
            }
            loading={loading}
          />
          <div
            style={{ height: width / CHART_ASPECT_RATIO - 50 }}
            className={classes.usersList}
          >
            <InfoTable
              data={loading ? makeFakeRows(1, 20) : usersData}
              loading={loading}
            />
          </div>
        </div>
        <div ref={wrapperRef} className={classes.wrapper}>
          <CustomResponsiveContainer aspect={CHART_ASPECT_RATIO}>
            <ChartContent />
          </CustomResponsiveContainer>
          <div ref={printRef}>
            <div className={classes.print}>
              <SectionBar title={title} className={classes.printHeader} />
              <ChartContent print />
            </div>
          </div>
          {loading && <div className={classes.loading}>Loading...</div>}
        </div>
      </div>
      {filterOpen && (
        <Modal open onClose={handleFilterOpenToggle} fullScreen>
          <SectionBar
            title="Users"
            subtitle={`${selectedDataIds.length} selected`}
            small
            actions={[{ label: 'Apply', onClick: handleFilterOpenToggle }]}
            fixedActions
            onCheck={handleAllUsersChange}
            checked={
              loading ? 0 : data.length === selectedDataIds.length ? 1 : 0
            }
          />
          <InfoTable data={usersData} />
        </Modal>
      )}
    </div>
  );
};
