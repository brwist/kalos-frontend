import React, {
  FC,
  useEffect,
  useState,
  useCallback,
  CSSProperties,
  useMemo,
} from 'react';
import {
  differenceInMinutes,
  parseISO,
  differenceInCalendarYears,
  differenceInBusinessDays,
  addYears,
  format,
} from 'date-fns';
import { Form, Schema, Options } from '../Form';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { ConfirmDelete } from '../ConfirmDelete';
import {
  roundNumber,
  timestamp,
  UserClientService,
  TimeoffRequestClientService,
  makeSafeFormObject,
} from '../../../helpers';
import { OPTION_BLANK, ENDPOINT } from '../../../constants';
import { EmailClient, EmailConfig } from '@kalos-core/kalos-rpc/Email';
import { User } from '@kalos-core/kalos-rpc/User';
import { PTO, TimeoffRequest } from '@kalos-core/kalos-rpc/TimeoffRequest';

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
  const [initiated, setInitiated] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [typeOptions, setTypeOptions] = useState<Options>([]);
  const [pto, setPto] = useState<PTO>();
  const [ptoActualHours, setPtoActualHours] = useState<number>(0);
  const [user, setUser] = useState<User>();
  const [loggedUser, setLoggedUser] = useState<User>();
  const [formKey, setFormKey] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const emptyTO = new TimeoffRequest();
  const [data, setData] = useState<TimeoffRequest>(emptyTO);
  const getTimeoffTotals = useCallback(
    async (hireDate: string) => {
      hireDate = hireDate.replace(/-/g, '/');
      const today = new Date();
      const startDay = new Date(hireDate);
      const yearsToAdd = differenceInCalendarYears(today, startDay);
      const adjustedStartDay = addYears(startDay, yearsToAdd - 1);
      const adjustedEndDay = addYears(startDay, yearsToAdd);
      const startDate = format(adjustedStartDay, 'yyyy-MM-dd');
      const endDate = format(adjustedEndDay, 'yyyy-MM-dd');
      const filter = {
        technicianUserID: userId,
        requestType: 9,
        startDate: startDate,
        endDate: endDate,
        approved: true,
      };
      const results = (
        await TimeoffRequestClientService.loadTimeoffRequests(filter)
      ).getResultsList();
      let total = 0;
      for (let i = 0; i < results.length; i++) {
        if (results[i].getAllDayOff() === 0) {
          const timeFinished = results[i].getTimeFinished();
          const timeStarted = results[i].getTimeStarted();
          const subtotal = roundNumber(
            differenceInMinutes(parseISO(timeFinished), parseISO(timeStarted)) /
              60,
          );

          total += subtotal;
        } else {
          const timeFinished = results[i].getTimeFinished();
          const timeStarted = results[i].getTimeStarted();
          const numberOfDays =
            differenceInBusinessDays(
              parseISO(timeFinished),
              parseISO(timeStarted),
            ) + 1;
          total += numberOfDays * 8;
        }
      }
      return total;
    },
    [userId],
  );
  const setSafeData = () => {
    const tempData = makeSafeFormObject(data, new TimeoffRequest());
    setData(tempData);
  };
  const emailClient = useMemo(() => new EmailClient(ENDPOINT), []);
  const init = useCallback(async () => {
    const types = await TimeoffRequestClientService.getTimeoffRequestTypes();
    setTypeOptions(
      types.map(t => ({ label: t.getRequestType(), value: t.getId() })),
    );
    const user = await UserClientService.loadUserById(userId || loggedUserId);
    setUser(user);
    const pto = await TimeoffRequestClientService.getPTOInquiryByUserId(
      userId || loggedUserId,
    );
    setPto(pto);
    const ptoActualHours = await getTimeoffTotals(user.getHireDate());
    setPtoActualHours(ptoActualHours);

    const loggedUser = await UserClientService.loadUserById(loggedUserId);
    setLoggedUser(loggedUser);
    if (requestOffId) {
      const req = await TimeoffRequestClientService.getTimeoffRequestById(
        requestOffId,
      );
      if (!req) {
        setDeleted(true);
        setInitiated(true);
        return;
      }
      if (!req.getAdminApprovalUserId()) {
        req.setRequestStatus(1);
        req.setAdminApprovalDatetime(timestamp(true));
        req.setReviewedBy(
          `${loggedUser.getFirstname()} ${loggedUser.getLastname()}`,
        );
      }
      setData(req);
      setFormKey(formKey + 1);
    } else {
      data.setDepartmentCode(user.getEmployeeDepartmentId());
      setData(data);
      setFormKey(formKey + 1);
    }
    setInitiated(true);
  }, [
    userId,
    setPto,
    requestOffId,
    setData,
    formKey,
    setTypeOptions,
    setDeleted,
    setInitiated,
    data,
    setLoggedUser,
    getTimeoffTotals,
    setUser,
    loggedUserId,
  ]);

  useEffect(() => {
    if (!initiated) {
      init();
    }
  }, [initiated, init]);
  const toggleDeleting = useCallback(() => setDeleting(!deleting), [
    deleting,
    setDeleting,
  ]);
  const handleSubmit = useCallback(
    async (data: TimeoffRequest) => {
      setError('');
      const temp = makeSafeFormObject(data, new TimeoffRequest());
      const allDayOff = temp.getAllDayOff();
      const departmentCode = temp.getDepartmentCode();
      const notes = temp.getNotes();
      const requestType = temp.getNotes();
      const timeStarted = temp.getTimeStarted();
      const timeFinished = temp.getTimeFinished();

      const userId = user?.getId();
      if (timeFinished < timeStarted) {
        setError('End Time cannot be before Start Time');
        return;
      }
      setSaving(true);
      temp.setUserId(userId!);
      temp.setUserApprovalDatetime(timestamp());
      const newData = await TimeoffRequestClientService.upsertTimeoffRequest(
        temp,
      );
      const typeName = typeOptions.find(
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
          `${user?.getFirstname()} ${user?.getLastname()}`,
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

        //await emailClient.sendMail(config);
      } catch (err) {
        console.log(err);
      }

      if (loggedUser!.getIsAdmin()) {
        newData.setRequestStatus(1);
        newData.setAdminApprovalDatetime(timestamp(true));
        newData.setReviewedBy(
          `${loggedUser!.getFirstname()} ${loggedUser!.getLastname()}`,
        );
      }
      setData(newData);
      setFormKey(formKey + 1);
      setSaving(false);
      onSaveOrDelete(newData);
    },
    [
      emailClient,
      typeOptions,
      user,
      onSaveOrDelete,
      setSaving,
      setData,
      setError,
      loggedUser,
      setFormKey,
      formKey,
      loggedUserId,
    ],
  );

  const handleSubmitAdmin = useCallback(async () => {
    data.setAdminApprovalUserId(loggedUserId);
    const newData = await TimeoffRequestClientService.upsertTimeoffRequest(
      data,
    );
    setData(newData);
    if (onAdminSubmit) {
      onAdminSubmit(newData);
    }
  }, [data, onAdminSubmit, setData, loggedUserId]);
  const handleDelete = useCallback(async () => {
    if (requestOffId) {
      setSaving(true);
      await TimeoffRequestClientService.deleteTimeoffRequestById(requestOffId);
      setSaving(false);
      onSaveOrDelete(data);
    }
  }, [requestOffId, setSaving, onSaveOrDelete, data]);
  const isAdmin =
    loggedUser &&
    loggedUser.getPermissionGroupsList().find(p => p.getType() === 'role');
  const disabled = !(data.getId() && isAdmin);
  const disabledAdmin = disabled || !!data.getAdminApprovalUserId();
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
        label: 'All Days?',
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
          ...typeOptions,
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
    pto && user
      ? pto.getHoursAvailable() > user.getAnnualHoursPto()
        ? { color: '#d22' }
        : {}
      : {};
  if (deleted)
    return (
      <SectionBar
        title={'Request Time Off '}
        subtitle="This Request Time Off cannot be find (wrong ID or it was deleted)"
      />
    );
  return (
    <>
      <Form<TimeoffRequest>
        key={formKey}
        data={data}
        onClose={onCancel}
        onSave={data.getId() ? toggleDeleting : handleSubmit}
        onChange={setSafeData}
        schema={schema}
        title={
          user?.getFirstname()
            ? 'Request Time Off for ' +
              user?.getFirstname() +
              ' ' +
              user?.getLastname()
            : 'Request Time Off'
        }
        subtitle={
          pto && user ? (
            <span>
              PTO Used: <span style={css}>{pto.getDaysAvailable()}</span> of{' '}
              <span style={css}>{user.getAnnualHoursPto()}</span>
            </span>
          ) : null
        }
        disabled={!initiated || saving}
        submitLabel={data.getId() ? 'Delete' : 'Save'}
        cancelLabel={cancelLabel}
        submitDisabled={submitDisabled || !!data.getAdminApprovalUserId()}
        error={error}
      />
      {deleting && (
        <ConfirmDelete
          kind="this Request Off"
          name=""
          onClose={toggleDeleting}
          onConfirm={handleDelete}
          open
        />
      )}
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
