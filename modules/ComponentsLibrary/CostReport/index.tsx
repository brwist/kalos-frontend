import {
  CostReportInfo,
  CostReportInfoList,
} from '@kalos-core/kalos-rpc/compiled-protos/event_pb';
import { NULL_TIME } from '@kalos-core/kalos-rpc/constants';
import { ProjectTask } from '@kalos-core/kalos-rpc/Task';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { MEALS_RATE } from '../../../constants';
import {
  getPropertyAddress,
  formatDate,
  usd,
  getDepartmentName,
  PerDiemRowType,
  EventType,
  PerDiemType,
  ProjectTaskType,
  TaskEventType,
  TaskPriorityType,
  TaskStatusType,
  TimesheetDepartmentType,
  TimesheetLineType,
  TransactionType,
  UserType,
  loadPerDiemsLodging,
  PerDiemClientService,
  EventClientService,
  TaskClientService,
  loadProjects,
  loadTimesheetDepartments,
  UserClientService,
  loadTransactionsByEventId,
} from '../../../helpers';
import { PrintList } from '../PrintList';
import { PrintPage, Status } from '../PrintPage';
import { PrintParagraph } from '../PrintParagraph';
import { PrintTable } from '../PrintTable';

export interface Props {
  serviceCallId: number;
  loggedUserId: number;
  onClose?: () => void;
}

export type SearchType = {
  technicians: string;
  statusId: number;
  priorityId: number;
};

type ExtendedProjectTaskType = ProjectTaskType & {
  startTime: string;
  endTime: string;
};

