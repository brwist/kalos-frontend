import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import { EventClient, Event } from '@kalos-core/kalos-rpc/Event';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { JobType } from '@kalos-core/kalos-rpc/JobType';
import { JobSubtype } from '@kalos-core/kalos-rpc/JobSubtype';
import { JobTypeSubtype } from '@kalos-core/kalos-rpc/JobTypeSubtype';
import { Property } from '@kalos-core/kalos-rpc/Property';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered';
import {
  getRPCFields,
  makeFakeRows,
  PropertyClientService,
  JobTypeClientService,
  JobSubtypeClientService,
  loadProjects,
  JobTypeSubtypeClientService,
  ServicesRenderedClientService,
  TimesheetDepartmentClientService,
} from '../../../helpers';
import { ENDPOINT, OPTION_BLANK } from '../../../constants';
import { Modal } from '../Modal';
import { SectionBar } from '../SectionBar';
import { InfoTable, Data } from '../InfoTable';
import { Tabs } from '../Tabs';
import { Option } from '../Field';
import { Form, Schema } from '../Form';
import { General } from './components/General';
import { Equipment } from './components/Equipment';
import { Confirm } from '../Confirm';
import { GanttChart } from '../GanttChart';
import { Loader } from '../../Loader/main';
import { Typography } from '@material-ui/core';
import { BillingTab } from './components/Billing';
import { LogsTab } from './components/Logs';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { RoleType } from '../Payroll';

const EventClientService = new EventClient(ENDPOINT);
const UserClientService = new UserClient(ENDPOINT);

export type EventType = Event.AsObject;
type JobTypeType = JobType.AsObject;
type JobSubtypeType = JobSubtype.AsObject;
export type JobTypeSubtypeType = JobTypeSubtype.AsObject;
export type ServicesRenderedType = ServicesRendered.AsObject;

export interface Props {
  userID: number;
  propertyId: number;
  serviceCallId?: number;
  loggedUserId: number;
  onClose?: () => void;
  onSave?: () => void;
}

const SCHEMA_PROPERTY_NOTIFICATION: Schema<User> = [
  [
    {
      label: 'Notification',
      name: 'getNotification',
      required: true,
      multiline: true,
    },
  ],
];

