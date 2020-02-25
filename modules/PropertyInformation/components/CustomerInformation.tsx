import React from 'react';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import Grid from '@material-ui/core/Grid';
import { ENDPOINT, USA_STATES } from '../../../constants';
import InfoTable from './InfoTable';
import { Modal } from './Modal';
import { Form, Schema } from './Form';

const SCHEMA: Schema<User.AsObject>[] = [
  { label: 'First Name', name: 'firstname' },
  { label: 'Last Name', name: 'lastname' },
  { label: 'Business Name', name: 'businessname' },
  { label: 'Phone', name: 'phone' },
  { label: 'Alternate Phone', name: 'altphone' },
  { label: 'Email', name: 'email' },
  { label: 'Address', name: 'address' },
  { label: 'City', name: 'city' },
  { label: 'State', name: 'state', options: USA_STATES },
  { label: 'Zip', name: 'zip' },
];

interface props {
  userID: number;
  editing: boolean;
  onCloseEdit: () => void;
}

interface state {
  customer: User.AsObject;
  saving: boolean;
}

export class CustomerInformation extends React.PureComponent<props, state> {
  UserClient: UserClient;

  constructor(props: props) {
    super(props);
    this.state = {
      customer: new User().toObject(),
      saving: false,
    };
    this.UserClient = new UserClient(ENDPOINT);
  }

  loadCustomer = async () => {
    const user = new User();
    user.setId(this.props.userID);
    const userData = await this.UserClient.Get(user);
    this.setState({
      customer: userData,
    });
  };

  handleSave = async (data: User.AsObject) => {
    const { userID, onCloseEdit } = this.props;
    this.setState({ saving: true });
    const entry = new User();
    entry.setId(userID);
    const fieldMaskList = [];
    for (const key in data) {
      const upperCaseProp = `${key[0].toUpperCase()}${key.slice(1)}`;
      const methodName = `set${upperCaseProp}`;
      //@ts-ignore
      user[methodName](data[key]);
      fieldMaskList.push(upperCaseProp);
    }
    entry.setFieldMaskList(fieldMaskList);
    const customer = await this.UserClient.Update(entry);
    this.setState(() => ({ customer, saving: false }));
    onCloseEdit();
  };

  async componentDidMount() {
    // await this.UserClient.GetToken('test', 'test');
    await this.loadCustomer();
  }

  render() {
    const { editing, onCloseEdit } = this.props;
    const { customer, saving } = this.state;
    const {
      id,
      firstname,
      lastname,
      businessname,
      phone,
      altphone,
      cellphone,
      fax,
      email,
      address,
      city,
      state,
      zip,
      billingTerms,
    } = customer;
    const infoTableData = [
      [
        { label: 'Name', value: `${firstname} ${lastname}` },
        { label: 'Business Name', value: businessname },
      ],
      [
        { label: 'Primary Phone', value: phone },
        { label: 'Cell Phone', value: cellphone },
      ],
      [
        { label: 'Alternate Phone', value: altphone },
        { label: 'Fax', value: fax },
      ],
      [
        {
          label: 'Billing Address',
          value: `${address}, ${city}, ${state} ${zip}`,
        },
        { label: 'Email', value: email },
      ],
      [{ label: 'Billing Terms', value: billingTerms }],
    ];
    return (
      <Grid container direction="column">
        <InfoTable data={infoTableData} loading={id === 0} />
        <Modal open={editing} onClose={onCloseEdit}>
          <Form<User.AsObject>
            schema={SCHEMA}
            data={customer}
            onSave={this.handleSave}
            onClose={onCloseEdit}
            disabled={saving}
          />
        </Modal>
      </Grid>
    );
  }
}
