import React, {
  FC,
  useEffect,
  useState,
  useCallback,
  CSSProperties,
  useMemo,
  useReducer,
} from 'react';
import {
  differenceInMinutes,
  parseISO,
  differenceInHours,
  differenceInCalendarYears,
  differenceInBusinessDays,
  addYears,
  format,
} from 'date-fns';
import { Form, Schema, Options } from '../Form';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { ConfirmDelete } from '../ConfirmDelete';
import { Alert } from '../Alert';
import { reducer, ACTIONS } from './reducer';
import {
  roundNumber,
  timestamp,
  formatDate,
  UserClientService,
  TimeoffRequestClientService,
  makeSafeFormObject,
  TimesheetLineClientService,
  ActivityLogClientService,
  TimesheetDepartmentClientService,
} from '../../../helpers';
import { OPTION_BLANK, ENDPOINT } from '../../../constants';
import { EmailClient, EmailConfig } from '../../../@kalos-core/kalos-rpc/Email';
import { User } from '../../../@kalos-core/kalos-rpc/User';
import {
  PTO,
  TimeoffRequest,
} from '../../../@kalos-core/kalos-rpc/TimeoffRequest';
import { datePickerDefaultProps } from '@material-ui/pickers/constants/prop-types';
import { ActivityLog } from '../../../@kalos-core/kalos-rpc/ActivityLog';
import { InfoTable } from '../InfoTable';
import { TimesheetDepartment } from '../../../@kalos-core/kalos-rpc/TimesheetDepartment';
import { TimeoffRequestType } from '../../../@kalos-core/kalos-rpc/compiled-protos/timeoff_request_pb';
export interface Props {
  loggedUserId: number;
  userId?: number;
  requestOffId?: number;
  onCancel: () => void;
  onSaveOrDelete: (data: TimeoffRequest) => void;
  onAdminSubmit?: (data: TimeoffRequest) => void;
  cancelLabel?: string;
  submitDisabled?: boolean;
}

