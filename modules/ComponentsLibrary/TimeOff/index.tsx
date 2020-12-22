import React, {
  FC,
  useEffect,
  useState,
  useCallback,
  CSSProperties,
} from 'react';
import { format } from 'date-fns';
import { Form, Schema, Options } from '../Form';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { ConfirmDelete } from '../ConfirmDelete';
import {
  TimeoffRequestType,
  UserType,
  PTOType,
  upsertTimeoffRequest,
  timestamp,
  UserClientService,
  TimeoffRequestClientService,
} from '../../../helpers';
import { OPTION_BLANK } from '../../../constants';

export interface Props {
  loggedUserId: number;
  userId: number;
  requestOffId?: number;
  onCancel: () => void;
  onSaveOrDelete: (data: TimeoffRequestType) => void;
  onAdminSubmit?: (data: TimeoffRequestType) => void;
  cancelLabel?: string;
}

export const TimeOff: FC<Props> = ({
  loggedUserId,
  userId,
  onCancel,
  onSaveOrDelete,
  onAdminSubmit,
  requestOffId,
  cancelLabel,
}) => {
  const [initiated, setInitiated] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [typeOptions, setTypeOptions] = useState<Options>([]);
  const [pto, setPto] = useState<PTOType>();
  const [user, setUser] = useState<UserType>();
  const [loggedUser, setLoggedUser] = useState<UserType>();
  const [formKey, setFormKey] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<TimeoffRequestType>({
    adminApprovalDatetime: '',
    adminApprovalUserId: 0,
    adminComments: '',
    allDayOff: 0,
    briefDescription: '',
    departmentCode: 0,
    eventId: 0,
    fieldMaskList: [],
    id: 0,
    isActive: 1,
    isRooRequest: 1,
    notes: '',
    pageNumber: 0,
    referenceNumber: '',
    requestStatus: 1,
    requestType: 0,
    reviewedBy: '',
    servicesRenderedId: 0,
    taskEventId: 0,
    timeFinished: format(new Date(), 'yyyy-MM-dd 23:59'),
    timeStarted: format(new Date(), 'yyyy-MM-dd 00:00'),
    userApprovalDatetime: '',
    userId,
    userName: '',
    adminApprovalUserName: '',
    dateRangeList: [],
    dateTargetList: [],
    requestClass: '',
  });
  const init = useCallback(async () => {
    const types = await TimeoffRequestClientService.getTimeoffRequestTypes();
    setTypeOptions(
      types.map(({ id, requestType }) => ({ label: requestType, value: id })),
    );
    const pto = await TimeoffRequestClientService.getPTOInquiryByUserId(userId);
    setPto(pto);
    const user = await UserClientService.loadUserById(userId);
    setUser(user);
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
    setUser,
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
        userId,
      } = data;
      if (timeFinished < timeStarted) {
        setError('End Time cannot be before Start Time');
        return;
      }
      setSaving(true);
      const newData = await upsertTimeoffRequest({
        allDayOff,
        departmentCode,
        notes,
        requestType,
        timeStarted,
        timeFinished,
        userId,
        briefDescription: '',
      });
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
      onSaveOrDelete,
      setSaving,
      setData,
      setError,
      loggedUser,
      setFormKey,
      formKey,
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
    const newData = await upsertTimeoffRequest({
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
  }, [data, onAdminSubmit, setData]);
  const handleDelete = useCallback(async () => {
    if (requestOffId) {
      setSaving(true);
      await TimeoffRequestClientService.deleteTimeoffRequestById(requestOffId);
      setSaving(false);
      onSaveOrDelete(data);
    }
  }, [requestOffId, setSaving, onSaveOrDelete, data]);
  const isAdmin = loggedUser && loggedUser.isAdmin && loggedUserId !== userId;
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
        title="Request Time Off"
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
        title="Request Time Off"
        subtitle={
          pto && user ? (
            <span>
              PTO Used: <span style={css}>{pto.hoursAvailable}</span> of{' '}
              <span style={css}>{user.annualHoursPto}</span>
            </span>
          ) : null
        }
        disabled={!initiated || saving}
        submitLabel={data.id ? 'Delete' : 'Save'}
        cancelLabel={cancelLabel}
        submitDisabled={!!data.adminApprovalUserId}
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
