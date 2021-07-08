import React, { useRef, useCallback, RefObject } from 'react';
import { Form } from './';
import {
  model,
  Model,
  SCHEMA_1,
  SCHEMA_2,
  SCHEMA_3,
} from '../PlainForm/examples';
import { LoremIpsumList, ExampleTitle } from '../helpers';

export default () => {
  const formRef = useRef<RefObject<HTMLButtonElement>>(null);
  const handleSubmit = useCallback(() => {
    if (formRef.current) {
      //@ts-ignore
      formRef.current.click();
    }
    console.log({ formRef });
  }, [formRef]);
  return (
    <>
      <ExampleTitle>With subtitle and custom button names</ExampleTitle>
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
      <ExampleTitle>With actions and children</ExampleTitle>
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
      <ExampleTitle>
        With external submit
        <br />
        <button onClick={handleSubmit}>Submit</button>
      </ExampleTitle>
      <Form<Model>
        //@ts-ignore
        ref={formRef}
        schema={SCHEMA_2}
        data={model}
        onSave={data => console.log(data)}
        onClose={() => console.log('CANCEL')}
      />
      <ExampleTitle>With pagination and disabled</ExampleTitle>
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
          onPageChange: () => {},
        }}
      />
    </>
  );
};
