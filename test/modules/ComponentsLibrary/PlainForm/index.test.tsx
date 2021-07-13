export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

const COMPONENTS_LIBRARY_PATH_FROM_TEST =
  require('../../../test-constants/constants').COMPONENTS_LIBRARY_PATH_FROM_TEST;
const SETUP_PATH_FROM_TEST =
  require('../../../test-constants/constants').SETUP_PATH_FROM_TEST;

const React = require('react');
const shallow = require('enzyme').shallow;
const PlainForm =
  require(`${COMPONENTS_LIBRARY_PATH_FROM_TEST}/PlainForm/index`).PlainForm;

require(`${SETUP_PATH_FROM_TEST}/grpc-endpoint.js`); // ? Required to run tests with RPCs in Mocha (because Mocha runs in a Node environment)
require(`${SETUP_PATH_FROM_TEST}/enzyme-setup.js`); // ? Required to run tests with Enzyme for React
const expectImport =
  require(`${SETUP_PATH_FROM_TEST}/chai-setup.js`).expectImport;

const GENDERS = ['Male', 'Female', 'Other'];

export type Model = {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  numbers: number[];
  colors: string[];
  login: string;
  password: string;
  note: string;
  mailing: number;
  dob: string;
  hour: string;
  technician: string;
  technicians: string;
  signature: string;
  coverImage: string;
  color: string;
  serviceCallId: number;
  start: string;
};

export const model: Model = {
  id: 123,
  firstName: 'John',
  lastName: 'Doe',
  gender: GENDERS[0],
  numbers: [1, 4, 6],
  colors: ['red', 'green'],
  login: '',
  password: '123456',
  note: `Lorem ipsum dolor sit amet. Abon fergo irgo fingo.
  dolor sit
  amet`,
  mailing: 0,
  dob: '1980-11-23 00:00:00',
  hour: '00:00',
  technician: '',
  technicians: '',
  signature: '',
  coverImage: '',
  color: '#9473f1',
  serviceCallId: 0,
  start: '2020-04-24 19:30:00',
};

export const SCHEMA_2: any = [
  [
    {
      label: 'Personal detail',
      headline: true,
      description: 'optional description',
    },
  ],
  [
    {
      name: 'firstName',
      label: 'First Name',
    },
    {
      name: 'lastName',
      label: 'Last Name',
    },
    {
      name: 'gender',
      label: 'Gender',
      options: GENDERS,
      actions: [
        {
          label: 'Add new',
          variant: 'text',
        },
      ],
      actionsInLabel: true,
    },
    {
      name: 'numbers',
      label: 'Favorite Numbers',
      options: [...Array(10)].map((_, idx) => ({
        label: idx.toString(),
        value: idx,
      })),
      type: 'multiselect',
    },
  ],
  [
    {
      name: 'dob',
      label: 'Date of birth',
      type: 'date',
    },
    {
      name: 'hour',
      label: 'Hour',
      type: 'time',
      required: true,
    },
    {
      name: 'serviceCallId',
      label: 'Service Call ID',
      type: 'eventId',
      required: true,
    },
    {
      name: 'colors',
      label: 'Favorite Colors',
      options: [
        { label: 'Black', value: 'black' },
        { label: 'White', value: 'white' },
        { label: 'Yellow', value: 'yellow' },
        { label: 'Red', value: 'red' },
        { label: 'Green', value: 'green' },
        { label: 'Blue', value: 'blue' },
        { label: 'Pink', value: 'pink' },
        { label: 'Brown', value: 'brown' },
        { label: 'Silver', value: 'silver' },
        { label: 'Gold', value: 'gold' },
      ],
      type: 'multiselect',
    },
  ],
  [
    {
      label: 'Login detail',
      headline: true,
    },
  ],
  [
    {
      name: 'login',
      label: 'Login',
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      helperText: 'Min 3 characters long',
      required: true,
      actions: [
        {
          label: 'Random',
          variant: 'outlined',
        },
        {
          label: 'Show',
          variant: 'outlined',
        },
      ],
    },
    {
      name: 'mailing',
      label: 'Mailing',
      type: 'checkbox',
      required: true,
    },
    {
      name: 'coverImage',
      label: 'Cover Image',
      type: 'file',
      onFileLoad: (file: any) => console.log(file),
      required: true,
    },
  ],
  [
    {
      label: 'Various',
      headline: true,
    },
  ],
  [
    {
      name: 'note',
      label: 'Note',
      multiline: true,
      actions: [
        {
          label: 'Copy from clipboard',
          variant: 'text',
        },
      ],
      actionsInLabel: true,
    },
    {
      name: 'technician',
      label: 'Technician',
      type: 'technician',
      required: true,
    },
    {
      name: 'technicians',
      label: 'Technicians',
      type: 'technicians',
      required: true,
    },
  ],
  [
    {
      name: 'start',
      label: 'Start',
      type: 'datetime',
      required: true,
    },
    {
      name: 'signature',
      label: 'Signature',
      type: 'signature',
    },
    {
      name: 'color',
      label: 'Color',
      type: 'color',
    },
  ],
];

describe('ComponentsLibrary', () => {
  describe('PlainForm', () => {
    describe('<PlainForm<Model> schema={SCHEMA_2} data={model} onChange={data => console.log(data)}/>', () => {
      it('displays the correct first name', () => {
        // FIXME write out a more extensive "mount" test when possible now that we have mount working
        const wrapper = shallow(
          <PlainForm<Model>
            schema={SCHEMA_2}
            data={model}
            onChange={(data: any) => console.log(data)}
          />,
        );

        expectImport(
          wrapper.find({ label: 'First Name' }).props()['value'],
        ).to.equal('John');
      });

      it('displays the correct last name', () => {
        // FIXME write out a more extensive "mount" test when possible now that we have mount working
        const wrapper = shallow(
          <PlainForm<Model>
            schema={SCHEMA_2}
            data={model}
            onChange={(data: any) => console.log(data)}
          />,
        );

        expectImport(
          wrapper.find({ label: 'Last Name' }).props()['value'],
        ).to.equal('Doe');
      });

      it('displays the correct gender', () => {
        // FIXME write out a more extensive "mount" test when possible now that we have mount working
        const wrapper = shallow(
          <PlainForm<Model>
            schema={SCHEMA_2}
            data={model}
            onChange={(data: any) => console.log(data)}
          />,
        );

        expectImport(
          wrapper.find({ label: 'Gender' }).props()['value'],
        ).to.equal('Male');
      });

      it('displays the correct favorite numbers', () => {
        // FIXME write out a more extensive "mount" test when possible now that we have mount working
        const wrapper = shallow(
          <PlainForm<Model>
            schema={SCHEMA_2}
            data={model}
            onChange={(data: any) => console.log(data)}
          />,
        );

        expectImport(
          wrapper.find({ label: 'Favorite Numbers' }).props()['value'],
        ).to.deep.equal([1, 4, 6]);
      });
    });
  });
});
