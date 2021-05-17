import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';
import { SectionBar } from '../SectionBar';
import { InfoTable, Columns, Data } from '../InfoTable';
import { TimeOff } from '../TimeOff';
import { Modal } from '../Modal';
import {
  TimesheetDepartmentType,
  TimeoffRequestType,
  formatDateTime,
  TimeoffRequestClientService,
  makeFakeRows,
  TimesheetDepartmentClientService,
  UserClientService,
} from '../../../helpers';
import {
  TimeoffRequestClient,
  TimeoffRequest,
} from '@kalos-core/kalos-rpc/TimeoffRequest';
import { ROWS_PER_PAGE, ENDPOINT } from '../../../constants';
import './styles.less';
import { NULL_TIME } from '@kalos-core/kalos-rpc/constants';
import { LocalConvenienceStoreOutlined } from '@material-ui/icons';

interface Props {
  loggedUserId: number;
}

const COLUMNS: Columns = [
  { name: 'User' },
  { name: 'Start Time' },
  { name: 'End Time' },
  { name: 'All day?' },
  { name: 'Request Type' },
  { name: 'Request Off Details' },
  { name: 'Request Class' },
];

export const ManagerTimeoffs: FC<Props> = ({ loggedUserId }) => {
  const timeoffClient = useMemo(() => new TimeoffRequestClient(ENDPOINT), []);
  const [department, setDepartment] = useState<number[]>();
  const [editing, setEditing] = useState<TimeoffRequestType>();
  const [initiated, setInitiated] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [types, setTypes] = useState<{ [key: number]: string }>({});
  const [timeoffRequests, setTimeoffRequests] = useState<TimeoffRequestType[]>(
    [],
  );
  const init = useCallback(async () => {
    try {
      let user = await UserClientService.loadUserById(loggedUserId);
      let role = user.permissionGroupsList.find(p => p.type === 'role');
      if (role) {
        if (role.name === 'Manager') {
          let department = user.permissionGroupsList.filter(
            p => p.type === 'department',
          );
          let tempDepartmentList = [];
          for (let i = 0; i < department.length; i++) {
            tempDepartmentList.push(department[i].id);
          }
          setDepartment(tempDepartmentList);
        }
      }
    } catch (e) {
      console.log(e);
      setLoaded(false);
      try {
        let tempDepartmentList = [];
        let department = (
          await TimesheetDepartmentClientService.getDepartmentByManagerID(
            loggedUserId,
          )
        ).id;
        tempDepartmentList.push(department);
        setDepartment(tempDepartmentList);
        const types = await TimeoffRequestClientService.getTimeoffRequestTypes();
        setTypes(
          types.reduce(
            (aggr, item) => ({ ...aggr, [item.id]: item.requestType }),
            {},
          ),
        );
      } catch (e) {
        setLoaded(false);
        console.log(e);
      }
    }
    setLoaded(false);
  }, [loggedUserId, setLoaded, setTypes]);
  const load = useCallback(async () => {
    if (!department) return;
    setLoading(true);
    const req = new TimeoffRequest();
    req.setPageNumber(page);
    req.setDepartmentIdList(department.join(','));
    req.setAdminApprovalDatetime(NULL_TIME);
    req.setIsActive(1);
    req.setOrderBy('time_started');
    req.setOrderDir('desc');
    const timeoffs = await timeoffClient.BatchGet(req);
    /*const timeoffs = await getTimeoffRequestByFilter({
      pageNumber: page,
      departmentCode: department.id,
      adminApprovalUserId: 0,
    });*/
    const { resultsList, totalCount } = timeoffs.toObject();
    setTimeoffRequests(resultsList);
    setCount(totalCount);
    setLoading(false);
    setLoaded(true);
  }, [
    department,
    setTimeoffRequests,
    setCount,
    setLoading,
    page,
    setLoaded,
    timeoffClient,
  ]);
  const closeAll = () => {
    handleEdit(undefined);
    setEditing(undefined);
    setInitiated(false);
  };
  useEffect(() => {
    if (!initiated) {
      setInitiated(true);
      init();
    }
    if (!loaded) {
      load();
    }
  }, [initiated, setInitiated, loaded, load, init]);
  const handleEdit = useCallback(
    (editing?: TimeoffRequestType) => () => setEditing(editing),
    [setEditing],
  );
  if (!initiated || (initiated && !department)) return null;
  const data: Data = loading
    ? makeFakeRows(7, 5)
    : timeoffRequests.map(entry => {
        const {
          userName,
          timeStarted,
          timeFinished,
          allDayOff,
          requestType,
          requestClass,
          notes,
        } = entry;
        return [
          {
            value: userName,
            onClick: handleEdit(entry),
          },
          {
            value: formatDateTime(timeStarted),
            onClick: handleEdit(entry),
          },
          {
            value: formatDateTime(timeFinished),
            onClick: handleEdit(entry),
          },
          {
            value: allDayOff ? 'Yes' : 'No',
            onClick: handleEdit(entry),
          },
          {
            value: types[requestType],
            onClick: handleEdit(entry),
          },
          {
            value: notes,
            onClick: handleEdit(entry),
          },
          {
            value: requestClass,
            onClick: handleEdit(entry),
            actions: [
              <IconButton key="edit" size="small" onClick={handleEdit(entry)}>
                <ThumbsUpDownIcon />
              </IconButton>,
            ],
          },
        ];
      });
  return (
    <Paper
      elevation={7}
      style={{
        width: '90%',
        maxHeight: 650,
        overflowY: 'scroll',
        marginBottom: 20,
      }}
    >
      <SectionBar
        title="Timeoff Approvals"
        pagination={{
          count,
          page,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: page => {
            setPage(page);
            setLoaded(false);
          },
        }}
      />
      <InfoTable data={data} columns={COLUMNS} loading={loading} hoverable />
      {editing && (
        <Modal open onClose={handleEdit(undefined)} fullScreen>
          <TimeOff
            loggedUserId={loggedUserId}
            onCancel={handleEdit(undefined)}
            userId={editing.userId}
            cancelLabel="Close"
            onAdminSubmit={() => closeAll()}
            onSaveOrDelete={() => closeAll()}
            requestOffId={editing.id}
          />
        </Modal>
      )}
    </Paper>
  );
};
