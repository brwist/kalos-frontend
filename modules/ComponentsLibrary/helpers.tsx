import React, { FC, CSSProperties } from 'react';
import Typography from '@material-ui/core/Typography';

const LOREM = 'Lorem ipsum dolor sit amet';

interface Props {
  title?: string;
  style?: CSSProperties;
}

export const LoremIpsumList: FC<Props> = ({ title = LOREM, style = {} }) => (
  <Typography component="div" style={style}>
    <h1 style={{ marginTop: 0 }}>{title}</h1>
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

export const LoremIpsum: FC<Props> = ({ title = LOREM, style = {} }) => (
  <Typography component="div" style={{ padding: 10, ...style }}>
    {title}
  </Typography>
);

export const ExampleTitle: FC = ({ children }) => (
  <div
    style={{
      backgroundColor: 'gold',
      padding: 8,
      marginBottom: 10,
      fontFamily: 'sans-serif',
      fontWeight: 900,
    }}
  >
    {children}
  </div>
);
