import React, { FC, useState, useEffect, useCallback } from 'react';
import {
  TimesheetLine,
  TimesheetLineClient,
  TimesheetLineList,
} from '@kalos-core/kalos-rpc/TimesheetLine';
import { SectionBar } from '../SectionBar';
import { ENDPOINT, NULL_TIME } from '../../../constants';
import { SpiffToolAdminAction } from '@kalos-core/kalos-rpc/SpiffToolAdminAction';
import { TaskClient, Task } from '@kalos-core/kalos-rpc/Task';
import {
  differenceInMinutes,
  parseISO,
  differenceInCalendarDays,
  subDays,
  addDays,
  startOfWeek,
  format,
  getMonth,
  getYear,
  getDaysInMonth,
} from 'date-fns';
import {
  roundNumber,
  loadTimeoffRequests,
  formatDate,
  TaskClientService,
  UserClientService,
  TimeoffRequestClientService,
} from '../../../helpers';
interface Props {
  userId: number;
  loggedUserId: number;
  notReady: boolean;
  onClose: (() => void) | null;
  username: string;
}
import { Button } from '../Button';
import CheckIcon from '@material-ui/icons/Check';
import IconButton from '@material-ui/core/IconButton';
import { PerDiem, PerDiemClient } from '@kalos-core/kalos-rpc/PerDiem';
import { TimeoffRequest } from '@kalos-core/kalos-rpc/TimeoffRequest';
import { InfoTable } from '../InfoTable';
import { Loader } from '../../Loader/main';
export const CostSummary: FC<Props> = ({
  userId,
  loggedUserId,
  notReady,
  onClose,
  username,
}) => {
  const [totalHours, setTotalHours] = useState<number>();
  const [timesheets, setTimesheets] = useState<TimesheetLine[]>();
  const [totalSpiffs, setTotalSpiffs] = useState<number>();
  const [spiffs, setSpiffs] = useState<Task[]>();
  const [totalTools, setTotalTools] = useState<number>();
  const [tools, setTools] = useState<Task[]>();
  const [totalPTO, setTotalPTO] = useState<number>();
  const [pto, setPTO] = useState<TimeoffRequest.AsObject[]>();
  const [totalPerDiem, setTotalDiem] = useState<number>();
  const [perDiems, setPerDiems] = useState<PerDiem[]>();
  const [loading, setLoading] = useState<boolean>();
  const [loaded, setLoaded] = useState<boolean>();
  const [today, setToday] = useState<Date>(new Date());
  const [toolFund, setToolFund] = useState<number>(0);
  const [startDay, setStartDay] = useState<Date>(
    startOfWeek(subDays(today, 7), { weekStartsOn: 6 }),
  );
  const [endDay, setEndDay] = useState<Date>(addDays(startDay, 6));
  const getPerDiemTotals = useCallback(async () => {
    const perdiemReq = new PerDiem();
    perdiemReq.setIsActive(true);
    perdiemReq.setPayrollProcessed(false);

    if (notReady) {
      //PerDiems that have been created, but not approved
      perdiemReq.setDateSubmitted(NULL_TIME);
      perdiemReq.setNotEqualsList(['DateSubmitted']);
      perdiemReq.setFieldMaskList(['ApprovedById']);
    } else {
      //Approved Perdiems that have not been Processed Yet
      perdiemReq.setNotEqualsList(['ApprovedById']);
    }
    const pdClient = new PerDiemClient(ENDPOINT);
    let results = (await pdClient.BatchGet(perdiemReq)).getResultsList();
    setPerDiems(results);
  }, [notReady]);
  const getSpiffToolTotals = useCallback(
    async (spiffType: string) => {
      const req = new Task();
      const action = new SpiffToolAdminAction();
      req.setPayrollProcessed(false);
      req.setCreatorUserId(userId);
      if (spiffType === 'Spiff') {
        const startDate = format(startDay, 'yyyy-MM-dd');
        const endDate = format(endDay, 'yyyy-MM-dd');
        req.setDateRangeList(['>=', startDate, '<', endDate]);
      } else {
        const startMonth = getMonth(startDay) - 1;
        const startYear = getYear(startDay);
        const startDate = format(new Date(startYear, startMonth), 'yyy-MM-dd');
        const endDate = format(
          addDays(
            new Date(startYear, startMonth),
            getDaysInMonth(new Date(startYear, startMonth)) - 1,
          ),
          'yyy-MM-dd',
        );
        req.setDateRangeList(['>=', startDate, '<', endDate]);
      }
      if (!notReady) {
        action.setStatus(1);
        req.setSearchAction(action);
        req.setFieldMaskList(['PayrollProcessed']);
      }
      if (notReady) {
        req.setFieldMaskList(['AdminActionId', 'PayrollProcessed']);
      }
      if (spiffType == 'Spiff') {
        req.setBillableType('Spiff');
      } else {
        req.setBillableType('Tool Purchase');
      }
      const results = (
        await new TaskClient(ENDPOINT).BatchGet(req)
      ).getResultsList();
      let spiffTotal = 0;
      let toolTotal = 0;
      for (let i = 0; i < results.length; i++) {
        if (spiffType == 'Spiff') {
          spiffTotal += results[i].toObject().spiffAmount;
        } else {
          toolTotal += results[i].toObject().toolpurchaseCost;
        }
      }
      if (spiffType === 'Spiff') {
        setSpiffs(results);
        return spiffTotal;
      } else {
        setTools(results);
        return toolTotal;
      }
    },
    [notReady, userId, endDay, startDay],
  );

  const getTimeoffTotals = useCallback(async () => {
    const startDate = format(startDay, 'yyyy-MM-dd');
    const endDate = format(endDay, 'yyyy-MM-dd');
    const filter = {
      technicianUserID: userId,
      requestType: notReady ? 10 : 9,
      startDate: startDate,
      endDate: endDate,
    };
    const results = (await loadTimeoffRequests(filter)).resultsList;
    let total = 0;
    for (let i = 0; i < results.length; i++) {
      if (results[i].allDayOff === 0) {
        const timeFinished = results[i].timeFinished;
        const timeStarted = results[i].timeStarted;
        const subtotal = roundNumber(
          differenceInMinutes(parseISO(timeFinished), parseISO(timeStarted)) /
            60,
        );

        total += subtotal;
      } else {
        const timeFinished = results[i].timeFinished;
        const timeStarted = results[i].timeStarted;
        const numberOfDays =
          differenceInCalendarDays(
            parseISO(timeFinished),
            parseISO(timeStarted),
          ) + 1;
        total += numberOfDays * 8;
      }
    }
    setPTO(results);
    return total;
  }, [userId, notReady]);
  const toggleProcessTimeoff = async (pt: TimeoffRequest.AsObject) => {
    pt.payrollProcessed = true;
    const { id } = pt;
    const req = new TimeoffRequest();
    req.setId(id);
    req.setFieldMaskList(['PayrollProcessed']);
    req.setPayrollProcessed(true);
    await TimeoffRequestClientService.Update(req);
  };
  const toggleProcessSpiffTool = async (spiffTool: Task.AsObject) => {
    spiffTool.payrollProcessed = true;
    const { id } = spiffTool;
    const req = new Task();
    req.setId(id);
    req.setFieldMaskList(['PayrollProcessed']);
    req.setPayrollProcessed(true);
    await TaskClientService.Update(req);
  };
  const load = useCallback(async () => {
    setLoading(true);
    const user = await UserClientService.loadUserById(userId);
    setToolFund(user.toolFund);
    let promises = [];

    promises.push(
      new Promise<void>(async resolve => {
        setTotalPTO(await getTimeoffTotals());
        resolve();
      }),
    );
    promises.push(
      new Promise<void>(async resolve => {
        setTotalTools(await getSpiffToolTotals('Tool Purchase'));
        resolve();
      }),
    );
    promises.push(
      new Promise<void>(async resolve => {
        setTotalSpiffs(await getSpiffToolTotals('Spiff'));
        resolve();
      }),
    );

    Promise.all(promises)
      .then(() => {
        setLoading(false);
        setLoaded(true);
      })
      .catch(error => {
        console.log(error);
      });
  }, [getTimeoffTotals, getSpiffToolTotals, userId]);
  useEffect(() => {
    if (!loaded) load();
  }, [load, loaded]);
  return loaded ? (
    <div>
      {/* for the PTO*/}
      {onClose ? <Button label="Close" onClick={() => onClose()}></Button> : []}
      <SectionBar title="PTO Current Total">
        <InfoTable
          columns={[
            { name: 'Date Started-Date Ended' },
            { name: 'Hours' },
            { name: 'Additional Info' },
          ]}
          data={pto!.map(pt => {
            return [
              {
                value:
                  formatDate(pt.timeStarted) +
                  ' to ' +
                  formatDate(pt.timeFinished),
              },
              {
                value:
                  pt.allDayOff === 0
                    ? roundNumber(
                        differenceInMinutes(
                          parseISO(pt.timeFinished),
                          parseISO(pt.timeStarted),
                        ) / 60,
                      )
                    : 8 *
                      (differenceInCalendarDays(
                        parseISO(pt.timeFinished),
                        parseISO(pt.timeStarted),
                      ) +
                        1),
              },
              {
                value: pt.notes,
                actions:
                  pt.payrollProcessed === false && pt.adminApprovalUserId != 0
                    ? [
                        <IconButton
                          key="process"
                          size="small"
                          onClick={() => toggleProcessTimeoff(pt)}
                        >
                          <CheckIcon />
                        </IconButton>,
                      ]
                    : [],
              },
            ];
          })}
        ></InfoTable>
        <strong>Total PTO Hours: {totalPTO}</strong>
        {/*For spiffs*/}
      </SectionBar>
      <SectionBar title="Spiff Current Total">
        <InfoTable
          columns={[
            { name: 'Date Created' },
            { name: 'Amount' },
            { name: 'Job Number' },
            { name: 'Additional Info' },
          ]}
          data={spiffs!.map(spiff => {
            return [
              {
                value: formatDate(spiff.toObject().timeCreated),
              },
              {
                value: spiff.toObject().spiffAmount,
              },
              {
                value: spiff.toObject().spiffJobNumber,
              },
              {
                value: spiff.toObject().briefDescription,
                actions:
                  spiff.toObject().payrollProcessed === false &&
                  spiff.toObject().adminActionId != 0
                    ? [
                        <IconButton
                          key="process"
                          size="small"
                          onClick={() =>
                            toggleProcessSpiffTool(spiff.toObject())
                          }
                        >
                          <CheckIcon />
                        </IconButton>,
                      ]
                    : [],
              },
            ];
          })}
        ></InfoTable>
        <strong>Spiff Total:{totalSpiffs}</strong>
      </SectionBar>
      {/*For Tools*/}
      <SectionBar title="Tool Current Total">
        <InfoTable
          columns={[
            { name: 'Date Created' },
            { name: 'Date Approved' },
            { name: 'Amount' },
            { name: 'Additional Info' },
          ]}
          data={tools!.map(tool => {
            return [
              {
                value: formatDate(tool.toObject().toolpurchaseDate),
              },
              {
                value: tool.toObject().searchAction?.reviewedBy,
              },
              {
                value: tool.toObject().toolpurchaseCost,
              },
              {
                value: tool.toObject().briefDescription,
                actions:
                  tool.toObject().payrollProcessed === false &&
                  tool.toObject().adminActionId != 0
                    ? [
                        <IconButton
                          key="process"
                          size="small"
                          onClick={() =>
                            toggleProcessSpiffTool(tool.toObject())
                          }
                        >
                          <CheckIcon />
                        </IconButton>,
                      ]
                    : [],
              },
            ];
          })}
        ></InfoTable>
        <strong>Tool Fund:{toolFund} </strong>
        <div></div>
        <strong>Total Purchases for the Month:{totalTools}</strong>
        <div></div>
        <strong>
          Absolute Total:
          {toolFund - (totalTools === undefined ? 0 : totalTools)}
        </strong>
      </SectionBar>
    </div>
  ) : (
    <Loader />
  );
};
