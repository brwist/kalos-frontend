import React from 'react';
import { Button } from './';

export default () => (
  <>
    <Button label="Button" />
    <Button label="Disabled" disabled />
    <Button label="With onClick" onClick={() => alert('clicked')} />
    <Button label="With url" url="/with-url" />
  </>
);
