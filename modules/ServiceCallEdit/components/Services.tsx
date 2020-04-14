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
import { Form } from '../../ComponentsLibrary/Form';
import { Modal } from '../../ComponentsLibrary/Modal';
// import { Field } from '../../ComponentsLibrary/Field';
import {
  loadServicesRendered,
  makeFakeRows,
  timestamp,
  formatDateTime,
  getRPCFields,
} from '../../../helpers';
import {
  ENDPOINT,
  SERVICE_STATUSES,
  SIGNATURE_PAYMENT_TYPE_LIST,
} from '../../../constants';
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

type SignatureType = {
  signature: string;
  authorizedSignorName: string;
  authorizedSignorRole: string;
  signorNotes: string;
  amountCollected: number;
  date: string;
  paymentType: string;
};

interface Props {
  serviceCallId: number;
  loggedUser: UserType;
}

const COLUMNS_SERVICES_RENDERED: Columns = [
  { name: 'Time' },
  { name: 'Technician' },
  { name: 'Services Rendered' },
  { name: 'Technician Notes' },
];

const COLUMNS_SERVICES_RENDERED_HISTORY: Columns = [
  { name: 'Time' },
  { name: 'Technician' },
  { name: 'Status' },
];

const SCHEMA_SIGNATURE: Schema<SignatureType> = [
  [
    {
      label: 'Signature',
      name: 'signature',
      type: 'signature',
    },
  ],
  [
    {
      label: 'Authorized Signor Name',
      name: 'authorizedSignorName',
    },
    {
      label: 'Authorized Signor Role',
      name: 'authorizedSignorRole',
    },
    {
      label: 'Signor Notes',
      name: 'signorNotes',
      multiline: true,
    },
  ],
  [
    {
      label: 'Date',
      name: 'date',
      type: 'date',
    },
    {
      label: 'Payment Type',
      name: 'paymentType',
      options: ['-- Select --', ...SIGNATURE_PAYMENT_TYPE_LIST],
    },
    {
      label: 'Amount Collected',
      name: 'amountCollected',
      startAdornment: '$',
    },
  ],
];

const SCHEMA_ON_CALL: Schema<ServicesRenderedType> = [
  [
    { label: 'Services Rendered', name: 'serviceRendered', multiline: true },
    {
      label: 'Technician Notes',
      name: 'techNotes',
      multiline: true,
      helperText: 'For internal use',
    },
  ],
  // [
  //   {
  //     content: (
  //       <Field
  //         label="Payment Collected"
  //         name="paymentCollected"
  //         value="1"
  //         type="checkbox"
  //       />
  //     ),
  //   }, // FIXME
  //   {
  //     content: (
  //       <Field label="Payment Type" name="paymentType" readOnly value="" />
  //     ),
  //   }, // TODO
  //   {
  //     content: (
  //       <Field
  //         label="Amount Collected"
  //         name="amountCollected"
  //         readOnly
  //         value=""
  //       />
  //     ),
  //   }, // TODO
  // ],
];

const SIGNATURE_INITIAL: SignatureType = {
  signature: '',
  authorizedSignorName: '',
  authorizedSignorRole: '',
  signorNotes: '',
  date: timestamp(true),
  paymentType: '-- Select --',
  amountCollected: 0,
};

