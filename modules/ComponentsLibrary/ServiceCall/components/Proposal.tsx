import React, { FC, useState, useCallback } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { StoredQuote } from '@kalos-core/kalos-rpc/StoredQuote';
import { SectionBar } from '../../SectionBar';
import { PlainForm, Schema } from '../../PlainForm';
import { Field, Value } from '../../Field';
import { InfoTable, Columns, Data } from '../../InfoTable';
import { Form } from '../../Form';
import { Modal } from '../../Modal';
import { StoredQuotes } from '../../StoredQuotes';
import { EventType } from '../';
import { ProposalPrint } from './ProposalPrint';
import './proposal.less';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered';
import { User } from '@kalos-core/kalos-rpc/User';
import { Property } from '@kalos-core/kalos-rpc/Property';
import { makeSafeFormObject, formatDateDay } from '../../../../helpers';
interface Props {
  serviceItem: EventType;
  property: Property;
  customer: User;
  servicesRendered: ServicesRendered[];
}

type Form = {
  displayName: string;
  withJobNotes: number;
  notes: string;
};

type Notes = {
  notes: string;
};

type File = {
  localCopyName: string;
  fileDescription: string;
};

const SCHEMA_ENTRY: Schema<StoredQuote> = [
  [{ name: 'getId', type: 'hidden' }],
  [{ label: 'Description', name: 'getDescription', multiline: true }],
  [{ label: 'Price', name: 'getPrice', type: 'number', startAdornment: '$' }],
];
const SCHEMA_FILE: Schema<File> = [
  [{ label: 'File', headline: true }],
  [
    {
      label: 'Name your local copy',
      name: 'localCopyName',
      helperText:
        'If you do not specify a name, no local copy will be created.',
    },
    {
      label: 'Enter a description',
      name: 'fileDescription',
      helperText:
        'This will be the display name for the file. You can leave this blank.',
    },
  ],
];
/*
Email Template Currently Used
** Customer First Name
Hello sambo, 

You have a pending proposal from Kalos Services for: 

323 West Minnehaha
**Link to proposal , mandrill?
Click here to review your proposal 

Please select which services you would like performed, and authorize with your signature. 

If the link above does not work, please copy and paste the following into your address bar:
** Acutal Link without text
app.kalosflorida.com/index.cfm?action=customer:service.accept_proposal&job_number=86250&user_id=4607&property_id=11054&user_name=1
**Download Link
If you need to download this proposal in PDF format click here
//Alternate Link
If the above download link does not work, copy and paste the following into your address bar:
app.kalosflorida.com/index.cfm?action=customer:service.preview_proposal&job_number=86250&user_id=4607&property_id=11054&user_name=1
*/

