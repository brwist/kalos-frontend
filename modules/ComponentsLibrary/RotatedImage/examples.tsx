import React from 'react';
import { RotatedImage } from './';
import { ExampleTitle } from '../helpers';

const url = 'http://idolondemand.topcoder.com/images/logo-lg.png';

export default () => (
  <>
    <ExampleTitle>default 0 deg</ExampleTitle>
    <RotatedImage url={url} styles={{ width: 200 }} />
    <ExampleTitle>90 deg</ExampleTitle>
    <RotatedImage url={url} deg={90} styles={{ height: 200 }} />
    <ExampleTitle>180 deg</ExampleTitle>
    <RotatedImage url={url} deg={180} styles={{ width: 200 }} />
    <ExampleTitle>270 deg</ExampleTitle>
    <RotatedImage url={url} deg={270} styles={{ height: 200 }} />
  </>
);
