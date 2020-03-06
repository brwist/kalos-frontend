import React from 'react';
import { Button } from './';

export default () => (
  <>
    <Button label="small (default)" />
    <Button label="default disabled" disabled />
    <Button label="outlined" variant="outlined" />
    <Button label="outlined disabled" disabled variant="outlined" />
    <Button label="with onClick" onClick={() => alert('clicked')} />
    <Button label="with url" url="/with-url" />
    <hr />
    <Button label="compact" compact />
    <Button label="compact disabled" disabled compact />
    <Button label="outlined compact" variant="outlined" compact />
    <Button
      label="outlined disabled compact"
      disabled
      variant="outlined"
      compact
    />
    <hr />
    <Button label="xsmall" size="xsmall" />
    <Button label="xsmall outlined" variant="outlined" size="xsmall" />
    <Button label="small" />
    <Button label="small outlined" variant="outlined" />
    <Button label="medium" size="medium" />
    <Button label="medium outlined" variant="outlined" size="medium" />
    <Button label="large" size="large" />
    <Button label="large outlined" variant="outlined" size="large" />
    <hr />
    <Button label="xsmall text" variant="text" size="xsmall" />
    <Button label="xsmall text" variant="text" size="xsmall" disabled />
    <Button label="small text" variant="text" />
    <Button label="small text" variant="text" disabled />
    <Button label="medium text" variant="text" size="medium" />
    <Button label="medium text" variant="text" size="medium" disabled />
    <Button label="large text" variant="text" size="large" />
    <Button label="large text" variant="text" size="large" disabled />
    <hr />
  </>
);
