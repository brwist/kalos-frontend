import React, { FC, CSSProperties } from 'react';
import Typography from '@material-ui/core/Typography';

export const LOREM = 'Lorem ipsum dolor sit amet';

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
      marginTop: 10,
      marginBottom: 10,
      fontFamily: 'sans-serif',
      fontWeight: 900,
    }}
  >
    {children}
  </div>
);

const FIRST_NAMES = [
  'Mark',
  'Jeanne',
  'Steven',
  'Chris',
  'Peter',
  'Jacob',
  'Eve',
  'Agatha',
  'Jane',
  'Adam',
  'Hugh',
  'Keanu',
  'Robert',
  'George',
];

const LAST_NAME_POSTFIXES = [
  'sven',
  'sten',
  'sky',
  'ski',
  'son',
  'ston',
  'stein',
];

const JOB_TITLES = [
  'Developer',
  'Web Developer',
  'Engineer',
  'Admin',
  'Technician',
  'Finanse',
  'Operational',
  'Director',
];

export const getRandomFirstName = () =>
  FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];

export const getRandomLastName = () =>
  getRandomFirstName() +
  LAST_NAME_POSTFIXES[Math.floor(Math.random() * LAST_NAME_POSTFIXES.length)];

export const getRandomName = () =>
  `${getRandomFirstName()} ${getRandomLastName()}`;

export const getRandomAge = () => 18 + Math.floor(Math.random() * 50);

export const getRandomJobTitle = () =>
  JOB_TITLES[Math.floor(Math.random() * JOB_TITLES.length)];

export const getRandomDigit = () => Math.floor(Math.random() * 10);

export const getRandomPhone = () =>
  `${getRandomDigits(3)}-${getRandomDigits(3)}-${getRandomDigits(3)}`;

export const getRandomNumber = (min: number, max: number) =>
  min + Math.floor(Math.random() * (max - min + 1));

export const getRandomDigits = (digits: number) =>
  +[...Array(digits)].map(() => getRandomDigit()).join('');

export const randomize = (values: (string | number)[]) =>
  values[Math.floor(Math.random() * values.length)];
