import React, { FC, useState, useEffect, useCallback } from 'react';
import {
  TimesheetLine,
  TimesheetLineClient,
  TimesheetLineList,
} from '@kalos-core/kalos-rpc/TimesheetLine';
import { Form, Schema } from '../../Form';
import { Timesheet } from '../../../Timesheet/main';
import { ENDPOINT, NULL_TIME } from '../../../../constants';
import { SpiffToolAdminAction } from '@kalos-core/kalos-rpc/SpiffToolAdminAction';
import { TaskClient, Task } from '@kalos-core/kalos-rpc/Task';
import { result } from 'lodash';
import { SectionBar } from '../../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../../ComponentsLibrary/InfoTable';
import { format, differenceInMinutes, parseISO } from 'date-fns';
import {
  perDiemTripMilesToUsdAsNumber,
  roundNumber,
  loadTimeoffRequests,
  GetTimesheetConfig,
  TaskClientService,
  makeFakeRows,
} from '../../../../helpers';
interface Props {
  userId: number;
  loggedUserId: number;
  notReady: boolean;
  onClose: (() => void) | null;
  username: string;
}

import { PerDiem, PerDiemClient } from '@kalos-core/kalos-rpc/PerDiem';
import { notStrictEqual } from 'assert';
import { TimeoffRequest } from '@kalos-core/kalos-rpc/TimeoffRequest';
export const TimesheetSummary: FC<Props> = ({
  userId,
  loggedUserId,
  notReady,
  onClose,
  username,
}) => {
  const [totalHours, setTotalHours] = useState<number[]>();
  const [classCodes, setClassCodes] = useState<string[]>();
  const [timesheets, setTimesheets] = useState<TimesheetLine[]>();
  const [totalPTO, setTotalPTO] = useState<number>();
  const [pto, setPTO] = useState<TimeoffRequest.AsObject[]>();
  const [loading, setLoading] = useState<boolean>();
  const [loaded, setLoaded] = useState<boolean>();
  const [mappedElements, setMappedElments] = useState<JSX.Element>();
  const getTimesheetTotals = useCallback(async () => {
    const timesheetReq = new TimesheetLine();
    timesheetReq.setTechnicianUserId(userId);
    timesheetReq.setIsActive(1);
    const client = new TimesheetLineClient(ENDPOINT);
    let results = new TimesheetLineList().getResultsList();

    if (notReady) {
      timesheetReq.setUserApprovalDatetime(NULL_TIME);
      timesheetReq.setNotEqualsList(['UserApprovalDatetime']);
      timesheetReq.setFieldMaskList([
        'PayrollProcessed',
        'AdminApprovalUserId',
      ]);

      results = (await client.BatchGetManager(timesheetReq)).getResultsList();
    } else {
      timesheetReq.setAdminApprovalUserId(0);
      timesheetReq.setNotEqualsList(['AdminApprovalUserId']);
      timesheetReq.setFieldMaskList(['PayrollProcessed']);
      results = (await client.BatchGetPayroll(timesheetReq)).getResultsList();
    }
    setTimesheets(results);
    let subtotal = 0;
    let codeList = [];
    let subtotals = [];
    for (let i = 0; i < results.length; i++) {
      const timeFinished = results[i].toObject().timeFinished;
      const timeStarted = results[i].toObject().timeStarted;
      let code = '';
      if (results[i].toObject().classCode) {
        code =
          results[i].toObject().classCode?.classcodeId.toString() +
          '-' +
          results[i].toObject().classCode?.description;
      }
      const subtotal = roundNumber(
        differenceInMinutes(parseISO(timeFinished), parseISO(timeStarted)) / 60,
      );
      if (code) {
        const indexFound = codeList.indexOf(code);
        if (indexFound != -1) {
          subtotals[indexFound] += subtotal;
        } else {
          codeList.push(code);
          subtotals.push(subtotal);
        }
      }
    }
    setTotalHours(subtotals);
    setClassCodes(codeList);
  }, [notReady, userId]);

  const getTimeoffTotals = useCallback(async () => {
    const filter = {
      technicianUserID: userId,
      requestType: notReady ? 10 : 9,
    };
    const results = (await loadTimeoffRequests(filter)).resultsList;
    let total = 0;
    for (let i = 0; i < results.length; i++) {
      const timeFinished = results[i].timeFinished;
      const timeStarted = results[i].timeStarted;
      const subtotal = roundNumber(
        differenceInMinutes(parseISO(timeFinished), parseISO(timeStarted)) / 60,
      );
      total += subtotal;
    }
    setPTO(results);
    return total;
  }, [userId, notReady]);

  const load = useCallback(async () => {
    setLoading(true);
    await getTimesheetTotals();
    setTotalPTO(await getTimeoffTotals());
    if (
      totalPTO !== undefined &&
      totalHours != undefined &&
      classCodes != undefined
    ) {
      setLoading(false);
      setLoaded(true);
      const mappedElements = (
        <InfoTable
          columns={[{ name: 'Class Code' }, { name: 'Total Hours' }]}
          loading={loading}
          data={
            loading
              ? makeFakeRows(2, 2)
              : classCodes.map(code => {
                  return [
                    {
                      value: code,
                    },
                    {
                      value: totalHours[classCodes.indexOf(code)],
                    },
                  ];
                })
          }
        />
      );
      setMappedElments(mappedElements);
    }
  }, [
    getTimeoffTotals,
    getTimesheetTotals,
    totalHours,
    totalPTO,
    classCodes,
    loading,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  return loaded ? (
    <div>{mappedElements}</div>
  ) : (
    <React.Fragment></React.Fragment>
  );
};
