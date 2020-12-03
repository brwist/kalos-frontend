import React, { FC, useState, useEffect, useCallback } from 'react';
import { SectionBar } from '../SectionBar';
import { InfoTable, Columns, Data } from '../InfoTable';
import { TimeOff } from '../TimeOff';
import { Modal } from '../Modal';
import {
  getDepartmentByManagerID,
  TimesheetDepartmentType,
  getTimeoffRequestByFilter,
  TimeoffRequestType,
  formatDateTime,
  getTimeoffRequestTypes,
  makeFakeRows,
} from '../../../helpers';
import { ROWS_PER_PAGE } from '../../../constants';
import './styles.less';

interface Props {
  loggedUserId: number;
}

const COLUMNS: Columns = [
  {
    name: 'User',
  },
  {
    name: 'Start Time',
  },
  {
    name: 'End Time',
  },
  {
    name: 'All day?',
  },
  {
    name: 'Request Type',
  },
  {
    name: 'Request Off Details',
  },
  {
    name: 'Request Class',
  },
];

export const ManagerTimeoffs: FC<Props> = ({ loggedUserId }) => {
  const [department, setDepartment] = useState<TimesheetDepartmentType>();
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
      const department = await getDepartmentByManagerID(loggedUserId);
      setDepartment(department);
      const types = await getTimeoffRequestTypes();
      setTypes(
        types.reduce(
          (aggr, item) => ({ ...aggr, [item.id]: item.requestType }),
          {},
        ),
      );
      setLoaded(false);
    } catch (e) {}
  }, [loggedUserId, setLoaded, setTypes]);
  const load = useCallback(async () => {
    // if (!initiated) {
    //   await init();
    // }
    if (!department) return;
    setLoading(true);
    const timeoffs = await getTimeoffRequestByFilter({
      pageNumber: page,
      departmentCode: department.id,
      //   adminApprovalUserId: 0,
    });
    const { resultsList, totalCount } = timeoffs.toObject();
    setTimeoffRequests(resultsList);
    setCount(totalCount);
    setLoading(false);
    setLoaded(true);
  }, [
    // initiated,
    // init,
    department,
    setTimeoffRequests,
    setCount,
    setInitiated,
    setLoading,
    page,
    setLoaded,
  ]);
  useEffect(() => {
    if (!initiated) {
      setInitiated(true);
      init();
    }
    if (!loaded) {
      load();
    }
  }, [initiated, setInitiated, loaded, load]);
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
          { value: formatDateTime(timeStarted) },
          { value: formatDateTime(timeFinished) },
          { value: allDayOff ? 'Yes' : 'No' },
          { value: types[requestType] },
          { value: notes },
          { value: requestClass },
        ];
      });
  return (
    <div>
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
      <InfoTable data={data} columns={COLUMNS} loading={loading} />
      {editing && (
        <Modal open onClose={handleEdit(undefined)} fullScreen>
          <TimeOff
            loggedUserId={loggedUserId}
            onCancel={handleEdit(undefined)}
            userId={editing.userId}
            cancelLabel="Close"
            onAdminSubmit={() => setLoading(false)}
            onSaveOrDelete={() => setLoaded(false)}
            requestOffId={editing.id}
          />
        </Modal>
      )}
    </div>
  );
};
