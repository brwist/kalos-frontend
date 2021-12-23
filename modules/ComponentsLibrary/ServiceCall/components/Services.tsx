import React, { FC, useState, useCallback } from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {
  ServicesRenderedClient,
  ServicesRendered,
} from '@kalos-core/kalos-rpc/ServicesRendered';
import { Payment, PaymentClient } from '@kalos-core/kalos-rpc/Payment';
import { Quotable } from '@kalos-core/kalos-rpc/Event';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { ZoomIn } from '@material-ui/icons';
import { SectionBar } from '../../SectionBar';
import { ConfirmDelete } from '../../ConfirmDelete';
import { InfoTable, Data, Columns } from '../../InfoTable';
import { PlainForm, Schema } from '../../PlainForm';
import { Form } from '../../Form';
import { Modal } from '../../Modal';
import { File } from '@kalos-core/kalos-rpc/File';
import { format } from 'date-fns';
import { QuoteSelector, SelectedQuote } from '../../QuoteSelector';
import {
  makeFakeRows,
  timestamp,
  formatDateTime,
  formatDateTimeDay,
  formatDay,
  formatDate,
  formatTime,
  EventClientService,
  makeSafeFormObject,
  uploadFileToS3Bucket,
  FileClientService,
} from '../../../../helpers';
import {
  ENDPOINT,
  SERVICE_STATUSES,
  SIGNATURE_PAYMENT_TYPE_LIST,
  PAYMENT_COLLECTED_LIST,
  PAYMENT_NOT_COLLECTED_LIST,
  OPTION_BLANK,
} from '../../../../constants';
import './services.less';
import { User } from '@kalos-core/kalos-rpc/User';

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

type ServicesRenderedPaymentType = {
  servicesRenderedId: number;
  servicesRendered: string;
  technicianNotes: string;
  paymentCollected: number;
  amountCollected: number;
  paymentType: string;
  dateProcessed: string;
  paymentId: number;
};
type PaymentAndSignatureType = {
  signature: string;
  authorizedSignorName: string;
  authorizedSignorRole: string;
  signorNotes: string;
  amountCollected: number;
  date: string;
  paymentType: string;
};
type PaymentType = {
  paymentCollected: number;
  amountCollected: number;
  date: string;
  paymentType: string;
};
type SignatureType = {
  signature: string;
  authorizedSignorName: string;
  authorizedSignorRole: string;
  signorNotes: string;
};

interface Props {
  serviceCallId: number;
  loggedUser: User;
  servicesRendered: ServicesRendered[];
  loadServicesRendered: () => void;
  loading: boolean;
  onAddMaterials: (materialUsed: string, materialTotal: number) => void;
}

const COLUMNS_SERVICES_RENDERED: Columns = [
  { name: 'Date/Time' },
  { name: 'Technician' },
  { name: 'Services Rendered' },
  { name: 'Technician Notes' },
];

const COLUMNS_SERVICES_RENDERED_HISTORY: Columns = [
  { name: 'Date/Time' },
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
];

const SCHEMA_PAYMENT_AND_SIGNATURE: Schema<PaymentAndSignatureType> = [
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
    {
      label: 'Payment Type',
      name: 'paymentType',
      options: [OPTION_BLANK, ...SIGNATURE_PAYMENT_TYPE_LIST],
    },
    {
      label: 'Amount Collected',
      name: 'amountCollected',
      type: 'number',
      startAdornment: '$',
    },
    {
      label: 'Date Processed',
      name: 'date',
      type: 'date',
    },
  ],
];
const SCHEMA_PAYMENT: Schema<PaymentType> = [
  [
    {
      label: 'Payment Type',
      name: 'paymentType',
      options: [OPTION_BLANK, ...SIGNATURE_PAYMENT_TYPE_LIST],
    },
    {
      label: 'Amount Collected',
      name: 'amountCollected',
      type: 'number',
      startAdornment: '$',
    },
    {
      label: 'Payment Collected?',
      name: 'paymentCollected',
      type: 'checkbox',
    },
    {
      label: 'Date Processed',
      name: 'date',
      type: 'date',
    },
  ],
];
const PAYMENT_INITIAL: PaymentAndSignatureType = {
  signature: '',
  authorizedSignorName: '',
  authorizedSignorRole: '',
  signorNotes: '',
  date: timestamp(true),
  paymentType: OPTION_BLANK,
  amountCollected: 0,
};