export const ProjectDetail: FC<Props> = props => {
  const {
    userID,
    propertyId,
    serviceCallId: eventId,
    loggedUserId,
    onClose,
    onSave,
  } = props;
  const requestRef = useRef(null);
  const [tabIdx, setTabIdx] = useState<number>(0);
  const [pendingSave, setPendingSave] = useState<boolean>(false);
  const [serviceCallId, setServiceCallId] = useState<number>(eventId || 0);
  const [entry, setEntry] = useState<Event>(new Event());
  const [property, setProperty] = useState<Property>(new Property());
  const [customer, setCustomer] = useState<User>(new User());
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [role, setRole] = useState<RoleType>();
  const [notificationEditing, setNotificationEditing] =
    useState<boolean>(false);
  const [notificationViewing, setNotificationViewing] =
    useState<boolean>(false);
  const [projects, setProjects] = useState<EventType[]>([]);
  const [parentId, setParentId] = useState<number | null>(null);
  const [confirmedParentId, setConfirmedParentId] =
    useState<number | null>(null);
  const [project, setProject] = useState<Event.AsObject>();
  const [timesheetDepartment, setTimesheetDepartment] =
    useState<TimesheetDepartment>();
  const loadEntry = useCallback(
    async (_serviceCallId = serviceCallId) => {
      if (_serviceCallId) {
        const req = new Event();
        req.setId(_serviceCallId);
        const entry = await EventClientService.Get(req);
        setEntry(entry);
      }
    },
    [setEntry, serviceCallId],
  );
  const load = useCallback(async () => {
    setLoading(true);
    try {
      let promises = [];

      let projectGotten: Event.AsObject;

      promises.push(
        new Promise<void>(async resolve => {
          try {
            const loggedUser = await UserClientService.loadUserById(userID);
            if (loggedUser.getPermissionGroupsList()) {
              const roleGotten = loggedUser
                .getPermissionGroupsList()
                .find(p => p.getType() === 'role');
              if (roleGotten) setRole(roleGotten.getName() as RoleType);
            }
            resolve();
          } catch (err) {
            console.error(
              `An error occurred while getting the logged user or role type: ${err}`,
            );
            resolve();
          }
        }),
      );

      promises.push(
        new Promise<void>(async resolve => {
          try {
            let req = new Event();
            req.setId(serviceCallId);
            const response = await EventClientService.Get(req);
            projectGotten = response;
            setProject(response);
            resolve();
          } catch (err) {
            console.error('An error occurred while getting the project: ', err);
            resolve();
          }
        }),
      );

      promises.push(
        new Promise<void>(async resolve => {
          const property = await PropertyClientService.loadPropertyByID(
            propertyId,
          );
          setProperty(property);
          resolve();
        }),
      );

      promises.push(
        new Promise<void>(async resolve => {
          const customer = await UserClientService.loadUserById(userID);
          setCustomer(customer);
          resolve();
        }),
      );

      promises.push(
        new Promise<void>(async resolve => {
          await loadEntry();
          resolve();
        }),
      );

      promises.push(
        new Promise<void>(async resolve => {
          const projects = await loadProjects();
          setProjects(projects);
          resolve();
        }),
      );

      Promise.all(promises).then(async () => {
        try {
          let req = new TimesheetDepartment();
          req.setId(projectGotten!.departmentId);
          const timesheetDepartment =
            await TimesheetDepartmentClientService.Get(req);
          setTimesheetDepartment(timesheetDepartment);
        } catch (err) {
          console.error(
            'An error occurred while getting the timesheet department: ',
            err,
          );
        }
        setLoaded(true);
        setLoading(false);
      });
    } catch (e) {
      setError(true);
    }
  }, [
    setLoading,
    setError,
    setLoaded,
    userID,
    propertyId,
    setProperty,
    setCustomer,
    setProjects,
    loadEntry,
    serviceCallId,
  ]);

  const handleSetParentId = useCallback(
    id => {
      setParentId(id);
    },
    [setParentId],
  );

  const handleSetConfirmedIsChild = useCallback(
    id => {
      setConfirmedParentId(id);
    },
    [setConfirmedParentId],
  );

  const saveServiceCall = useCallback(async () => {
    setSaving(true);
    const req = new Event();
    req.setIsActive(1);
    const fieldMaskList: string[] = ['IsActive'];
    if (serviceCallId) {
      req.setId(serviceCallId);
    } else {
      setLoading(true);
    }
    req.setFieldMaskList(fieldMaskList);
    const res = await EventClientService[serviceCallId ? 'Update' : 'Create'](
      req,
    );
    setEntry(res);
    setSaving(false);
    if (!serviceCallId) {
      setServiceCallId(res.id);
      await loadEntry(res.id);
    }
    if (onSave) {
      onSave();
    }
  }, [serviceCallId, setEntry, setSaving, setLoading, onSave, loadEntry]);
  const saveProject = useCallback(
    async (data: EventType) => {
      setSaving(true);
      if (confirmedParentId) data.parentId = confirmedParentId;
      await EventClientService.upsertEvent(data);
      setSaving(false);
      if (onSave) {
        onSave();
      }
      if (onClose) {
        onClose();
      }
    },
    [onSave, onClose, confirmedParentId],
  );
  useEffect(() => {
    if (!loaded) {
      load();
      setLoaded(true);
    }
    if (entry && entry.customer && entry.customer.notification !== '') {
      setNotificationViewing(true);
    }
    if (pendingSave && tabIdx === 0 && requestRef.current) {
      //@ts-ignore
      requestRef.current.click();
    }
  }, [
    entry,
    loaded,
    load,
    setLoaded,
    setNotificationViewing,
    pendingSave,
    setPendingSave,
    saveServiceCall,
    tabIdx,
    requestRef,
  ]);

  const handleSetNotificationEditing = useCallback(
    (notificationEditing: boolean) => () =>
      setNotificationEditing(notificationEditing),
    [setNotificationEditing],
  );

  const handleSetNotificationViewing = useCallback(
    (notificationViewing: boolean) => () =>
      setNotificationViewing(notificationViewing),
    [setNotificationViewing],
  );

  const handleSaveCustomer = useCallback(
    async (data: UserType) => {
      setSaving(true);
      const entry = new User();
      entry.setId(userID);
      const fieldMaskList = [];
      for (const fieldName in data) {
        const { upperCaseProp, methodName } = getRPCFields(fieldName);
        // @ts-ignore
        entry[methodName](data[fieldName]);
        fieldMaskList.push(upperCaseProp);
      }
      entry.setFieldMaskList(fieldMaskList);
      await UserClientService.Update(entry);
      await loadEntry();
      setSaving(false);
      handleSetNotificationEditing(false)();
    },
    [setSaving, userID, handleSetNotificationEditing, loadEntry],
  );

  const { logJobNumber, contractNumber } = entry;
  const {
    firstname,
    lastname,
    businessname,
    phone,
    altphone,
    cellphone,
    fax,
    email,
    billingTerms,
    notification,
  } = customer;
  const { address, city, state, zip } = property;

  const data: Data = [
    [
      { label: 'Customer', value: `${firstname} ${lastname}` },
      { label: 'Business Name', value: businessname },
    ],
    [
      { label: 'Primary Phone', value: phone, href: 'tel' },
      { label: 'Alternate Phone', value: altphone, href: 'tel' },
    ],
    [
      { label: 'Cell Phone', value: cellphone, href: 'tel' },
      { label: 'Fax', value: fax, href: 'tel' },
    ],
    [
      { label: 'Billing Terms', value: billingTerms },
      { label: 'Email', value: email, href: 'mailto' },
    ],
    [
      { label: 'Property', value: address },
      { label: 'City, State, Zip', value: `${city}, ${state} ${zip}` },
    ],
    ...(serviceCallId
      ? [
          [
            { label: 'Job Number', value: logJobNumber },
            { label: 'Contract Number', value: contractNumber },
          ],
        ]
      : []),
  ];

  const SCHEMA_PROJECT: Schema<EventType> = [
    [
      {
        name: 'dateStarted',
        label: 'Start Date',
        type: 'date',
        required: true,
      },
      {
        name: 'dateEnded',
        label: 'End Date',
        type: 'date',
        required: true,
      },
      {
        name: 'timeStarted',
        label: 'Time Started',
        type: 'time',
        required: true,
      },
      {
        name: 'timeEnded',
        label: 'Time Ended',
        type: 'time',
        required: true,
      },
    ],
    [
      {
        name: 'departmentId',
        label: 'Department',
        type: 'department',
        required: true,
      },
      {
        name: 'description',
        label: 'Description',
        multiline: true,
      },
    ],
    [
      {
        name: 'isAllDay',
        label: 'Is all-day?',
        type: 'checkbox',
      },
      {
        name: 'isLmpc',
        label: 'Is LMPC?',
        type: 'checkbox',
      },
      {
        name: 'highPriority',
        label: 'High priority?',
        type: 'checkbox',
      },
      {
        name: 'isResidential',
        label: 'Is residential?',
        type: 'checkbox',
      },
    ],
    [
      {
        name: 'color',
        label: 'Color',
        type: 'color',
      },
    ],
    [
      {
        name: 'propertyId',
        type: 'hidden',
      },
    ],
  ];

  return (
    <div>
      <SectionBar title={'Customer / Property Details'} actions={[]}>
        <InfoTable data={data} loading={loading} error={error} />
      </SectionBar>
      {
        <>
          {parentId != confirmedParentId && parentId != null && (
            <Confirm
              title="Confirm Parent"
              open={true}
              onClose={() => handleSetParentId(null)}
              onConfirm={() => handleSetConfirmedIsChild(parentId)}
            >
              Are you sure you want to set this project as the parent to the new
              project?
            </Confirm>
          )}
          {confirmedParentId && (
            <Typography variant="h5">Parent ID: {confirmedParentId}</Typography>
          )}

          <Tabs
            defaultOpenIdx={tabIdx}
            onChange={setTabIdx}
            tabs={[
              {
                label: 'General',
                content: loading ? (
                  <Loader />
                ) : (
                  <General
                    project={project!}
                    projectDepartment={timesheetDepartment!}
                  />
                ),
              },
              {
                label: 'Equipment',
                content: loading ? (
                  <InfoTable data={makeFakeRows(4, 4)} loading />
                ) : (
                  <Equipment
                    {...props}
                    serviceItem={entry}
                    customer={customer}
                    property={property}
                  />
                ),
              },
              {
                label: 'Billing',
                content: <BillingTab serviceCallId={serviceCallId} />,
              },
              {
                label: 'Logs',
                content: loading ? (
                  <Loader />
                ) : (
                  <LogsTab
                    serviceCallId={serviceCallId}
                    loggedUserId={loggedUserId}
                    project={project!}
                    role={role!}
                  />
                ),
              },
              {
                label: 'Create',
                content: (
                  <>
                    <Form
                      title="Create Project"
                      schema={SCHEMA_PROJECT}
                      data={{ ...new Event().toObject(), propertyId }}
                      onClose={onClose || (() => {})}
                      onSave={(data: EventType) =>
                        saveProject({
                          ...data,
                          departmentId: Number(data.departmentId),
                        })
                      }
                    />
                    {loaded && projects.length > 0 ? (
                      <GanttChart
                        events={projects.map(task => {
                          const {
                            id,
                            description,
                            dateStarted: dateStart,
                            dateEnded: dateEnd,
                            color,
                          } = task;
                          const [startDate, startHour] = dateStart.split(' ');
                          const [endDate, endHour] = dateEnd.split(' ');
                          return {
                            id,
                            startDate,
                            endDate,
                            startHour,
                            endHour,
                            notes: description,
                            statusColor: '#' + color,
                            onClick: () => {
                              handleSetParentId(id);
                            },
                          };
                        })}
                        startDate={projects[0].dateStarted.substr(0, 10)}
                        endDate={projects[projects.length - 1].dateEnded.substr(
                          0,
                          10,
                        )}
                        loading={loading}
                      />
                    ) : (
                      <Loader />
                    )}
                  </>
                ),
              },
            ]}
          />
        </>
      }
      {customer && serviceCallId > 0 && (
        <Modal
          open={notificationEditing || notificationViewing}
          onClose={() => {
            handleSetNotificationViewing(false)();
            handleSetNotificationEditing(false)();
          }}
        >
          <Form<UserType>
            title={
              notificationViewing
                ? 'Customer Notification'
                : `${
                    notification === '' ? 'Add' : 'Edit'
                  } Customer Notification`
            }
            schema={SCHEMA_PROPERTY_NOTIFICATION}
            data={customer}
            onSave={handleSaveCustomer}
            onClose={() => {
              handleSetNotificationViewing(false)();
              handleSetNotificationEditing(false)();
            }}
            disabled={saving}
            readOnly={notificationViewing}
            actions={
              notificationViewing
                ? [
                    {
                      label: 'Edit',
                      variant: 'outlined',
                      onClick: () => {
                        handleSetNotificationViewing(false)();
                        handleSetNotificationEditing(true)();
                      },
                    },
                    {
                      label: 'Delete',
                      variant: 'outlined',
                      onClick: () => {
                        handleSetNotificationViewing(false)();
                        handleSaveCustomer({ notification: '' } as UserType);
                      },
                    },
                  ]
                : []
            }
          />
        </Modal>
      )}
    </div>
  );
};