export const TimeOff: FC<Props> = ({
  loggedUserId,
  userId,
  onCancel,
  onSaveOrDelete,
  onAdminSubmit,
  requestOffId,
  cancelLabel,
  submitDisabled,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    initiated: false,
    deleting: false,
    deleted: false,
    saving: false,
    typeOptions: [],
    requestTypes: [],
    pto: undefined,
    user: undefined,
    openAlert: false,
    alertDismissed: false,
    ptoHistory: [],
    loggedUser: undefined,
    departments: [],
    logData: [],
    upcomingRequests: [],
    formKey: 0,
    error: '',
    data: new TimeoffRequest(),
  });

  const setSafeData = (data: TimeoffRequest) => {
    const temp = makeSafeFormObject(data, new TimeoffRequest());
    if (temp.getRequestType() === 9) {
      if (state.pto && state.user) {
        let hourDiff = 0;
        if (
          temp.getAllDayOff() === 1 &&
          temp.getTimeStarted() &&
          temp.getTimeFinished()
        ) {
          const date1 = new Date(parseISO(temp.getTimeStarted()));
          const date2 = new Date(parseISO(temp.getTimeFinished()));

          hourDiff = (differenceInBusinessDays(date2, date1) + 1) * 8;
        } else if (
          temp.getAllDayOff() != 1 &&
          temp.getTimeStarted() &&
          temp.getTimeFinished()
        ) {
          const date1 = new Date(parseISO(temp.getTimeStarted()));
          const date2 = new Date(parseISO(temp.getTimeFinished()));
          hourDiff = differenceInHours(date2, date1);
        }
        if (hourDiff > state.pto.getHoursAvailable()) {
          dispatch({ type: ACTIONS.SET_OPEN_ALERT, data: true });
        } else {
          //we should reset it, if they created one that one was, but then incorrect
          dispatch({ type: ACTIONS.SET_ALERT_DISMISSED, data: false });

          dispatch({ type: ACTIONS.SET_OPEN_ALERT, data: false });
        }
      }
    } else {
      dispatch({ type: ACTIONS.SET_ALERT_DISMISSED, data: false });
      dispatch({ type: ACTIONS.SET_OPEN_ALERT, data: false });
    }
    dispatch({ type: ACTIONS.SET_DATA, data: temp });
  };
  const handleCloseAlert = () => {
    dispatch({ type: ACTIONS.SET_ALERT_DISMISSED, data: true });

    dispatch({ type: ACTIONS.SET_OPEN_ALERT, data: false });
  };
  const emailClient = useMemo(() => new EmailClient(ENDPOINT), []);
  const init = useCallback(async () => {
    console.log('called init');
    const timesheetAdminReq = new TimesheetDepartment();
    timesheetAdminReq.setIsActive(1);
    const timesheetAdminResults =
      await TimesheetDepartmentClientService.BatchGet(timesheetAdminReq);
    dispatch({
      type: ACTIONS.SET_DEPARTMENTS,
      data: timesheetAdminResults.getResultsList(),
    });

    const types = await TimeoffRequestClientService.getTimeoffRequestTypes();
    dispatch({ type: ACTIONS.SET_REQUEST_TYPES, data: types });

    dispatch({
      type: ACTIONS.SET_TYPE_OPTIONS,
      data: types.map(t => ({ label: t.getRequestType(), value: t.getId() })),
    });

    if (!requestOffId) {
      const user = await UserClientService.loadUserById(userId || loggedUserId);
      dispatch({ type: ACTIONS.SET_USER, data: user });

      state.data.setDepartmentCode(user.getEmployeeDepartmentId());
      const upcomingReq = new TimeoffRequest();
      upcomingReq.setUserId(user.getId());
      upcomingReq.setDateTargetList(['time_started', 'time_started']);
      const startDate = format(new Date(), 'yyyy-MM-dd');
      const endDate = format(addYears(new Date(), 1), 'yyyy-MM-dd');
      upcomingReq.setDateRangeList(['>=', startDate, '<=', endDate]);

      upcomingReq.setIsActive(1);
      dispatch({
        type: ACTIONS.SET_UPCOMING_REQUESTS,
        data: (
          await TimeoffRequestClientService.BatchGet(upcomingReq)
        ).getResultsList(),
      });
      const ptoReq = new TimeoffRequest();
      ptoReq.setUserId(user.getId());
      ptoReq.setRequestType(9);
      ptoReq.setIsActive(1);
      ptoReq.setOrderBy('time_started');
      ptoReq.setOrderDir('DESC');
      dispatch({
        type: ACTIONS.SET_PTO_HISTORY,
        data: (
          await TimeoffRequestClientService.BatchGet(ptoReq)
        ).getResultsList(),
      });
    }
    const pto = await TimeoffRequestClientService.PTOInquiry(
      userId || loggedUserId,
    );
    dispatch({ type: ACTIONS.SET_PTO, data: pto });

    const loggedUser = await UserClientService.loadUserById(loggedUserId);
    dispatch({ type: ACTIONS.SET_LOGGED_USER, data: loggedUser });
    if (requestOffId) {
      const req = await TimeoffRequestClientService.getTimeoffRequestById(
        requestOffId,
      );
      if (req) {
        const userData = await UserClientService.loadUserById(req.getUserId());
        dispatch({ type: ACTIONS.SET_USER, data: userData });
        state.data.setDepartmentCode(userData.getEmployeeDepartmentId());
        const upcomingReq = new TimeoffRequest();
        upcomingReq.setUserId(userData.getId());
        upcomingReq.setDateTargetList(['time_started', 'time_started']);
        const startDate = format(new Date(), 'yyyy-MM-dd');
        const endDate = format(addYears(new Date(), 1), 'yyyy-MM-dd');
        upcomingReq.setDateRangeList(['>=', startDate, '<=', endDate]);

        upcomingReq.setIsActive(1);
        dispatch({
          type: ACTIONS.SET_UPCOMING_REQUESTS,
          data: (
            await TimeoffRequestClientService.BatchGet(upcomingReq)
          ).getResultsList(),
        });
        const ptoReq = new TimeoffRequest();
        ptoReq.setUserId(userData.getId());
        ptoReq.setRequestType(9);
        ptoReq.setIsActive(1);
        ptoReq.setOrderBy('time_started');
        ptoReq.setOrderDir('DESC');
        dispatch({
          type: ACTIONS.SET_PTO_HISTORY,
          data: (
            await TimeoffRequestClientService.BatchGet(ptoReq)
          ).getResultsList(),
        });
      }

      const logReq = new ActivityLog();
      logReq.setTimeoffRequestId(requestOffId);

      dispatch({
        type: ACTIONS.SET_LOG_DATA,
        data: (
          await ActivityLogClientService.BatchGet(logReq)
        ).getResultsList(),
      });

      if (!req) {
        dispatch({ type: ACTIONS.SET_DELETED, data: true });

        dispatch({ type: ACTIONS.SET_INITIATED, data: true });

        return;
      }
      if (req.getRequestType() === 9) {
        if (pto) {
          let hourDiff = 0;
          if (
            req.getAllDayOff() === 1 &&
            req.getTimeStarted() &&
            req.getTimeFinished()
          ) {
            const date1 = new Date(parseISO(req.getTimeStarted()));
            const date2 = new Date(parseISO(req.getTimeFinished()));

            hourDiff = (differenceInBusinessDays(date2, date1) + 1) * 8;
          } else if (
            req.getAllDayOff() != 1 &&
            req.getTimeStarted() &&
            req.getTimeFinished()
          ) {
            const date1 = new Date(parseISO(req.getTimeStarted()));
            const date2 = new Date(parseISO(req.getTimeFinished()));
            hourDiff = differenceInHours(date2, date1);
          }
          if (hourDiff > pto.getHoursAvailable()) {
            dispatch({ type: ACTIONS.SET_OPEN_ALERT, data: true });
          } else {
            //we should reset it, if they created one that one was, but then incorrect
            dispatch({ type: ACTIONS.SET_ALERT_DISMISSED, data: false });
            dispatch({ type: ACTIONS.SET_OPEN_ALERT, data: false });
          }
        }
      } else {
        dispatch({ type: ACTIONS.SET_ALERT_DISMISSED, data: false });
        dispatch({ type: ACTIONS.SET_OPEN_ALERT, data: false });
      }

      if (!req.getAdminApprovalUserId()) {
        req.setRequestStatus(1);
        req.setAdminApprovalDatetime(timestamp(true));
        req.setReviewedBy(
          `${loggedUser.getFirstname()} ${loggedUser.getLastname()}`,
        );
      }
      dispatch({ type: ACTIONS.SET_DATA, data: req });

      dispatch({ type: ACTIONS.SET_FORM_KEY, data: state.formKey + 1 });
    } else {
      dispatch({ type: ACTIONS.SET_FORM_KEY, data: state.formKey + 1 });
    }
    dispatch({ type: ACTIONS.SET_INITIATED, data: true });
  }, [userId, state.data, requestOffId, state.formKey, loggedUserId]);

  useEffect(() => {
    if (!state.initiated) {
      init();
    }
  }, [state.initiated, init]);
  const toggleDeleting = useCallback(
    () => dispatch({ type: ACTIONS.SET_DELETING, data: !state.deleting }),
    [state.deleting],
  );
  const handleSubmit = useCallback(
    async (formData: TimeoffRequest) => {
      dispatch({ type: ACTIONS.SET_ERROR, data: '' });
      const temp = makeSafeFormObject(formData, new TimeoffRequest());

      const requestType = temp.getRequestType();
      const timeStarted = temp.getTimeStarted();
      const timeFinished = temp.getTimeFinished();
      if (temp.getAllDayOff() === null) {
        temp.setAllDayOff(0);
      }
      const userId = state.user!.getId();
      if (timeFinished < timeStarted) {
        dispatch({
          type: ACTIONS.SET_ERROR,
          data: 'End Time cannot be before Start Time',
        });

        return;
      }
      dispatch({ type: ACTIONS.SET_SAVING, data: true });
      temp.setUserId(userId!);

      temp.setUserApprovalDatetime(timestamp());
      let newData = new TimeoffRequest();

      if (
        state.departments.findIndex(
          department => department.getManagerId() === loggedUserId,
        ) != -1
      ) {
        temp.setAdminApprovalUserId(loggedUserId);
        temp.setRequestStatus(1);
        temp.setAdminApprovalDatetime(timestamp(true));
        temp.setReviewedBy(
          `${state.loggedUser!.getFirstname()} ${state.loggedUser!.getLastname()}`,
        );
      }
      if (state.data.getId() === 0 || state.data.getId().toString() === '') {
        console.log('create');
        newData = await TimeoffRequestClientService.Create(temp);
      } else {
        console.log('update');
        newData = await TimeoffRequestClientService.Update(temp);
      }
      const typeName = state.typeOptions.find(
        //@ts-ignore
        (val: { label: string; value: number }) => {
          if (val.value === +requestType) {
            return true;
          }
          return false;
        },
      );

      try {
        const req = new User();
        req.setId(loggedUserId);
        const manager = await UserClientService.GetUserManager(req);

        const emailBody = getTimeoffRequestEmail(
          `${state.user?.getFirstname()} ${state.user?.getLastname()}`,
          getTimeoffTimestamp(
            newData.getTimeStarted(),
            newData.getTimeFinished(),
          ),
          //@ts-ignore
          typeName ? typeName.label : '',
          newData.getNotes(),
          newData.getId(),
        );

        //@ts-ignore
        const config: EmailConfig = {
          type: 'timeoff',
          body: emailBody,
          recipient: manager.getEmail(),
        };

        await emailClient.sendMail(config);
      } catch (err) {
        console.log(err);
      }
      const newLog = new ActivityLog();
      newLog.setTimeoffRequestId(newData.getId());
      newLog.setUserId(loggedUserId);
      if (
        newData.getAdminApprovalUserId() != null &&
        newData.getAdminApprovalUserId() != 0
      ) {
        newLog.setActivityName(
          `Created and Approved by ${state.loggedUser?.getFirstname()} ${state.loggedUser?.getLastname()} ${
            state.alertDismissed ? ', Exceeding PTO Alert Dismissed' : ''
          }`,
        );
      } else {
        newLog.setActivityName(
          `Created by ${state.loggedUser?.getFirstname()} ${state.loggedUser?.getLastname()} ${
            state.alertDismissed ? ', Exceeding PTO Alert Dismissed' : ''
          }`,
        );
      }
      await ActivityLogClientService.Create(newLog);
      dispatch({ type: ACTIONS.SET_DATA, data: newData });
      dispatch({ type: ACTIONS.SET_FORM_KEY, data: state.formKey + 1 });
      dispatch({ type: ACTIONS.SET_SAVING, data: false });
      onSaveOrDelete(newData);
    },
    [
      emailClient,
      state.typeOptions,
      state.user,
      state.departments,
      state.alertDismissed,
      onSaveOrDelete,
      state.loggedUser,
      state.formKey,
      loggedUserId,
      state.data,
    ],
  );

  const handleSubmitAdmin = useCallback(async () => {
    const req = new TimeoffRequest();

    req.setAdminApprovalUserId(loggedUserId);
    req.setAdminApprovalDatetime(state.data.getAdminApprovalDatetime());
    req.setId(state.data.getId());
    req.setReviewedBy(state.data.getReviewedBy());
    req.setAdminComments(state.data.getAdminComments());
    req.setRequestStatus(state.data.getRequestStatus());
    req.setFieldMaskList([
      'AdminApprovalUserId',
      'ReviewedBy',
      'AdminComments',
      'RequestStatus',
      'AdminApprovalDatetime',
    ]);

    let newData = new TimeoffRequest();
    if (state.data.getId() === 0 || state.data.getId().toString() === '') {
      newData = await TimeoffRequestClientService.Create(req);
    } else {
      newData = await TimeoffRequestClientService.Update(req);
      const emailBody = getTimeoffRequestStatusEmail(
        `${state.loggedUser!.getFirstname()} ${state.loggedUser!.getLastname()}`,
        req.getAdminComments(),
        req.getRequestStatus() === 1 ? 'Approved' : 'Not Approved',

        `${state.data.getTimeStarted()} -${state.data.getTimeFinished()}`,
      );

      const newLog = new ActivityLog();
      newLog.setTimeoffRequestId(newData.getId());
      newLog.setActivityName(
        `Updated with status ${
          req.getRequestStatus() === 1 ? 'Approved' : 'Not Approved'
        } by ${state.loggedUser?.getFirstname()} ${state.loggedUser?.getLastname()} ${
          state.alertDismissed ? ', Exceeding PTO Alert Dismissed' : ''
        }`,
      );
      await ActivityLogClientService.Create(newLog);
      //@ts-ignore
      const config: EmailConfig = {
        type: 'timeoff',
        subject: 'Timeoff Status Update',
        body: emailBody,
        recipient: state.user!.getEmail(),
      };
      await emailClient.sendMail(config);
    }
    dispatch({ type: ACTIONS.SET_DATA, data: newData });

    if (onAdminSubmit) {
      onAdminSubmit(newData);
    }
  }, [
    state.data,
    onAdminSubmit,
    emailClient,
    state.loggedUser,
    state.alertDismissed,
    state.user,
    loggedUserId,
  ]);
  const handleDelete = useCallback(async () => {
    if (requestOffId) {
      dispatch({ type: ACTIONS.SET_SAVING, data: true });
      await TimeoffRequestClientService.deleteTimeoffRequestById(requestOffId);
      dispatch({ type: ACTIONS.SET_SAVING, data: false });
      onSaveOrDelete(state.data);
    }
  }, [requestOffId, onSaveOrDelete, state.data]);
  const isAdmin =
    state.loggedUser &&
    state.loggedUser
      .getPermissionGroupsList()
      .find(p => p.getType() === 'role');
  const disabled = !(state.data.getId() && isAdmin);
  const disabledAdmin = disabled || !!state.data.getAdminApprovalUserId();
  const schema: Schema<TimeoffRequest> = [
    [
      {
        name: 'getTimeStarted',
        label: 'Start Time',
        type: 'mui-datetime',
        minutesStep: 5,
        required: true,
        disabled: !disabled,
      },
      {
        name: 'getTimeFinished',
        label: 'End Time',
        type: 'mui-datetime',
        minutesStep: 5,
        required: true,
        disabled: !disabled,
      },
      {
        name: 'getAllDayOff',
        label: 'Is This Request for Multiple Days?',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 1 },
        ],
        disabled: !disabled,
      },
    ],
    [
      {
        name: 'getUserId',
        type: 'hidden',
      },
      {
        name: 'getId',
        type: 'hidden',
      },
    ],
    [
      {
        name: 'getDepartmentCode',
        label: 'Select Your Department',
        type: 'department',
        required: true,
        disabled: !disabled,
      },
      {
        name: 'getRequestType',
        label: 'Select Your Request Type',
        required: true,
        disabled: !disabled,
        options: [
          {
            value: 0,
            label: OPTION_BLANK,
          },
          ...state.typeOptions,
        ],
      },
      {
        name: 'getNotes',
        multiline: true,
        label: 'Request Off Details',
        disabled: !disabled,
      },
    ],
    [
      {
        headline: true,
        label: 'Admin Use Only',
        disabled: disabledAdmin,
        actions: [
          {
            label: 'Submit',
            size: 'small',
            compact: true,
            disabled: disabledAdmin,
            onClick: handleSubmitAdmin,
          },
        ],
      },
    ],
    [
      {
        name: 'getRequestStatus',
        label: 'Status',
        options: [
          { value: 0, label: 'Not approved' },
          { value: 1, label: 'Approved' },
        ],
        disabled: disabledAdmin,
      },
      {
        name: 'getAdminApprovalDatetime',
        label: 'Decision Date',
        type: 'date',
        disabled: disabledAdmin,
      },
      {
        name: 'getReviewedBy',
        label: 'Reviewer',
        disabled: disabledAdmin,
      },
    ],
    [
      {
        name: 'getAdminComments',
        label: 'Comments',
        disabled: disabledAdmin,
      },
    ],
  ];
  const css: CSSProperties =
    state.pto && state.user
      ? state.pto.getHoursAvailable() >
        state.user.getAnnualHoursPto() + state.user.getBonusHoursPto()
        ? { color: '#d22' }
        : {}
      : {};
  if (state.deleted)
    return (
      <SectionBar
        title={'Request Time Off '}
        subtitle="This Request Time Off cannot be find (wrong ID or it was deleted)"
      />
    );
  return (
    <>
      <Form<TimeoffRequest>
        key={state.formKey}
        data={state.data}
        onClose={onCancel}
        onChange={setSafeData}
        onSave={state.data.getId() ? toggleDeleting : handleSubmit}
        schema={schema}
        title={
          state.user?.getFirstname()
            ? 'Request Time Off for ' +
              state.user?.getFirstname() +
              ' ' +
              state.user?.getLastname()
            : 'Request Time Off'
        }
        subtitle={
          state.pto && state.user ? (
            <span>
              PTO Remaining:{' '}
              <span style={css}>{state.pto.getHoursAvailable()}</span> of{' '}
              <span style={css}>
                {state.user.getAnnualHoursPto() + state.user.getBonusHoursPto()}
              </span>
            </span>
          ) : null
        }
        disabled={!state.initiated || state.saving}
        submitLabel={state.data.getId() ? 'Delete' : 'Save'}
        cancelLabel={cancelLabel}
        submitDisabled={submitDisabled}
        error={state.error}
      />
      {state.logData && state.logData.length >= 1 && (
        <InfoTable
          columns={[{ name: 'Log Entry' }, { name: 'Date' }]}
          data={state.logData.map(log => [
            { value: log.getActivityName() },
            { value: log.getActivityDate() },
          ])}
        />
      )}
      {state.ptoHistory && state.ptoHistory.length >= 1 && (
        <div key="this year pto">
          <h2> PTO History</h2>
          <InfoTable
            columns={[
              { name: 'Request Type' },
              { name: 'Start Time' },
              { name: 'End Time' },
              { name: 'Status' },
              { name: 'Reviewer' },
            ]}
            data={state.ptoHistory.map(req => [
              {
                value: state.requestTypes
                  .find(type => type.getId() === req.getRequestType())
                  ?.getRequestType(),
              },
              { value: formatDate(req.getTimeStarted()) },
              { value: formatDate(req.getTimeFinished()) },
              {
                value:
                  req.getRequestStatus() === 1 ? 'Approved' : 'Not Approved',
              },
              { value: req.getAdminApprovalUserName() },
            ])}
          />
        </div>
      )}
      {state.upcomingRequests && state.upcomingRequests.length >= 1 && (
        <div key="upComing Requests">
          <h2>Upcoming Requests</h2>
          <InfoTable
            columns={[
              { name: 'Request Type' },
              { name: 'Start Time' },
              { name: 'End Time' },
              { name: 'Status' },
              { name: 'Reviewer' },
            ]}
            data={state.upcomingRequests.map(req => [
              {
                value: state.requestTypes
                  .find(type => type.getId() === req.getRequestType())
                  ?.getRequestType(),
              },
              { value: formatDate(req.getTimeStarted()) },
              { value: formatDate(req.getTimeFinished()) },
              {
                value:
                  req.getRequestStatus() === 1 ? 'Approved' : 'Not Approved',
              },
              { value: req.getAdminApprovalUserName() },
            ])}
          />
        </div>
      )}
      {state.deleting && (
        <ConfirmDelete
          kind="this Request Off"
          name=""
          onClose={toggleDeleting}
          onConfirm={handleDelete}
          open
        />
      )}
      <Alert
        open={
          state.openAlert &&
          state.alertDismissed == false &&
          state.data.getAdminApprovalUserId() == 0
        }
        onClose={handleCloseAlert}
        title="PTO Error"
      >
        <div>
          This Paid Time Off Request will exceed the alloted hours. Please
          verify your time or contact your manager before submitting.
        </div>
      </Alert>
    </>
  );
};

