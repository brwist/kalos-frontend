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
import { differenceInMinutes, parseISO } from 'date-fns';
import { roundNumber, loadTimeoffRequests, formatDate } from '../../../helpers';
interface Props {
  userId: number;
  loggedUserId: number;
  notReady: boolean;
  onClose: (() => void) | null;
  username: string;
}
type Entry = {
  timesheetTotal: number | undefined;
  timeoffTotal: number | undefined;
  toolTotal: number | undefined;
  spiffTotal: number | undefined;
};
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
    [notReady, userId],
  );
  const getTimesheetTotals = useCallback(async () => {
    const timesheetReq = new TimesheetLine();
    timesheetReq.setTechnicianUserId(userId);
    timesheetReq.setIsActive(1);
    const client = new TimesheetLineClient(ENDPOINT);
    let results = new TimesheetLineList().getResultsList();
    timesheetReq.setWithoutLimit(true);

    if (notReady) {
      timesheetReq.setUserApprovalDatetime(NULL_TIME);
      timesheetReq.setNotEqualsList(['UserApprovalDatetime']);
      timesheetReq.setFieldMaskList([
        'PayrollProcessed',
        'AdminApprovalUserId',
      ]);

      results = (await client.BatchGetManager(timesheetReq)).getResultsList();
    } else {
      timesheetReq.setNotEqualsList(['AdminApprovalUserId']);
      timesheetReq.setFieldMaskList(['PayrollProcessed']);
      results = (await client.BatchGetPayroll(timesheetReq)).getResultsList();
    }

    setTimesheets(results);
    let total = 0;
    for (let i = 0; i < results.length; i++) {
      const timeFinished = results[i].toObject().timeFinished;
      const timeStarted = results[i].toObject().timeStarted;
      const subtotal = roundNumber(
        differenceInMinutes(parseISO(timeFinished), parseISO(timeStarted)) / 60,
      );
      total += subtotal;
    }
    return total;
  }, [notReady, userId]);

  const getTimeoffTotals = useCallback(async () => {
    const filter = {
      technicianUserID: userId,
      requestType: notReady ? 10 : 9,
    };
    const results = (await loadTimeoffRequests(filter)).resultsList;
    let total = 0;
    for (let i = 0; i < results.length; i++) {
      console.log(results[i].allDayOff);
      if (results[i].allDayOff === 0) {
        const timeFinished = results[i].timeFinished;
        const timeStarted = results[i].timeStarted;
        const subtotal = roundNumber(
          differenceInMinutes(parseISO(timeFinished), parseISO(timeStarted)) /
            60,
        );

        total += subtotal;
      } else {
        total += 8;
      }
    }
    setPTO(results);
    return total;
  }, [userId, notReady]);

  const load = useCallback(async () => {
    setLoading(true);

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

    Promise.all(promises).then(() => {
      setLoading(false);
      setLoaded(true);
    });
  }, [
    getTimesheetTotals,
    getTimeoffTotals,
    getSpiffToolTotals,
    totalPTO,
    totalTools,
    totalSpiffs,
  ]);
  useEffect(() => {
    if (!loaded) load();
  }, [load]);
  return loaded ? (
    <div>
      {/* for the PTO*/}
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
                value: roundNumber(
                  differenceInMinutes(
                    parseISO(pt.timeFinished),
                    parseISO(pt.timeStarted),
                  ) / 60,
                ),
              },
              {
                value: pt.notes,
              },
            ];
          })}
        ></InfoTable>
      </SectionBar>
      <SectionBar title="Spiff Current Total">
        <InfoTable
          columns={[
            { name: 'Date Created' },
            { name: 'Date Approved' },
            { name: 'Amount' },
            { name: 'Additional Info' },
          ]}
          data={spiffs!.map(spiff => {
            return [
              {
                value: formatDate(spiff.toObject().timeCreated),
              },
              {
                value: spiff.toObject().searchAction?.reviewedBy,
              },
              {
                value: spiff.toObject().spiffAmount,
              },
              {
                value: spiff.toObject().briefDescription,
              },
            ];
          })}
        ></InfoTable>
      </SectionBar>
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
              },
            ];
          })}
        ></InfoTable>
      </SectionBar>
    </div>
  ) : (
    <Loader />
  );
};
