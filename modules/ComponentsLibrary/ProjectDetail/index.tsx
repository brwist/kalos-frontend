import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { User } from '@kalos-core/kalos-rpc/User';
import { JobTypeSubtype } from '@kalos-core/kalos-rpc/JobTypeSubtype';
import { Property } from '@kalos-core/kalos-rpc/Property';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered';
import {
  getRPCFields,
  makeFakeRows,
  PropertyClientService,
  loadProjects,
  TimesheetDepartmentClientService,
  makeSafeFormObject,
  UserClientService,
  EventClientService,
} from '../../../helpers';
import { Modal } from '../Modal';
import { SectionBar } from '../SectionBar';
import { InfoTable, Data } from '../InfoTable';
import { Tabs } from '../Tabs';
import { Form, Schema } from '../Form';
import { General } from './components/General';
import { Equipment } from './components/Equipment';
import { Confirm } from '../Confirm';
import { GanttChart } from '../GanttChart';
import { Loader } from '../../Loader/main';
import Typography from '@material-ui/core/Typography';
import { BillingTab } from './components/Billing';
import { LogsTab } from './components/Logs';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { RoleType } from '../Payroll';

export type EventType = Event;
export type JobTypeSubtypeType = JobTypeSubtype;
export type ServicesRenderedType = ServicesRendered;

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
  const [confirmedParentId, setConfirmedParentId] = useState<number | null>(
    null,
  );
  const [project, setProject] = useState<Event>();
  const [timesheetDepartment, setTimesheetDepartment] =
    useState<TimesheetDepartment>();
  const loadEntry = useCallback(
    async (_serviceCallId = serviceCallId) => {
      if (_serviceCallId) {
        const req = new Event();
        req.setId(_serviceCallId);
        let entry;
        try {
          entry = await EventClientService.Get(req);
        } catch (err) {
          console.error(
            `An error occurred while getting an event with the service call id ${_serviceCallId}: ${err}`,
          );
        }
        if (!entry) {
          console.error(
            `Could not set entry as there was no response from EventClientService.Get. Returning.`,
          );
          return;
        }
        setEntry(entry);
      }
    },
    [setEntry, serviceCallId],
  );
  const load = useCallback(async () => {
    setLoading(true);
    try {
      let promises = [];

      let projectGotten: Event | undefined;

      promises.push(
        new Promise<void>(async (resolve, reject) => {
          let customer: User | undefined;
          try {
            customer = await UserClientService.loadUserById(userID);
            console.log('Loaded user by id : ', userID);
          } catch (err) {
            console.error(
              `An error occurred while getting the logged user or role type: ${err}`,
            );
            setError(true);
            resolve();
          }
          if (customer) {
            console.error(
              'No customer to set customer with or check permission groups with. Rejecting.',
            );
            setError(true);
            resolve();
          }
          setCustomer(customer!);
          if (customer!.getPermissionGroupsList()) {
            const roleGotten = customer!
              .getPermissionGroupsList()
              .find(p => p.getType() === 'role');
            if (roleGotten) setRole(roleGotten.getName() as RoleType);
          }
          resolve();
        }),
      );

      promises.push(
        new Promise<void>(async (resolve, reject) => {
          try {
            let req = new Event();
            req.setId(serviceCallId);
            let response: Event | undefined;
            try {
              response = await EventClientService.Get(req);
            } catch (err) {
              console.error(
                `An error occurred while getting an event from the event client service: ${err}`,
              );
            }

            if (!response) {
              console.error(
                'No response was given to the event client service, so no project is being set with SetProject. Rejecting.',
              );
              reject(
                'No response was given to the event client service, so no project is being set with SetProject.',
              );
            }

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
          let property;
          try {
            property = await PropertyClientService.loadPropertyByID(propertyId);
          } catch (err) {
            console.error(
              `An error occurred while attempting to load a property by ID: ${err}`,
            );
          }
          if (property) setProperty(property);
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
          let projects: Event[] = [];
          try {
            projects = await loadProjects();
          } catch (err) {
            console.error(`An error occurred while loading projects: ${err}`);
          }
          if (projects) setProjects(projects);
          resolve();
        }),
      );

      Promise.all(promises).then(async () => {
        try {
          if (projectGotten) {
            let req = new TimesheetDepartment();
            req.setId(projectGotten!.getDepartmentId());
            const timesheetDepartment =
              await TimesheetDepartmentClientService.Get(req);
            setTimesheetDepartment(timesheetDepartment);
          }
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
    let res;
    try {
      res = await EventClientService[serviceCallId ? 'Update' : 'Create'](req);
    } catch (err) {
      console.error(`An error occurred while saving a service call: ${err}`);
    }

    if (!res) {
      console.error(
        'Failed to continue saving service call - no result was provided from the event client service after save. ',
      );
      return;
    }

    setEntry(res);
    setSaving(false);
    if (!serviceCallId) {
      setServiceCallId(res.getId());
      await loadEntry(res.getId());
    }
    if (onSave) {
      onSave();
    }
  }, [serviceCallId, setEntry, setSaving, setLoading, onSave, loadEntry]);
  const saveProject = useCallback(
    async (data: EventType) => {
      setSaving(true);
      if (confirmedParentId) data.setParentId(confirmedParentId);
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
    if (entry && entry.getCustomer()?.getNotification() !== '') {
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
    async (data: User) => {
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

  const data: Data = [
    [
      {
        label: 'Customer',
        value: `${customer.getFirstname()} ${customer.getLastname()}`,
      },
      { label: 'Business Name', value: customer.getBusinessname() },
    ],
    [
      { label: 'Primary Phone', value: customer.getPhone(), href: 'tel' },
      { label: 'Alternate Phone', value: customer.getAltphone(), href: 'tel' },
    ],
    [
      { label: 'Cell Phone', value: customer.getCellphone(), href: 'tel' },
      { label: 'Fax', value: customer.getFax(), href: 'tel' },
    ],
    [
      { label: 'Billing Terms', value: customer.getBillingTerms() },
      { label: 'Email', value: customer.getEmail(), href: 'mailto' },
    ],
    [
      { label: 'Property', value: property.getAddress() },
      {
        label: 'City, State, Zip',
        value: `${property.getCity()}, ${property.getState()} ${property.getZip()}`,
      },
    ],
    ...(serviceCallId
      ? [
          [
            { label: 'Job Number', value: entry.getLogJobNumber() },
            { label: 'Contract Number', value: entry.getContractNumber() },
          ],
        ]
      : []),
  ];

  const SCHEMA_PROJECT: Schema<EventType> = [
    [
      {
        name: 'getDateStarted',
        label: 'Start Date',
        type: 'date',
        required: true,
      },
      {
        name: 'getDateEnded',
        label: 'End Date',
        type: 'date',
        required: true,
      },
      {
        name: 'getTimeStarted',
        label: 'Time Started',
        type: 'time',
        required: true,
      },
      {
        name: 'getTimeEnded',
        label: 'Time Ended',
        type: 'time',
        required: true,
      },
    ],
    [
      {
        name: 'getDepartmentId',
        label: 'Department',
        type: 'department',
        required: true,
      },
      {
        name: 'getDescription',
        label: 'Description',
        multiline: true,
      },
    ],
    [
      {
        name: 'getIsAllDay',
        label: 'Is all-day?',
        type: 'checkbox',
      },
      {
        name: 'getIsLmpc',
        label: 'Is LMPC?',
        type: 'checkbox',
      },
      {
        name: 'getHighPriority',
        label: 'High priority?',
        type: 'checkbox',
      },
      {
        name: 'getIsResidential',
        label: 'Is residential?',
        type: 'checkbox',
      },
    ],
    [
      {
        name: 'getColor',
        label: 'Color',
        type: 'color',
      },
    ],
    [
      {
        name: 'getPropertyId',
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
                content:
                  loading || !loaded ? (
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
                      data={(() => {
                        const res = new Event();
                        res.setPropertyId(propertyId);
                        return res;
                      })()}
                      onClose={onClose || (() => {})}
                      onSave={(data: EventType) => {
                        const project = makeSafeFormObject(data, new Event());
                        project.setDepartmentId(data.getDepartmentId());
                        saveProject(project);
                      }}
                    />
                    {loaded && projects.length > 0 ? (
                      <GanttChart
                        events={projects.map(task => {
                          const [startDate, startHour] = task
                            .getDateStarted()
                            .split(' ');
                          const [endDate, endHour] = task
                            .getDateEnded()
                            .split(' ');
                          return {
                            id: task.getId(),
                            startDate,
                            endDate,
                            startHour,
                            endHour,
                            notes: task.getDescription(),
                            statusColor: `#${task.getColor()}`,
                            onClick: () => {
                              handleSetParentId(task.getId());
                            },
                          };
                        })}
                        startDate={projects[0].getDateStarted().substr(0, 10)}
                        endDate={projects[projects.length - 1]
                          .getDateEnded()
                          .substr(0, 10)}
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
          <Form<User>
            title={
              notificationViewing
                ? 'Customer Notification'
                : `${
                    customer.getNotification() === '' ? 'Add' : 'Edit'
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
                        //handleSaveCustomer({ notification: '' } as User);
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
