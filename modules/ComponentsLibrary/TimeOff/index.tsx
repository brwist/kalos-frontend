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
  differenceInCalendarDays,
  differenceInCalendarYears,
  differenceInBusinessDays,
  addYears,
  format,
} from 'date-fns';
import { Form, Schema, Options } from '../Form';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { ConfirmDelete } from '../ConfirmDelete';
import {
  TimeoffRequestType,
  UserType,
  roundNumber,
  PTOType,
  timestamp,
  UserClientService,
  TimeoffRequestClientService,
} from '../../../helpers';
import { OPTION_BLANK, ENDPOINT } from '../../../constants';
import { EmailClient, EmailConfig } from '@kalos-core/kalos-rpc/Email';
import { User } from '@kalos-core/kalos-rpc/User';
import { TimeoffRequest } from '@kalos-core/kalos-rpc/TimeoffRequest';
export interface Props {
  loggedUserId: number;
  userId?: number;
  requestOffId?: number;
  onCancel: () => void;
  onSaveOrDelete: (data: TimeoffRequestType) => void;
  onAdminSubmit?: (data: TimeoffRequestType) => void;
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
  const [pto, setPto] = useState<PTOType>();
  const [ptoActualHours, setPtoActualHours] = useState<number>(0);
  const [user, setUser] = useState<UserType>();
  const [loggedUser, setLoggedUser] = useState<UserType>();
  const [formKey, setFormKey] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const emptyTO = new TimeoffRequest();
  const [data, setData] = useState<TimeoffRequestType>(emptyTO.toObject());
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
      ).resultsList;
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

  const emailClient = useMemo(() => new EmailClient(ENDPOINT), []);
  const init = useCallback(async () => {
    const types = await TimeoffRequestClientService.getTimeoffRequestTypes();
    setTypeOptions(
      types.map(({ id, requestType }) => ({ label: requestType, value: id })),
    );
    const user = await UserClientService.loadUserById(userId || loggedUserId);
    setUser(user);
    const pto = await TimeoffRequestClientService.getPTOInquiryByUserId(
      userId || loggedUserId,
    );
    setPto(pto);
    console.log(pto);
    const ptoActualHours = await getTimeoffTotals(user.hireDate);
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
      if (!req.adminApprovalUserId) {
        req.requestStatus = 1;
        req.adminApprovalDatetime = timestamp(true);
        req.reviewedBy = loggedUser.firstname + ' ' + loggedUser.lastname;
      }
      setData(req);
      setFormKey(formKey + 1);
    } else {
      setData({ ...data, departmentCode: user.employeeDepartmentId });
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
    async (data: TimeoffRequestType) => {
      setError('');
      const {
        allDayOff,
        departmentCode,
        notes,
        requestType,
        timeStarted,
        timeFinished,
      } = data;

      const userId = user?.id;
      if (timeFinished < timeStarted) {
        setError('End Time cannot be before Start Time');
        return;
      }
      setSaving(true);
      const newData = await TimeoffRequestClientService.upsertTimeoffRequest({
        allDayOff,
        departmentCode,
        notes,
        requestType,
        timeStarted,
        timeFinished,
        userId,
        briefDescription: '',
        userApprovalDatetime: timestamp(),
      });
      const typeName = typeOptions.find(
        //@ts-ignore
        (val: { label: string; value: number }) => {
          if (val.value === requestType) {
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
          `${user?.firstname} ${user?.lastname}`,
          getTimeoffTimestamp(
            newData.timeStarted,
            newData.timeFinished,
            !!newData.allDayOff,
          ),
          //@ts-ignore
          typeName ? typeName.label : '',
          newData.notes,
          newData.id,
        );

        //@ts-ignore
        const config: EmailConfig = {
          type: 'timeoff',
          body: emailBody,
          recipient: manager.email,
        };

        await emailClient.sendMail(config);
      } catch (err) {
        console.log(err);
      }

      setData({
        ...newData,
        ...(loggedUser!.isAdmin
          ? {
              requestStatus: 1,
              adminApprovalDatetime: timestamp(true),
              reviewedBy: loggedUser!.firstname + ' ' + loggedUser!.lastname,
            }
          : {}),
      });
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
    const {
      id,
      adminApprovalDatetime,
      requestStatus,
      reviewedBy,
      adminComments,
    } = data;
    const newData = await TimeoffRequestClientService.upsertTimeoffRequest({
      id,
      adminApprovalDatetime,
      adminApprovalUserId: loggedUserId,
      requestStatus,
      reviewedBy,
      adminComments,
      briefDescription: '',
    });
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
    loggedUser && loggedUser.permissionGroupsList.find(p => p.type === 'role');
  console.log(isAdmin);
  const disabled = !(data.id && isAdmin);
  const disabledAdmin = disabled || !!data.adminApprovalUserId;
  const schema: Schema<TimeoffRequestType> = [
    [
      {
        name: 'timeStarted',
        label: 'Start Time',
        type: 'mui-datetime',
        minutesStep: 5,
        required: true,
        disabled: !disabled,
      },
      {
        name: 'timeFinished',
        label: 'End Time',
        type: 'mui-datetime',
        minutesStep: 5,
        required: true,
        disabled: !disabled,
      },
      {
        name: 'allDayOff',
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
        name: 'userId',
        type: 'hidden',
      },
      {
        name: 'id',
        type: 'hidden',
      },
    ],
    [
      {
        name: 'departmentCode',
        label: 'Select Your Department',
        type: 'department',
        required: true,
        disabled: !disabled,
      },
      {
        name: 'requestType',
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
        name: 'notes',
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
        name: 'requestStatus',
        label: 'Status',
        options: [
          { value: 0, label: 'Not approved' },
          { value: 1, label: 'Approved' },
        ],
        disabled: disabledAdmin,
      },
      {
        name: 'adminApprovalDatetime',
        label: 'Decision Date',
        type: 'date',
        disabled: disabledAdmin,
      },
      {
        name: 'reviewedBy',
        label: 'Reviewer',
        disabled: disabledAdmin,
      },
    ],
    [
      {
        name: 'adminComments',
        label: 'Comments',
        disabled: disabledAdmin,
      },
    ],
  ];
  const css: CSSProperties =
    pto && user
      ? pto.hoursAvailable > user.annualHoursPto
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
      <Form<TimeoffRequestType>
        key={formKey}
        data={data}
        onClose={onCancel}
        onSave={data.id ? toggleDeleting : handleSubmit}
        onChange={setData}
        schema={schema}
        title={
          user?.firstname
            ? 'Request Time Off for ' + user?.firstname + ' ' + user?.lastname
            : 'Request Time Off'
        }
        subtitle={
          pto && user ? (
            <span>
              PTO Available: <span style={css}>{pto.hoursAvailable}</span> of{' '}
              <span style={css}>{user.annualHoursPto}</span>
            </span>
          ) : null
        }
        disabled={!initiated || saving}
        submitLabel={data.id ? 'Delete' : 'Save'}
        cancelLabel={cancelLabel}
        submitDisabled={submitDisabled || !!data.adminApprovalUserId}
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
  allDays = false,
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
