import React from 'react';
import { RotatedImage } from './';
import { ExampleTitle } from '../helpers';

const url =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/LG_Chem_logo_%28english%29.svg/1280px-LG_Chem_logo_%28english%29.svg.png';

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