export const Proposal: FC<Props> = ({
  serviceItem,
  customer,
  property,
  servicesRendered,
}) => {
  const [editing, setEditing] = useState<StoredQuote>();
  const [file, setFile] = useState<File>({
    localCopyName: '',
    fileDescription: `${serviceItem.getId()}_pending_proposal_${
      customer?.getId() || ''
    }`,
  });

  const filteredServicesRendered = servicesRendered.filter(
    sr => sr.getServiceRendered() != '' && sr.getServiceRendered() != null,
  );
  const concatServicesRendered =
    filteredServicesRendered.reduce(function (
      concatedString,
      servicesRendered,
    ) {
      return (
        concatedString +
        `${formatDateDay(
          servicesRendered.getTimeStarted(),
        )}-${servicesRendered.getName()}-${servicesRendered.getServiceRendered()} \n`
      );
    },
    '') + serviceItem.getNotes();

  const [quickAddOpen, setQuickAddOpen] = useState<boolean>(false);
  const [preview, setPreview] = useState<boolean>(false);
  const [table, setTable] = useState<StoredQuote[]>([]);
  const customerName = `${customer?.getFirstname()} ${customer?.getLastname()}`;
  const [form, setForm] = useState<Form>({
    displayName: customerName,
    withJobNotes: 0,
    notes: concatServicesRendered,
  });
  const handleToggleQuickAdd = useCallback(
    () => setQuickAddOpen(!quickAddOpen),
    [quickAddOpen, setQuickAddOpen],
  );
  const handleAddEntry = useCallback(
    (entry?: StoredQuote) => {
      setEditing(entry);
    },
    [setEditing],
  );
  const handleDeleteEntry = useCallback(
    (id: number) => setTable(table.filter(item => item.getId() !== id)),
    [table, setTable],
  );
  const handleSaveEntry = useCallback(
    (entry: StoredQuote) => {
      setTable(
        table.map(map => map.getId()).includes(entry.getId())
          ? table.map(item => (item.getId() === entry.getId() ? entry : item))
          : [...table, entry],
      );
      setEditing(undefined);
    },
    [setTable, setEditing, table],
  );
  const handleQuickAdd = useCallback(
    (entry: StoredQuote) => {
      handleSaveEntry(entry);
    },
    [handleSaveEntry],
  );
  const handleSetRemember = useCallback(
    (id: number) => (value: Value) => {
      setTable(table);
    },
    [table, setTable],
  );
  const handleSetPreview = useCallback(
    (preview: boolean) => () => setPreview(preview),
    [setPreview],
  );
  const handleSendToCustomer = useCallback(() => {
    const data = {
      items: table,
      ...file,
      ...form,
    };
    console.log({ data });
  }, [table, file, form]);
  const emailTemplate = `<body>


  <h3>Hello ${form.displayName},</h3>

  <h3>
    You have a pending proposal from Kalos Services for:
  </h3>

  <h3>
    ${property.getAddress()}
  </h3>


  <div>

    Please select which services you would like performed, and authorize with your signature.
  </div>
  <div>

    If the link above does not work, please copy and paste the following into your address bar:
  </div>
  <a href="app.kalosflorida.com/index.cfm?action=customer:service.accept_proposal&job_number=${serviceItem.getId()}&user_id=${customer.getId()}&property_id=${property.getId()}&user_name=1">app.kalosflorida.com/index.cfm?action=customer:service.accept_proposal&job_number=${serviceItem.getId()}&user_id=${customer.getId()}&property_id=${property.getId()}&user_name=1</a>
  <div>
    If the above download link does not work, copy and paste the following into your address bar:
  </div>
  <a href='app.kalosflorida.com/index.cfm?action=customer:service.preview_proposal&job_number=${serviceItem.getId()}&user_id=${customer.getId()}&property_id=${property.getId()}&user_name=1'>app.kalosflorida.com/index.cfm?action=customer:service.preview_proposal&job_number=${serviceItem.getId()}&user_id=${customer.getId()}&property_id=${property.getId()}&user_name=1 </a>

</body>

`;
  const COLUMNS: Columns = [
    { name: 'Description' },
    {
      name: 'Price',
      actions: [
        {
          label: 'Quick Add',
          compact: true,
          onClick: handleToggleQuickAdd,
        },
        {
          label: 'Add',
          compact: true,
          onClick: () => {
            let newEntry = new StoredQuote();
            newEntry.setId(Math.max(-1, ...table.map(map => map.getId())) + 1);
            newEntry.setDescription('');
            newEntry.setPrice(0);
            handleAddEntry(newEntry);
          },
        },
      ],
      fixedActions: true,
    },
  ];
  const SCHEMA: Schema<Form> = [
    [
      {
        label: 'Display Name',
        name: 'displayName',
        options: [customerName, customer?.getBusinessname() || ''],
      },
      {
        name: 'withJobNotes',
        label: 'With Job Notes',
        type: 'checkbox',
      },
      {
        label: 'Job Notes',
        name: 'notes',
        multiline: true,
        disabled: !form.withJobNotes,
      },
    ],
  ];
  const data: Data = table.map((props: StoredQuote) => {
    return [
      { value: props.getDescription() },
      {
        value: `$ ${props.getPrice()}`,
        actions: [
          // ? Commented this because this feature appears to be incomplete and I have no idea what "remember" was supposed to remember or do
          // ...[
          //   <Field
          //     key={0}
          //     className="ProposalCheckbox"
          //     name={`remember-${props.getId()}`}
          //     type="checkbox"
          //     label="Remember This Item"
          //     value={props.getRemember()}
          //     onChange={handleSetRemember(props.getId())}
          //   />,
          // ],
          <IconButton
            key={1}
            style={{ marginLeft: 4 }}
            size="small"
            onClick={() => handleAddEntry(props)}
          >
            <EditIcon />
          </IconButton>,
          <IconButton
            key={2}
            style={{ marginLeft: 4 }}
            size="small"
            onClick={() => handleDeleteEntry(props.getId())}
          >
            <DeleteIcon />
          </IconButton>,
        ],
      },
    ];
  });
  const dataPreview: Data = table.map(props => [
    { value: props.getDescription() },
    { value: `$ ${props.getPrice()}` },
  ]);
  return (
    <>
      <SectionBar
        asideContent={
          <ProposalPrint
            displayName={form.displayName}
            logJobNumber={serviceItem.getLogJobNumber()}
            property={property}
            notes={form.withJobNotes ? form.notes : undefined}
            entries={table.map(props => ({
              description: props.getDescription(),
              price: props.getPrice(),
            }))}
          />
        }
      />
      <PlainForm schema={SCHEMA} data={form} onChange={setForm} />
      <InfoTable columns={COLUMNS} data={data} />
      <SectionBar
        actions={[
          {
            label: 'Submit And Send To Customer',
            onClick: handleSetPreview(true),
          },
        ]}
        fixedActions
      />
      {editing && (
        <Modal open onClose={() => handleAddEntry()}>
          <Form<StoredQuote>
            title="Edit"
            schema={SCHEMA_ENTRY}
            onSave={quote => {
              handleSaveEntry(makeSafeFormObject(quote, new StoredQuote()));
            }}
            data={editing}
            onClose={() => handleAddEntry()}
            submitLabel="Done"
          />
        </Modal>
      )}
      {preview && (
        <Modal open onClose={handleSetPreview(false)}>
          <SectionBar
            title="Please Review Your Proposal Carefully"
            actions={[
              { label: 'Send To Customer', onClick: handleSendToCustomer },
              {
                label: 'Cancel',
                onClick: handleSetPreview(false),
                variant: 'outlined',
              },
            ]}
          />
          <div className="ProposalInfo">
            Submitting this proposal will send it to the customer.
            <br />
            Only send the proposal if you are certain it is correct.
            <br />
            If you need to make changes, click cancel to go back.
          </div>
          <InfoTable
            columns={[{ name: 'Display Name' }]}
            data={[[{ value: form.displayName }]]}
          />
          {form.notes !== '' && (
            <InfoTable
              columns={[{ name: 'Notes' }]}
              data={[[{ value: form.notes }]]}
            />
          )}
          <InfoTable
            columns={[{ name: 'Description' }, { name: 'Price' }]}
            data={dataPreview}
          />
          <PlainForm schema={SCHEMA_FILE} data={file} onChange={setFile} />
        </Modal>
      )}
      {/* TODO Converting to object as a temporary thing til I figure out how to convert this */}
      {quickAddOpen && (
        <StoredQuotes
          open
          onClose={handleToggleQuickAdd}
          onSelect={out => handleQuickAdd(out)}
        />
      )}
    </>
  );
};