export const Services: FC<Props> = ({ serviceCallId, loggedUser }) => {
  const { isAdmin } = loggedUser;
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [serviceRenderedForm, setServicesRenderedForm] = useState<
    ServicesRenderedType
  >(new ServicesRendered().toObject());
  const [servicesRendered, setServicesRendered] = useState<
    ServicesRenderedType[]
  >([]);
  const [signatureForm, setSignatureForm] = useState<SignatureType>(
    SIGNATURE_INITIAL,
  );
  const [deleting, setDeleting] = useState<ServicesRenderedType>();
  const [editing, setEditing] = useState<ServicesRenderedType>();
  const [saving, setSaving] = useState<boolean>(false);
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
      const fieldMaskList = ['EventId', 'Status', 'Name', 'Datetime'];
      SCHEMA_ON_CALL.forEach(row =>
        row.forEach(({ name }) => {
          const { upperCaseProp, methodName } = getRPCFields(name!);
          // @ts-ignore
          req[methodName](serviceRenderedForm[name]);
          fieldMaskList.push(upperCaseProp);
        }),
      );
      req.setFieldMaskList(fieldMaskList);
      await ServicesRenderedClientService.Create(req);
      load();
      setServicesRenderedForm(new ServicesRendered().toObject());
      setSignatureForm(SIGNATURE_INITIAL);
    },
    [
      loggedUser,
      load,
      serviceRenderedForm,
      setSignatureForm,
      setServicesRenderedForm,
    ],
  );
  const handleChangeServiceRendered = useCallback(
    async (data: ServicesRenderedType) => {
      if (editing) {
        setSaving(true);
        const req = new ServicesRendered();
        req.setId(editing.id);
        const fieldMaskList: string[] = [];
        SCHEMA_ON_CALL.forEach(row =>
          row.forEach(({ name }) => {
            const { upperCaseProp, methodName } = getRPCFields(name!);
            // @ts-ignore
            req[methodName](data[name]);
            fieldMaskList.push(upperCaseProp);
          }),
        );
        req.setFieldMaskList(fieldMaskList);
        await ServicesRenderedClientService.Update(req);
        await load();
        setSaving(false);
        setEditing(undefined);
      }
    },
    [editing, SCHEMA_ON_CALL, setSaving, setEditing],
  );
  const handleSetEditing = useCallback(
    (editing?: ServicesRenderedType) => () => setEditing(editing),
    [setEditing],
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
                      onClick={handleSetEditing(props)}
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
  // const lastEntry = servicesRendered[0];
  const lastStatus = servicesRendered[0] ? servicesRendered[0].status : '';
  const servicesRenderedData: Data = servicesRendered
    .filter(({ status }) => [COMPLETED, INCOMPLETE].includes(status))
    .map(({ datetime, name, serviceRendered, techNotes }) => [
      { value: datetime },
      { value: name },
      { value: serviceRendered },
      { value: techNotes },
    ]);
  return (
    <>
      {[COMPLETED, INCOMPLETE, ENROUTE, ADMIN].includes(lastStatus) &&
        servicesRenderedData.length > 0 && (
          <InfoTable
            columns={COLUMNS_SERVICES_RENDERED}
            data={servicesRenderedData}
            loading={saving}
          />
        )}
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
                        label: 'SAVE',
                        onClick: handleChangeStatus(SIGNED_AS),
                      },
                    ]
                  : []),
              ]
        }
      />
      {[PAYMENT].includes(lastStatus) && (
        <PlainForm
          schema={SCHEMA_SIGNATURE}
          data={signatureForm}
          onChange={setSignatureForm}
        />
      )}
      {[ON_CALL, ADMIN].includes(lastStatus) && (
        <PlainForm
          schema={SCHEMA_ON_CALL}
          data={serviceRenderedForm}
          onChange={setServicesRenderedForm}
        />
      )}
      <InfoTable
        columns={COLUMNS_SERVICES_RENDERED_HISTORY}
        data={data}
        loading={loading}
      />
      {deleting && (
        <ConfirmDelete
          open
          onClose={handleDeleting()}
          kind="Service Rendered Item"
          name={`Technician: ${deleting.name}, Status: ${deleting.status}`}
          onConfirm={handleDelete}
        />
      )}
      {editing && (
        <Modal open onClose={handleSetEditing()}>
          <Form<ServicesRenderedType>
            title="Services Rendered Edit"
            schema={SCHEMA_ON_CALL}
            data={editing}
            onClose={handleSetEditing()}
            onSave={handleChangeServiceRendered}
            disabled={saving}
          />
        </Modal>
      )}
    </>
  );
};

//Are you sure you want to delete this services rendered item?