const SIGNATURE_INITIAL: SignatureType = {
  signature: '',
  authorizedSignorName: '',
  authorizedSignorRole: '',
  signorNotes: '',
};
const SERVICES_RENDERED_PAYMENT_INITIAL: ServicesRenderedPaymentType = {
  servicesRenderedId: 0,
  servicesRendered: '',
  technicianNotes: '',
  paymentType: OPTION_BLANK,
  amountCollected: 0,
  paymentCollected: 0,
  paymentId: 0,
  dateProcessed: '',
};
export const Services: FC<Props> = ({
  serviceCallId,
  loggedUser,
  servicesRendered,
  loadServicesRendered,
  loading,
  onAddMaterials,
}) => {
  const [serviceRenderedForm, setServicesRenderedForm] =
    useState<ServicesRendered>(new ServicesRendered());
  const [paymentForm, setPaymentForm] =
    useState<PaymentAndSignatureType>(PAYMENT_INITIAL);
  const [viewPayment, setViewPayment] = useState<PaymentType>();
  const [viewSignature, setViewSignature] = useState<PaymentType>();

  const [signatureForm, setSignatureForm] =
    useState<SignatureType>(SIGNATURE_INITIAL);
  const [deleting, setDeleting] = useState<ServicesRendered>();

  const [editing, setEditing] = useState<ServicesRenderedPaymentType>(
    SERVICES_RENDERED_PAYMENT_INITIAL,
  );
  const [saving, setSaving] = useState<boolean>(false);
  const [pendingSelectedQuote, setPendingSelectedQuote] = useState<
    SelectedQuote[]
  >([]);
  const [changingStatus, setChangingStatus] = useState<boolean>(false);
  const SCHEMA_ON_CALL: Schema<ServicesRenderedPaymentType> = [
    [
      {
        label: 'Services Rendered',
        name: 'servicesRendered',
        multiline: true,
      },
      {
        name: 'servicesRenderedId',
        type: 'hidden',
      },
      {
        label: 'Technician Notes',
        name: 'technicianNotes',
        multiline: true,
        helperText: 'For internal use',
      },
    ],
    [
      {
        label: 'Payment Collected',
        name: 'paymentCollected',
        type: 'checkbox',
      },
      {
        label: 'Id',
        name: 'paymentId',
        type: 'hidden',
      },
      {
        label: 'Payment Type',
        name: 'paymentType',
        options: [
          OPTION_BLANK,
          ...(editing?.paymentCollected
            ? PAYMENT_COLLECTED_LIST
            : PAYMENT_NOT_COLLECTED_LIST),
        ],
      },
      {
        label: 'Amount Collected',
        name: 'amountCollected',
        type: 'number',
        startAdornment: '$',
      },
    ],
  ];

  const handleDeleting = useCallback(
    (deleting?: ServicesRendered) => () => setDeleting(deleting),
    [setDeleting],
  );
  const handleDelete = useCallback(async () => {
    if (deleting) {
      setDeleting(undefined);
      const req = new ServicesRendered();
      req.setId(deleting.getId());
      await ServicesRenderedClientService.Delete(req);
      loadServicesRendered();
    }
  }, [deleting, loadServicesRendered]);
  const handleChangeStatus = useCallback(
    (status: string) => async () => {
      setChangingStatus(true);
      const req = new ServicesRendered();
      req.setEventId(serviceCallId);
      const isSignature = status === SIGNED_AS;
      const statusToSave = `${status}${
        isSignature
          ? ` ${
              signatureForm.authorizedSignorRole ||
              paymentForm.authorizedSignorRole
            }`
          : ''
      }`;
      req.setStatus(statusToSave);
      req.setName(
        isSignature
          ? `${
              signatureForm.authorizedSignorName ||
              paymentForm.authorizedSignorName
            }`
          : `${loggedUser.getFirstname()} ${loggedUser.getLastname()}`,
      );
      req.setDatetime(timestamp());
      const fieldMaskList = ['EventId', 'Status', 'Name', 'Datetime'];
      req.setFieldMaskList(fieldMaskList);
      const res = await ServicesRenderedClientService.Create(req);
      if (isSignature) {
        console.log('we are signing');
        const fileReq = new File();
        fileReq.setMimeType('image/png');
        fileReq.setBucket('kalosdoc-prod');
        const fileName = `signature/${res.getId()}-${serviceCallId}-${format(
          new Date(),
          'hhmmss',
        )}.png`;
        await uploadFileToS3Bucket(
          fileName,
          signatureForm.signature,
          fileReq.getBucket(),
          'signature',
        );

        fileReq.setName(fileName);
        FileClientService.Create(fileReq);
        console.log(fileReq);
      }
      if (paymentForm != PAYMENT_INITIAL) {
        console.log('create payment');
        const paymentReq = new Payment();
        paymentReq.setCollected(1);
        paymentReq.setAmountCollected(paymentForm.amountCollected);
        paymentReq.setType(paymentForm.paymentType);
        const paymentClientService = new PaymentClient(ENDPOINT);
        const paymentServicesRender = servicesRendered.find(
          service => service.getStatus() == PAYMENT,
        );
        if (paymentServicesRender) {
          paymentReq.setServicesRenderedId(paymentServicesRender.getId());
          await paymentClientService.Create(paymentReq);
        } else {
          console.log('we did not find a payment');
        }
      }
      //create png image, upload Name of signature is
      //"signature/#form.event_id#-#local.services_rendered_id#-#timeFormat(now(),'hhmmss')#.png"
      //After successful creation,Signature ID=file ID in table
      setServicesRenderedForm(new ServicesRendered());

      setPaymentForm(PAYMENT_INITIAL);
      setSignatureForm(SIGNATURE_INITIAL);
      setChangingStatus(false);
      await loadServicesRendered();
    },
    [
      loggedUser,
      loadServicesRendered,
      setSignatureForm,
      setServicesRenderedForm,
      setPaymentForm,
      servicesRendered,
      signatureForm,
      paymentForm,
      serviceCallId,
    ],
  );

  const handleChangeServiceRendered = useCallback(
    async (data: ServicesRenderedPaymentType) => {
      if (editing) {
        const paymentClientService = new PaymentClient(ENDPOINT);
        setSaving(true);
        let srReq = new ServicesRendered();
        srReq.setServiceRendered(data.servicesRendered);
        srReq.setTechNotes(data.technicianNotes);
        srReq.setId(data.servicesRenderedId);
        srReq.setFieldMaskList(['TechNotes', 'ServicesRendered']);
        //update sr
        await ServicesRenderedClientService.Update(srReq);

        const paymentReq = new Payment();
        paymentReq.setId(data.paymentId);
        paymentReq.setCollected(data.paymentCollected);
        paymentReq.setAmountCollected(data.amountCollected);
        paymentReq.setType(data.paymentType);

        //if payment ID, update, else create
        if (paymentReq.getId() == 0) {
          paymentReq.setServicesRenderedId(srReq.getId());
          paymentClientService.Create(paymentReq);
        } else {
          paymentReq.setFieldMaskList(['Collected', 'AmountCollected', 'Type']);
          paymentClientService.Update(paymentReq);
        }
        setSaving(false);
        const init: ServicesRenderedPaymentType = {
          servicesRenderedId: 0,
          servicesRendered: '',
          technicianNotes: '',
          paymentType: OPTION_BLANK,
          amountCollected: 0,
          paymentCollected: 0,
          paymentId: 0,
          dateProcessed: '',
        };
        setEditing(init);
      }
      loadServicesRendered();
    },
    [editing, setSaving, setEditing, loadServicesRendered],
  );
  const handleSetEditing = useCallback(
    (sr?: ServicesRendered) => async () => {
      const paymentReq = new Payment();
      const paymentClientService = new PaymentClient(ENDPOINT);
      const temp: ServicesRenderedPaymentType = {
        servicesRenderedId: 0,
        servicesRendered: '',
        technicianNotes: '',
        paymentType: OPTION_BLANK,
        amountCollected: 0,
        paymentCollected: 0,
        paymentId: 0,
        dateProcessed: '',
      };
      if (sr) {
        temp.servicesRendered = sr.getServiceRendered();
        temp.servicesRenderedId = sr.getId();
        temp.technicianNotes = sr.getTechNotes();

        try {
          paymentReq.setServicesRenderedId(sr.getId());
          const paymentResults = await paymentClientService.Get(paymentReq);
          if (paymentResults) {
            temp.amountCollected = paymentResults.getAmountCollected();
            temp.paymentCollected = paymentResults.getCollected();
            temp.paymentId = paymentResults.getId();
            temp.paymentType = paymentResults.getType();
          }
        } catch (error) {
          console.log('no payment found, stick with default');
        }
      }
      setEditing(temp);
    },
    [],
  );
  const handleSetViewPreview = useCallback(
    (sr: ServicesRendered, status: string) => async () => {
      if (status === PAYMENT) {
        console.log('payment');
        const paymentClientService = new PaymentClient(ENDPOINT);
        const paymentReq = new Payment();
        paymentReq.setServicesRenderedId(sr.getId());
        const paymentResults = await paymentClientService.Get(paymentReq);
        if (paymentResults) {
          setViewPayment({
            paymentType: paymentResults.getType(),
            amountCollected: paymentResults.getAmountCollected(),
            paymentCollected: paymentResults.getCollected(),
            date: format(new Date(), 'yyyy-MM-dd'),
          });
        }
      } else {
        console.log('signature');
        const fileReq = new File();
        fileReq.setName(`%signature/${sr.getEventId()}-${sr.getId()}%`);
        const fileRes = FileClientService.Get(fileReq);
      }
    },
    [],
  );
  const data: Data = loading
    ? makeFakeRows(4, 3)
    : servicesRendered.map(props => {
        return [
          { value: formatDateTime(props.getDatetime()) },
          { value: props.getName() },
          {
            value: (
              <span
                style={{
                  ...([COMPLETED, INCOMPLETE].includes(props.getStatus())
                    ? {
                        color:
                          props.getStatus() === COMPLETED ? 'green' : 'red',
                      }
                    : {}),
                }}
              >
                {props.getStatus()}
              </span>
            ),
            actions: [
              ...([COMPLETED, INCOMPLETE].includes(props.getStatus())
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
              ...([SIGNED_AS, PAYMENT].includes(props.getStatus())
                ? [
                    <IconButton
                      key={1}
                      onClick={handleSetViewPreview(
                        props,
                        SIGNED_AS.includes(props.getStatus())
                          ? SIGNED_AS
                          : PAYMENT,
                      )}
                      size="small"
                    >
                      <ZoomIn />
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
  let lastStatus = servicesRendered[servicesRendered.length - 1]
    ? servicesRendered[servicesRendered.length - 1].getStatus()
    : '';
  if (lastStatus.startsWith(SIGNED_AS)) {
    lastStatus = SIGNED_AS;
  }
  const servicesRenderedData: Data = servicesRendered
    .filter(
      sr =>
        [COMPLETED, INCOMPLETE].includes(sr.getStatus()) &&
        !(sr.getServiceRendered() === '' && sr.getTechNotes() === ''),
    )
    .map(sr => [
      { value: formatDateTimeDay(sr.getDatetime()) },
      { value: sr.getName() },
      { value: sr.getServiceRendered() },
      { value: sr.getTechNotes() },
    ]);

  return (
    <>
      {[COMPLETED, INCOMPLETE, ENROUTE, ADMIN].includes(lastStatus) &&
        servicesRenderedData.length > 0 && (
          <>
            <SectionBar title="Services Rendered and Technician Notes" />
            <InfoTable
              columns={COLUMNS_SERVICES_RENDERED}
              data={servicesRenderedData}
              loading={saving}
            />
          </>
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
                        disabled:
                          [ENROUTE, ON_CALL, ADMIN].includes(lastStatus) ||
                          changingStatus,
                      },
                    ]
                  : []),
                ...([ENROUTE, ON_CALL].includes(lastStatus)
                  ? [
                      {
                        label: ON_CALL,
                        onClick: handleChangeStatus(ON_CALL) || changingStatus,
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
                ].includes(lastStatus) && loggedUser.getIsAdmin()
                  ? [
                      {
                        label: ADMIN,
                        onClick: handleChangeStatus(ADMIN),
                        disabled: changingStatus,
                      },
                    ]
                  : []),
                ...([ON_CALL, ADMIN].includes(lastStatus)
                  ? [
                      {
                        label: COMPLETED,
                        onClick: handleChangeStatus(COMPLETED),
                        disabled: changingStatus,
                        status: 'success' as const,
                      },
                      {
                        label: INCOMPLETE,
                        onClick: handleChangeStatus(INCOMPLETE),
                        disabled: changingStatus,
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
                        disabled: changingStatus,
                      },
                      {
                        label: SIGNATURE,
                        onClick: handleChangeStatus(SIGNATURE),
                        disabled: changingStatus,
                      },
                    ]
                  : []),
                ...([SIGNATURE, PAYMENT].includes(lastStatus)
                  ? [
                      {
                        label: 'SAVE',
                        onClick: handleChangeStatus(SIGNED_AS),
                        disabled: changingStatus,
                      },
                    ]
                  : []),
              ]
        }
      />
      {[PAYMENT].includes(lastStatus) && (
        <PlainForm
          schema={SCHEMA_PAYMENT_AND_SIGNATURE}
          data={paymentForm}
          onChange={setPaymentForm}
        />
      )}
      {[SIGNATURE].includes(lastStatus) && (
        <PlainForm
          schema={SCHEMA_SIGNATURE}
          data={signatureForm}
          onChange={setSignatureForm}
        />
      )}

      {/*[ON_CALL, ADMIN].includes(lastStatus) && (
        <>
          <PlainForm
            schema={SCHEMA_ON_CALL}
            data={serviceRenderedForm}
            onChange={setServicesRenderedForm}
            compact
            className="ServicesOnCallForm"
          />
          <PlainForm
            key={paymentFormKey}
            schema={SCHEMA_PAYMENT_PART}
            data={paymentFormPart}
            onChange={handlePaymentFormChange}
            compact
          />
        </>
      )*/}
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
          name={`Technician: ${deleting.getName()}, Status: ${deleting.getStatus()}`}
          onConfirm={handleDelete}
        />
      )}
      {editing.servicesRenderedId != 0 && (
        <Modal open onClose={handleSetEditing()}>
          <div className="ServicesEditing">
            <Form<ServicesRenderedPaymentType>
              title="Services Rendered Edit"
              schema={SCHEMA_ON_CALL}
              data={editing}
              onClose={handleSetEditing()}
              onSave={handleChangeServiceRendered}
              disabled={saving}
            ></Form>
            <QuoteSelector
              serviceCallId={serviceCallId}
              servicesRenderedId={editing.servicesRenderedId}
              onAddQuotes={setPendingSelectedQuote}
              onAdd={console.log}
            ></QuoteSelector>
          </div>
        </Modal>
      )}
      {viewPayment != undefined && (
        <Modal open onClose={() => setViewPayment(undefined)}>
          <div className="ServicesEditing">
            <PlainForm<PaymentType>
              schema={SCHEMA_PAYMENT}
              onChange={console.log}
              data={viewPayment}
              disabled={saving}
            ></PlainForm>
          </div>
        </Modal>
      )}
    </>
  );
};
