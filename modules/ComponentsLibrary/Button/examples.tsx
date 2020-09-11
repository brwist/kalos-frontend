import React from 'react';
import { Button } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>default</ExampleTitle>
    <Button label="small (default)" />
    <Button label="default disabled" disabled />
    <Button label="outlined" variant="outlined" />
    <Button label="outlined disabled" disabled variant="outlined" />
    <Button label="with onClick" onClick={() => alert('clicked')} />
    <Button label="with url" url="/with-url" />
    <Button label="color secondary" color="secondary" />
    <Button label="status success" status="success" />
    <Button label="status failure" status="failure" />
    <ExampleTitle>loading</ExampleTitle>
    <Button label="small (default)" loading />
    <Button label="default disabled" disabled loading />
    <Button label="outlined" variant="outlined" loading />
    <Button label="outlined disabled" disabled variant="outlined" loading />
    <Button label="with onClick" onClick={() => alert('clicked')} loading />
    <Button label="with url" url="/with-url" loading />
    <Button label="color secondary" color="secondary" loading />
    <Button label="status success" status="success" loading />
    <Button label="status failure" status="failure" loading />
    <ExampleTitle>compact</ExampleTitle>
    <Button label="compact" compact />
    <Button label="compact disabled" disabled compact />
    <Button label="outlined compact" variant="outlined" compact />
    <Button
      label="outlined disabled compact"
      disabled
      variant="outlined"
      compact
    />
    <ExampleTitle>size xsmall</ExampleTitle>
    <Button label="xsmall" size="xsmall" />
    <Button label="xsmall outlined" variant="outlined" size="xsmall" />
    <Button label="small" />
    <Button label="small outlined" variant="outlined" />
    <Button label="medium" size="medium" />
    <Button label="medium outlined" variant="outlined" size="medium" />
    <Button label="large" size="large" />
    <Button label="large outlined" variant="outlined" size="large" />
    <ExampleTitle>size xsmall loading</ExampleTitle>
    <Button label="xsmall" size="xsmall" loading />
    <Button label="xsmall outlined" variant="outlined" size="xsmall" loading />
    <Button label="small" loading />
    <Button label="small outlined" variant="outlined" loading />
    <Button label="medium" size="medium" loading />
    <Button label="medium outlined" variant="outlined" size="medium" loading />
    <Button label="large" size="large" loading />
    <Button label="large outlined" variant="outlined" size="large" loading />
    <ExampleTitle>variant text</ExampleTitle>
    <Button label="xsmall text" variant="text" size="xsmall" />
    <Button label="xsmall text" variant="text" size="xsmall" disabled />
    <Button label="small text" variant="text" />
    <Button label="small text" variant="text" disabled />
    <Button label="medium text" variant="text" size="medium" />
    <Button label="medium text" variant="text" size="medium" disabled />
    <Button label="large text" variant="text" size="large" />
    <Button label="large text" variant="text" size="large" disabled />
  </>
);
