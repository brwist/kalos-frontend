import React, { CSSProperties } from 'react';
import Typography from '@material-ui/core/Typography';

export const LoremIpsumList = ({ style = {} }: { style?: CSSProperties }) => (
  <Typography component="div" style={style}>
    <h1 style={{ marginTop: 0 }}>Lorem ipsum dolor sit amet</h1>
    <ul>
      <li>Consectetur adipiscing elit. Vivamus volutpat iaculis feugiat.</li>
      <li>Donec et iaculis augue, quis posuere velit.</li>
      <li>In at ante sed mi mollis viverra quis sit amet orci.</li>
      <li>Sed at efficitur velit, interdum porta mi.</li>
      <li>Proin quis sapien orci.</li>
      <li>Aliquam vulputate vitae ex interdum tincidunt.</li>
      <li>Curabitur eu aliquet augue.</li>
      <li>Mauris tincidunt non lacus eu dictum.</li>
      <li>Maecenas sodales ligula in ultricies molestie.</li>
      <li>Donec faucibus pellentesque tincidunt.</li>
      <li>Vivamus in mollis felis.</li>
    </ul>
  </Typography>
);
