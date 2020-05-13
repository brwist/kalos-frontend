import React from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { PerDiem, PerDiemClient } from '@kalos-core/kalos-rpc/PerDiem';
import { ENDPOINT } from '../../constants';
import { Form, Schema } from '../ComponentsLibrary/Form';
// add any prop types here
interface props {
  userID: number;
}

// map your state here
interface state {
  perDiem: PerDiem.AsObject;
}

const SCHEMA: Schema<PerDiem.AsObject> = [
  [
    {
      label: 'Start Date',
      name: 'dateStarted',
      type: 'date',
      required: true,
    },

    // might need to gen on the fly or something?
    {
      label: 'Deparment',
      name: 'departmentId',
      options: [
        {
          label: '',
          value: '',
        },
      ],
      required: true,
    },
    {
      label: 'Notes',
      name: 'notes',
      type: 'text',
      required: true,
    },
  ],
];
export class PerDiemForm extends React.PureComponent<props, state> {
  Client: PerDiemClient;
  constructor(props: props) {
    super(props);
    this.state = {
      perDiem: new PerDiem().toObject(),
    };
    this.Client = new PerDiemClient(ENDPOINT);

    this.savePerDiem = this.savePerDiem.bind(this);
  }
  async savePerDiem(req: PerDiem.AsObject) {
    await this.Client.Update(req);
  }
  render() {
    return (
      <ThemeProvider theme={customTheme.lightTheme}>
        <Form
          title="New PerDiem"
          onSave={this.savePerDiem}
          data={this.state.perDiem}
          schema={SCHEMA}
          onClose={() => alert('close')}
        />
        <h1>PerDiemForm!</h1>
      </ThemeProvider>
    );
  }
}
