import React, { FC, useState, useCallback, useEffect } from 'react';
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
import { QuoteLine } from '@kalos-core/kalos-rpc/QuoteLine';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered';
import { User } from '@kalos-core/kalos-rpc/User';
import { Property } from '@kalos-core/kalos-rpc/Property';
import {
  makeSafeFormObject,
  formatDateDay,
  QuoteLineClientService,
} from '../../../../helpers';
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
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loadedQuotes, setLoadedQuotes] = useState<QuoteLine[]>([]);
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
  const load = useCallback(async () => {
    const req = new QuoteLine();
    req.setIsActive(1);
    req.setJobNumber(serviceItem.getId().toString());
    try {
      let storedQuotes = [];
      const results = (
        await QuoteLineClientService.BatchGet(req)
      ).getResultsList();
      setLoadedQuotes(results);
      for (let i = 0; i < results.length; i++) {
        const ql = results[i];
        const storedQuote = new StoredQuote();
        storedQuote.setId(ql.getId());
        storedQuote.setDescription(ql.getDescription());
        storedQuote.setPrice(parseInt(ql.getAdjustment()));
        storedQuotes.push(storedQuote);
      }
      setTable(storedQuotes);
    } catch (err) {
      console.log('nothing found for proposal');
    }
  }, [serviceItem]);
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
      console.log(table);
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
  const handleSendToCustomer = useCallback(async () => {
    const data = {
      items: table,
      ...file,
      ...form,
    };
    //first, let's add or update the quote line records
    for (let i = 0; i < table.length; i++) {
      let item = table[i];
      let found = loadedQuotes.find(loaded => loaded.getId() === item.getId());
      if (found) {
        //it exists, so update
        let quote = new QuoteLine();
        quote.setId(found.getId());
        quote.setDescription(item.getDescription());
        quote.setAdjustment(item.getPrice().toString());
        quote.setFieldMaskList(['Description', 'Adjustment']);
        await QuoteLineClientService.Update(quote);
      } else {
        //not found, so create
        let quote = new QuoteLine();
        quote.setDescription(item.getDescription());
        quote.setAdjustment(item.getPrice().toString());
        quote.setIsActive(1);
        quote.setWarranty(2);
        quote.setJobNumber(serviceItem.getId().toString());
        quote.setForUser(customer.getId());
        await QuoteLineClientService.Create(quote);
      }
    }
    for (let i = 0; i < loadedQuotes.length; i++) {
      let existingQuote = loadedQuotes[i];
      let found = table.find(item => item.getId() === existingQuote.getId());
      if (!found) {
        //we deleted this, so we should commit it
        await QuoteLineClientService.Delete(existingQuote);
      }
    }
  }, [table, file, form, loadedQuotes, customer, serviceItem]);
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
  <a href="app.kalosflorida.com/index.cfm?action=customer:service.accept_proposal&job_number=${serviceItem.getId()}&user_id=${customer.getId()}&property_id=${property.getId()}&user_name=1">Click here to approve</a>

    If the link above does not work, please copy and paste the following into your address bar:
  </div>
  <a href="app.kalosflorida.com/index.cfm?action=customer:service.accept_proposal&job_number=${serviceItem.getId()}&user_id=${customer.getId()}&property_id=${property.getId()}&user_name=1">app.kalosflorida.com/index.cfm?action=customer:service.accept_proposal&job_number=${serviceItem.getId()}&user_id=${customer.getId()}&property_id=${property.getId()}&user_name=1</a>
  <br>
  <div>  <a href='app.kalosflorida.com/index.cfm?action=customer:service.preview_proposal&job_number=${serviceItem.getId()}&user_id=${customer.getId()}&property_id=${property.getId()}&user_name=1'>Dowload PDF here!</a>
  </div>
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
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
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
