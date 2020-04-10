import React, { FC, useState, useCallback, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {
  ServicesRenderedClient,
  ServicesRendered,
} from '@kalos-core/kalos-rpc/ServicesRendered';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { InfoTable, Data, Columns } from '../../ComponentsLibrary/InfoTable';
import { PlainForm, Schema } from '../../ComponentsLibrary/PlainForm';
import { Field } from '../../ComponentsLibrary/Field';
import {
  loadServicesRendered,
  makeFakeRows,
  timestamp,
  formatDateTime,
} from '../../../helpers';
import { ENDPOINT, SERVICE_STATUSES } from '../../../constants';
import { UserType } from './ServiceCallDetails';

const ServicesRenderedClientService = new ServicesRenderedClient(ENDPOINT);

const {
  NO_STATUS,
  ENROUTE,
  ON_CALL,
  ADMIN,
  PAYMENT,
  SIGNATURE,
  COMPLETED,
  INCOMPLETE,
  SIGNED_AS,
} = SERVICE_STATUSES;

type ServicesRenderedType = ServicesRendered.AsObject;

interface Props {
  serviceCallId: number;
  loggedUser: UserType;
}

const COLUMNS: Columns = [
  { name: 'Time' },
  { name: 'Technician' },
  { name: 'Status' },
];

const SCHEMA_ON_CALL: Schema<ServicesRenderedType> = [
  [
    { label: 'Services Rendered', name: 'serviceRendered', multiline: true },
    { label: 'Technician Notes', name: 'techNotes', multiline: true },
  ],
  [
    {
      content: (
        <Field
          label="Payment Collected"
          name="paymentCollected"
          value="1"
          type="checkbox"
        />
      ),
    }, // FIXME
    {
      content: (
        <Field label="Payment Type" name="paymentType" readOnly value="" />
      ),
    }, // TODO
    {
      content: (
        <Field
          label="Amount Collected"
          name="amountCollected"
          readOnly
          value=""
        />
      ),
    }, // TODO
  ],
];

export const Services: FC<Props> = ({ serviceCallId, loggedUser }) => {
  const { isAdmin } = loggedUser;
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [servicesRendered, setServicesRendered] = useState<
    ServicesRenderedType[]
  >([]);
  const [deleting, setDeleting] = useState<ServicesRenderedType>();
  const load = useCallback(async () => {
    setLoading(true);
    const servicesRendered = await loadServicesRendered(serviceCallId);
    setServicesRendered(servicesRendered);
    setLoading(false);
  }, [setServicesRendered, serviceCallId]);
  useEffect(() => {
    if (!loaded) {
      load();
      setLoaded(true);
    }
  }, [loaded, load, setLoaded]);
  const handleDeleting = useCallback(
    (deleting?: ServicesRenderedType) => () => setDeleting(deleting),
    [setDeleting],
  );
  const handleDelete = useCallback(async () => {
    if (deleting) {
      setDeleting(undefined);
      const req = new ServicesRendered();
      req.setId(deleting.id);
      await ServicesRenderedClientService.Delete(req);
      load();
    }
  }, [deleting]);
  const handleChangeStatus = useCallback(
    (status: string) => async () => {
      const req = new ServicesRendered();
      req.setEventId(serviceCallId);
      req.setStatus(status);
      req.setName(`${loggedUser.firstname} ${loggedUser.lastname}`);
      req.setDatetime(timestamp());
      await ServicesRenderedClientService.Create(req);
      load();
    },
    [loggedUser, load],
  );
  const data: Data = loading
    ? makeFakeRows(4, 3)
    : servicesRendered.map(props => {
        const { datetime, name, status } = props;
        return [
          { value: formatDateTime(datetime) },
          { value: name },
          {
            value: (
              <span
                style={{
                  ...([COMPLETED, INCOMPLETE].includes(status)
                    ? {
                        color: status === COMPLETED ? 'green' : 'red',
                      }
                    : {}),
                }}
              >
                {status}
              </span>
            ),
            actions: [
              ...([COMPLETED, INCOMPLETE].includes(status)
                ? [
                    <IconButton
                      key={1}
                      // onClick={handleDeleting(props)} // TODO
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>,
                  ]
                : []),
              <IconButton key={0} onClick={handleDeleting(props)} size="small">
                <DeleteIcon />
              </IconButton>,
            ],
          },
        ];
      });
  const lastEntry = servicesRendered[0];
  const lastStatus = servicesRendered[0] ? servicesRendered[0].status : '';
  return (
    <>
      <SectionBar
        title="Services Rendered History"
        actions={
          loading
            ? []
            : [
                ...([
                  NO_STATUS,
                  ENROUTE,
                  ON_CALL,
                  COMPLETED,
                  INCOMPLETE,
                  PAYMENT,
                  SIGNATURE,
                  ADMIN,
                  SIGNED_AS,
                ].includes(lastStatus)
                  ? [
                      {
                        label: ENROUTE,
                        onClick: handleChangeStatus(ENROUTE),
                        disabled: [ENROUTE, ON_CALL, ADMIN].includes(
                          lastStatus,
                        ),
                      },
                    ]
                  : []),
                ...([ENROUTE, ON_CALL].includes(lastStatus)
                  ? [
                      {
                        label: ON_CALL,
                        onClick: handleChangeStatus(ON_CALL),
                        disabled: [ON_CALL].includes(lastStatus),
                      },
                    ]
                  : []),
                ...([
                  NO_STATUS,
                  COMPLETED,
                  INCOMPLETE,
                  PAYMENT,
                  SIGNATURE,
                  ADMIN,
                  SIGNED_AS,
                ].includes(lastStatus) && isAdmin
                  ? [
                      {
                        label: ADMIN,
                        onClick: handleChangeStatus(ADMIN),
                      },
                    ]
                  : []),
                ...([ON_CALL, ADMIN].includes(lastStatus)
                  ? [
                      {
                        label: COMPLETED,
                        onClick: handleChangeStatus(COMPLETED),
                        status: 'success' as const,
                      },
                      {
                        label: INCOMPLETE,
                        onClick: handleChangeStatus(INCOMPLETE),
                        status: 'failure' as const,
                      },
                    ]
                  : []),
                ...([
                  NO_STATUS,
                  ENROUTE,
                  COMPLETED,
                  INCOMPLETE,
                  SIGNED_AS,
                ].includes(lastStatus)
                  ? [
                      {
                        label: PAYMENT,
                        onClick: handleChangeStatus(PAYMENT),
                      },
                      {
                        label: SIGNATURE,
                        onClick: handleChangeStatus(SIGNATURE),
                      },
                    ]
                  : []),
                ...([PAYMENT, SIGNATURE].includes(lastStatus)
                  ? [
                      {
                        label: 'CLEAR',
                        // onClick: handleChangeStatus(PAYMENT),
                      },
                      {
                        label: 'SAVE',
                        onClick: handleChangeStatus(SIGNED_AS),
                      },
                    ]
                  : []),
              ]
        }
      />
      {lastStatus === ON_CALL && (
        <PlainForm
          schema={SCHEMA_ON_CALL}
          data={lastEntry}
          onChange={() => {}}
        />
      )}
      <InfoTable columns={COLUMNS} data={data} loading={loading} />
      {deleting && (
        <ConfirmDelete
          open
          onClose={handleDeleting()}
          kind="Service Rendered Item"
          name={`Technician: ${deleting.name}, Status: ${deleting.status}`}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

//Are you sure you want to delete this services rendered item?