export const CostReport: FC<Props> = ({
  serviceCallId: serviceCallIdInit,
  loggedUserId,
  onClose,
}) => {
  const [serviceCallId, setServiceCallId] = useState<number>(serviceCallIdInit);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingEvent, setLoadingEvent] = useState<boolean>(true);

  const [printStatus, setPrintStatus] = useState<Status>('idle');
  const [perDiems, setPerDiems] = useState<PerDiemType[]>([]);
  const [timesheets, setTimesheets] = useState<TimesheetLineType[]>([]);

  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [lodgings, setLodgings] = useState<{ [key: number]: number }>({});

  const [totalHoursWorked, setTotalHoursWorked] = useState<number>(0);
  const [tasks, setTasks] = useState<ProjectTaskType[]>([]);
  const [currentCheckedInTasks, setCurrentCheckedInTasks] = useState<
    ExtendedProjectTaskType[]
  >();
  const [statuses, setStatuses] = useState<TaskStatusType[]>([]);
  const [priorities, setPriorities] = useState<TaskPriorityType[]>([]);
  const [departments, setDepartments] = useState<TimesheetDepartmentType[]>([]);
  const [loadedInit, setLoadedInit] = useState<boolean>(false);
  const [event, setEvent] = useState<EventType>();
  const [projects, setProjects] = useState<EventType[]>([]);
  const [loggedUser, setLoggedUser] = useState<UserType>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [
    costReportInfoList,
    setCostReportInfoList,
  ] = useState<CostReportInfoList>();

  const totalMeals =
    perDiems.reduce((aggr, { rowsList }) => aggr + rowsList.length, 0) *
    MEALS_RATE;
  const totalLodging = perDiems
    .reduce(
      (aggr, { rowsList }) => [...aggr, ...rowsList],
      [] as PerDiemRowType[],
    )
    .filter(({ mealsOnly }) => !mealsOnly)
    .reduce((aggr, { id }) => aggr + lodgings[id], 0);
  const totalTransactions = transactions.reduce(
    (aggr, { amount }) => aggr + amount,
    0,
  );

  const loadPrintData = useCallback(async () => {
    const { resultsList } = await PerDiemClientService.loadPerDiemsByEventId(
      serviceCallId,
    );
    const lodgings = await loadPerDiemsLodging(resultsList); // first # is per diem id
    setLodgings(lodgings);
    const transactions = await loadTransactionsByEventId(serviceCallId);
    setTransactions(transactions);
    setPerDiems(resultsList);
  }, [serviceCallId, setPerDiems, setLodgings]);

  const handlePrint = useCallback(async () => {
    setPrintStatus('loading');
    await loadPrintData();
    setPrintStatus('loaded');
  }, [setPrintStatus, loadPrintData, serviceCallId]);
  const handlePrinted = useCallback(() => setPrintStatus('idle'), [
    setPrintStatus,
  ]);

  const loadEvent = useCallback(async () => {
    setLoadingEvent(true);
    //const event = await loadEventById(serviceCallId);
    const event = await EventClientService.LoadEventByServiceCallID(
      serviceCallId,
    );
    setEvent(event);
    setLoadingEvent(false);
  }, [setEvent, setLoadingEvent, serviceCallId]);

  const loadInit = useCallback(async () => {
    let promises = [];

    promises.push(
      new Promise<void>(async resolve => {
        const projects = await loadProjects();
        setProjects(projects);
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        await loadEvent();
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        const statuses = await TaskClientService.loadProjectTaskStatuses();
        setStatuses(statuses);
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        const priorities = await TaskClientService.loadProjectTaskPriorities();
        setPriorities(priorities);
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        const departments = await loadTimesheetDepartments();
        setDepartments(departments);
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        const loggedUser = await UserClientService.loadUserById(loggedUserId);
        setLoggedUser(loggedUser);
        resolve();
      }),
    );

    Promise.all(promises).then(() => {
      setLoadedInit(true);
    });
  }, [
    loadEvent,
    setProjects,
    setStatuses,
    setPriorities,
    setDepartments,
    setLoadedInit,
    loggedUserId,
    serviceCallId,
  ]);

  const load = useCallback(async () => {
    let promises = [];
    let timesheets: TimesheetLineType[] = [];

    setLoading(true);

    promises.push(
      new Promise<void>(async resolve => {
        let taskReq = new ProjectTask();
        taskReq.setCheckedIn(true);
        taskReq.setCreatorUserId(loggedUserId);
        let tasksList = await TaskClientService.BatchGetProjectTasks(taskReq);
        let tasks = tasksList.getResultsList().map(task => {
          return { ...task } as ExtendedProjectTaskType;
        });
        setCurrentCheckedInTasks(tasks);
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        await loadPrintData();
        resolve();
      }),
    );

    promises.push(
      new Promise<void>(async resolve => {
        const tasks = await EventClientService.loadProjectTasks(serviceCallId);
        setTasks(tasks);
        resolve();
      }),
    );

    // promises.push(
    //   new Promise<void>(async resolve => {
    //     let req = new CostReportInfo();
    //     req.setJobId(serviceCallId);
    //     const costReportList = await EventClientService.GetCostReportInfo(req);

    //     for await (let data of costReportList.getResultsList()) {
    //       timesheets = data.getTimesheetsList().map(line => line.toObject());
    //     }
    //     setCostReportInfoList(costReportList);

    //     resolve();
    //   }),
    // );

    promises.push(
      new Promise<void>(async resolve => {
        let req = new CostReportInfo();
        req.setJobId(serviceCallId);
        const costReportList = await EventClientService.GetCostReportInfo(req);

        for await (let data of costReportList.getResultsList()) {
          timesheets = data.getTimesheetsList().map(line => line.toObject());
        }
        setCostReportInfoList(costReportList);

        resolve();
      }),
    );

    Promise.all(promises).then(() => {
      setTimesheets(timesheets);

      let total = 0;
      timesheets.forEach(timesheet => (total = total + timesheet.hoursWorked));
      setTotalHoursWorked(total);

      setLoading(false);
    });
  }, [setLoading, serviceCallId, setTasks]);

  useEffect(() => {
    if (!loadedInit) {
      loadInit();
    }
    if (loadedInit && !loaded) {
      setLoaded(true);
      load();
    }
  }, [loadedInit, loadInit, loaded, setLoaded, load]);

  return (
    <PrintPage
      buttonProps={{
        label: 'Print Cost Report',
        disabled: loading || loadingEvent || printStatus === 'loading',
      }}
      downloadLabel="Download Cost Report"
      downloadPdfFilename="Cost-Report"
      headerProps={{ title: 'Project Cost Report' }}
      onPrint={handlePrint}
      onPrinted={handlePrinted}
      status={printStatus}
      key={printStatus}
      className="EditProjectAsideContent"
    >
      <PrintParagraph tag="h2">Project Details</PrintParagraph>
      {event && (
        <PrintList
          items={[
            <>
              <strong>Address: </strong>
              {getPropertyAddress(event.property)}
            </>,
            <>
              <strong>Start Date: </strong>
              {formatDate(event.dateStarted)}
            </>,
            <>
              <strong>End Date: </strong>
              {formatDate(event.dateEnded)}
            </>,
            <>
              <strong>Job Number: </strong>
              {event.logJobNumber}
            </>,
          ]}
        />
      )}
      <PrintParagraph tag="h2">Summary Info</PrintParagraph>
      <PrintTable
        columns={[
          { title: 'Type', align: 'left' },
          { title: 'Total', align: 'right' },
        ]}
        data={[
          [
            'Total Hours Worked',
            totalHoursWorked > 1
              ? `${totalHoursWorked} hrs`
              : totalHoursWorked == 0
              ? 'None'
              : `${totalHoursWorked} hr`,
          ],
        ]}
      />
      <PrintParagraph tag="h2">Costs</PrintParagraph>
      <PrintTable
        columns={[
          { title: 'Type', align: 'left' },
          { title: 'Cost', align: 'right' },
        ]}
        data={[
          ['Transactions', usd(totalTransactions)],
          ['Meals', usd(totalMeals)],
          ['Lodging', usd(totalLodging)],
          [
            '',
            <strong>
              TOTAL: {usd(totalMeals + totalLodging + totalTransactions)}
            </strong>,
          ],
        ]}
      />
      <PrintParagraph tag="h2">Transactions</PrintParagraph>
      <PrintTable
        columns={[
          {
            title: 'Department',
            align: 'left',
          },
          {
            title: 'Owner',
            align: 'left',
            widthPercentage: 10,
          },
          {
            title: 'Cost Center / Vendor',
            align: 'left',
            widthPercentage: 10,
          },
          {
            title: 'Date',
            align: 'left',
            widthPercentage: 10,
          },
          {
            title: 'Amount',
            align: 'left',
            widthPercentage: 10,
          },
          {
            title: 'Notes',
            align: 'right',
            widthPercentage: 20,
          },
        ]}
        data={transactions.map(
          ({
            department,
            ownerName,
            amount,
            notes,
            costCenter,
            timestamp,
            vendor,
          }) => {
            return [
              department ? (
                <>
                  {department.classification} - {department.description}
                </>
              ) : (
                '-'
              ),
              ownerName,
              <>
                {`${costCenter?.description}` + ' - '}
                <br />
                {vendor}
              </>,
              formatDate(timestamp),
              usd(amount),
              notes,
            ];
          },
        )}
      />
      <PrintParagraph tag="h2">Per Diem</PrintParagraph>
      {perDiems
        .sort((a, b) => (a.dateSubmitted > b.dateSubmitted ? -1 : 1))
        .map(
          ({
            id,
            department,
            ownerName,
            dateSubmitted,
            approvedByName,
            dateApproved,
            notes,
            rowsList,
          }) => {
            const totalMeals = MEALS_RATE * rowsList.length;
            const totalLodging = rowsList.reduce(
              (aggr, { id, mealsOnly }) =>
                aggr + (mealsOnly ? 0 : lodgings[id]),
              0,
            );
            if (totalMeals == 0 && totalLodging == 0) {
              return <></>; // Don't show it
            }
            return (
              <div key={id}>
                <PrintParagraph tag="h3">
                  Per Diem{' '}
                  {dateSubmitted.split(' ')[0] != NULL_TIME.split(' ')[0]
                    ? '-'
                    : ''}{' '}
                  {dateSubmitted.split(' ')[0] != NULL_TIME.split(' ')[0]
                    ? dateSubmitted.split(' ')[0]
                    : ''}{' '}
                  {ownerName ? '-' : ''} {ownerName}
                </PrintParagraph>
                <div
                  style={{
                    breakInside: 'avoid',
                    display: 'inline-block',
                    width: '100%',
                  }}
                >
                  <PrintTable
                    columns={[
                      {
                        title: 'Department',
                        align: 'left',
                      },
                      {
                        title: 'Owner',
                        align: 'left',
                        widthPercentage: 10,
                      },
                      {
                        title: 'Submitted At',
                        align: 'left',
                        widthPercentage: 10,
                      },
                      {
                        title: 'Approved By',
                        align: 'left',
                        widthPercentage: 10,
                      },
                      {
                        title: 'Approved At',
                        align: 'left',
                        widthPercentage: 10,
                      },
                      {
                        title: 'Total Meals',
                        align: 'left',
                        widthPercentage: 10,
                      },
                      {
                        title: 'Total Lodging',
                        align: 'left',
                        widthPercentage: 10,
                      },
                      {
                        title: 'Notes',
                        align: 'right',
                        widthPercentage: 20,
                      },
                    ]}
                    data={[
                      [
                        getDepartmentName(department),
                        ownerName,
                        dateSubmitted != NULL_TIME
                          ? formatDate(dateSubmitted)
                          : '-' || '-',
                        approvedByName || '-',
                        dateApproved != NULL_TIME
                          ? formatDate(dateApproved)
                          : '-' || '-',
                        usd(totalMeals),
                        totalLodging != 0 ? usd(totalLodging) : '-',
                        notes,
                      ],
                    ]}
                  />
                </div>
                <PrintParagraph tag="h4">Per Diem Days</PrintParagraph>
                <div
                  style={{
                    breakInside: 'avoid',
                    display: 'inline-block',
                    width: '100%',
                  }}
                >
                  <PrintTable
                    columns={[
                      {
                        title: 'Date',
                        align: 'left',
                      },
                      {
                        title: 'Zip Code',
                        align: 'left',
                        widthPercentage: 10,
                      },
                      {
                        title: 'Meals Only',
                        align: 'left',
                        widthPercentage: 10,
                      },
                      {
                        title: 'Meals',
                        align: 'left',
                        widthPercentage: 10,
                      },
                      {
                        title: 'Lodging',
                        align: 'left',
                        widthPercentage: 10,
                      },
                      {
                        title: 'Notes',
                        align: 'right',
                        widthPercentage: 20,
                      },
                    ]}
                    data={rowsList.map(
                      ({
                        id,
                        dateString,
                        zipCode,
                        mealsOnly,
                        notes,
                        perDiemId,
                      }) => {
                        return [
                          formatDate(dateString),
                          zipCode,
                          mealsOnly ? 'Yes' : 'No',
                          usd(MEALS_RATE),
                          lodgings[id] ? usd(lodgings[id]) : '-',
                          notes,
                        ];
                      },
                    )}
                  />
                </div>
              </div>
            );
          },
        )}
      <PrintParagraph tag="h2">Timesheet Lines</PrintParagraph>
      {timesheets.map(
        ({
          id,
          departmentName,
          timeStarted,
          timeFinished,
          adminApprovalUserName,
          notes,
          briefDescription,
          technicianUserName,
          technicianUserId,
          hoursWorked,
        }) => {
          return (
            <div key={id}>
              <PrintTable
                columns={[
                  {
                    title: 'Technician',
                    align: 'left',
                  },
                  {
                    title: 'Department',
                    align: 'left',
                    widthPercentage: 10,
                  },
                  {
                    title: 'Approved By',
                    align: 'left',
                    widthPercentage: 10,
                  },
                  {
                    title: 'Time Started',
                    align: 'left',
                    widthPercentage: 10,
                  },
                  {
                    title: 'Time Finished',
                    align: 'left',
                    widthPercentage: 10,
                  },
                  {
                    title: 'Brief Description',
                    align: 'left',
                    widthPercentage: 10,
                  },
                  {
                    title: 'Hours Worked',
                    align: 'left',
                    widthPercentage: 10,
                  },
                  {
                    title: 'Notes',
                    align: 'right',
                    widthPercentage: 20,
                  },
                ]}
                data={[
                  [
                    technicianUserName + ` (${technicianUserId})`,
                    departmentName,
                    adminApprovalUserName,
                    formatDate(timeStarted) || '-',
                    formatDate(timeFinished) || '-',
                    briefDescription,
                    hoursWorked != 0
                      ? hoursWorked > 1
                        ? `${hoursWorked} hrs`
                        : `${hoursWorked} hr`
                      : '-',
                    notes,
                  ],
                ]}
              />
            </div>
          );
        },
      )}
    </PrintPage>
  );
};