const getTimeoffTimestamp = function getTimeoffTimestamp(
  startDateStr: string,
  endDateStr: string,
) {
  endDateStr = endDateStr.replace(/-/g, '/');
  startDateStr = startDateStr.replace(/-/g, '/');
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  return `${format(startDate, 'MMM dd yyyy')} - ${format(
    endDate,
    'MM dd yyyy',
  )}`;
};

const getTimeoffRequestEmail = function getTimeoffRequestEmail(
  userName: string,
  timestamp: string,
  requestType: string,
  notes: string,
  requestID: number,
) {
  return `
<body>
  <strong>${userName} has submitted a timeoff request</strong>
  <table style="width:70%;">
    <thead>
      <tr>
        <th style="text-align:left;">Date and Time</th>
        <th style="text-align:left;">Request Type</th>
        ${notes !== '' ? '<th style="text-align:left;">Notes</th>' : ''}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${timestamp}</td>
        <td>${requestType}</td>
        ${notes !== '' ? `<td>${notes}</td>` : ''}
      </tr>
      <tr>
        <a href="http://app.kalosflorida.com/index.cfm?action=admin:timesheet.addtimeoffrequest&rid=${requestID}">
        Click here to review the request
        </a>
      </tr>
    </tbody>
  </table>
</body>`;
};
const getTimeoffRequestStatusEmail = function getTimeoffRequestStatusEmail(
  adminUserName: string,
  adminNotes: string,
  status: string,
  date: string,
) {
  return `
<body>
  <strong>${adminUserName} has ${status} a timeoff request</strong>
  <table style="width:70%;">
    <thead>
      <tr>
        <th style="text-align:left;">Date</th>
        <th style="text-align:left;">Status/th>
        '${adminNotes !== '' ? '<th style="text-align:left;">Notes</th>' : ''}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${date}</td>
        <td>${status}</td>
        ${adminNotes !== '' ? `<td>${adminNotes}</td>` : ''}
      </tr>
      <tr>
        </a>
      </tr>
    </tbody>
  </table>
</body>`;
};
