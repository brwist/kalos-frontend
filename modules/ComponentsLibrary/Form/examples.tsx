import React from 'react';
import { Form } from './';
import {
  model,
  Model,
  SCHEMA_1,
  SCHEMA_2,
  SCHEMA_3,
} from '../PlainForm/examples';
import { LoremIpsumList } from '../helpers';

export default () => (
  <>
    <Form<Model>
      title="Form"
      schema={SCHEMA_1}
      data={model}
      onSave={data => console.log(data)}
      onClose={() => console.log('CANCEL')}
      actions={[
        { label: 'onClick', onClick: () => console.log('LOREM') },
        { label: 'url', variant: 'outlined', url: '/ipsum' },
        { label: 'Disabled', variant: 'outlined', disabled: true },
      ]}
    >
      <LoremIpsumList />
    </Form>
    <hr />
    <Form<Model>
      title="Form"
      subtitle="Subtitle"
      schema={SCHEMA_2}
      data={model}
      onSave={data => console.log(data)}
      onClose={() => console.log('CANCEL')}
      submitLabel="Submit"
      cancelLabel="Close"
    />
    <hr />
    <Form<Model>
      title="Form"
      schema={SCHEMA_3}
      data={model}
      onSave={data => console.log(data)}
      onClose={() => console.log('CANCEL')}
      disabled
      pagination={{
        count: 35,
        page: 2,
        rowsPerPage: 6,
        onChangePage: () => {},
      }}
    />
  </>
);
