import React from 'react';
import Alert from '@material-ui/lab/Alert';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Form, Schema } from '../ComponentsLibrary/Form';
import { Modal } from '../ComponentsLibrary/Modal';
import { User } from '@kalos-core/kalos-rpc/User';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';
import {
  UserClientService,
  cleanFieldMaskField,
  makeSafeFormObject,
} from '../../helpers';
import { Loader } from '../Loader/main';
import { SectionBar } from '../ComponentsLibrary/SectionBar';
import { Vehicle } from '@kalos-core/kalos-rpc/compiled-protos/user_pb';

interface props extends PageWrapperProps {
  userId: number;
}

interface state {
  user: User;
  isModalOpen: boolean;
  isEditing: boolean;
  isLoginModalOpen: boolean;
  searchString: string;
  error: string;
  saving: boolean;
  saved: boolean;
  formKey: number;
}

type ChangeProp = {
  oldProp: string;
  newProp: string;
  newProp2: string;
};

const SCHEMA_USER: Schema<User> = [
  [
    { name: 'getFirstname', label: 'First Name', required: true },
    { name: 'getLastname', label: 'Last Name', required: true },
  ],
  [
    { name: 'getPhone', label: 'Phone Number' },
    { name: 'getEmail', label: 'Email' },
  ],
  [
    { name: 'getAddress', label: 'Street Address' },
    { name: 'getCity', label: 'City' },
    { name: 'getZip', label: 'Zip Code' },
    {},
  ],
];

const makeSchema = (prop: 'Login' | 'Password'): Schema<ChangeProp> => {
  const type = prop === 'Password' ? 'password' : 'text';
  return [
    [{ name: 'oldProp', label: `Old ${prop}`, required: true, type }],
    [{ name: 'newProp', label: `New ${prop}`, required: true, type }],
    [{ name: 'newProp2', label: `ReType ${prop}`, required: true, type }],
  ];
};

export class AccountInfo extends React.PureComponent<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      user: new User(),
      isModalOpen: false,
      isEditing: false,
      isLoginModalOpen: false,
      searchString: '',
      error: '',
      saving: false,
      saved: false,
      formKey: 0,
    };
  }

  fetchUser = async () => {
    const userResult = await UserClientService.loadUserById(this.props.userId);
    this.setState({ user: userResult });
  };

  toggleEditing = () =>
    this.setState({
      isEditing: !this.state.isEditing,
      formKey: this.state.formKey + 1,
    });

  toggleModal = () =>
    this.setState({
      isModalOpen: !this.state.isModalOpen,
      saved: false,
    });

  toggleLoginModal = () =>
    this.setState({
      isLoginModalOpen: !this.state.isLoginModalOpen,
      saved: false,
    });

  handleUpdateLogin = async ({ oldProp, newProp, newProp2 }: ChangeProp) => {
    this.setState({ error: '' });
    const id = this.state.user.getId();
    const login = this.state.user.getLogin();
    if (oldProp !== login)
      return this.setState({ error: 'Old Login is incorrect' });
    if (newProp !== newProp2)
      return this.setState({ error: 'Logins do not match' });
    this.setState({ saving: true });
    this.state.user.setLogin(newProp);
    await UserClientService.saveUser(this.state.user, id);
    this.setState({ saving: false, saved: true });
  };

  handleUpdatePassword = async ({ oldProp, newProp, newProp2 }: ChangeProp) => {
    this.setState({ error: '' });
    const id = this.state.user.getId();
    const pwd = this.state.user.getPwd();
    if (oldProp !== pwd)
      return this.setState({ error: 'Old Password is incorrect' });
    if (newProp.length < 8)
      return this.setState({
        error: 'Password needs to be at least 8 characters long',
      });
    if (newProp !== newProp2)
      return this.setState({ error: 'Passwords do not match' });
    this.setState({ saving: true });
    this.state.user.setPwd(newProp);
    await UserClientService.saveUser(this.state.user, id);
    this.setState({ saving: false, saved: true });
  };

  updateUser = async (data: User) => {
    const id = this.state.user.getId();
    this.setState({ saving: true });
    const user = await UserClientService.saveUser(
      makeSafeFormObject(data, new User()),
      id,
    );
    this.setState({ user, saving: false, isEditing: false });
  };

  async componentDidMount() {
    await this.fetchUser();
  }

  render() {
    const {
      isEditing,
      user,
      isModalOpen,
      isLoginModalOpen,
      error,
      saving,
      saved,
      formKey,
    } = this.state;
    return (
      <PageWrapper {...this.props} userID={this.props.userId}>
        {!this.state.user.getId() ? (
          <Loader />
        ) : (
          <Form<User>
            key={formKey}
            title="Account Information"
            schema={SCHEMA_USER}
            data={this.state.user}
            onSave={this.updateUser}
            onClose={null}
            disabled={!isEditing || saving}
            intro={
              <div style={{ textAlign: 'center' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isEditing}
                      onChange={this.toggleEditing}
                      value="isEditing"
                      color="primary"
                      disabled={saving}
                    />
                  }
                  label={isEditing ? 'Editing Enabled' : 'Editing Disabled'}
                />
              </div>
            }
            actions={[
              {
                label: 'Change Login',
                disabled: !isEditing || saving,
                onClick: this.toggleLoginModal,
              },
              {
                label: 'Change Password',
                disabled: !isEditing || saving,
                onClick: this.toggleModal,
              },
            ]}
          />
        )}
        {isLoginModalOpen && (
          <Modal open onClose={this.toggleLoginModal}>
            {saved ? (
              <>
                <SectionBar
                  title="Change Login"
                  actions={[{ label: 'Close', onClick: this.toggleLoginModal }]}
                />
                <Alert severity="success">Login changed successfully!</Alert>
              </>
            ) : (
              <Form<ChangeProp>
                title="Change Login"
                schema={makeSchema('Login')}
                data={{
                  oldProp: '',
                  newProp: '',
                  newProp2: '',
                }}
                error={error}
                onSave={this.handleUpdateLogin}
                onClose={this.toggleLoginModal}
                submitLabel="Change"
                disabled={saving}
              />
            )}
          </Modal>
        )}
        {isModalOpen && (
          <Modal open onClose={this.toggleModal}>
            {saved ? (
              <>
                <SectionBar
                  title="Change Password"
                  actions={[{ label: 'Close', onClick: this.toggleModal }]}
                />
                <Alert severity="success">Password changed successfully!</Alert>
              </>
            ) : (
              <Form<ChangeProp>
                title="Change Password"
                schema={makeSchema('Password')}
                data={{
                  oldProp: '',
                  newProp: '',
                  newProp2: '',
                }}
                error={error}
                onSave={this.handleUpdatePassword}
                onClose={this.toggleModal}
                submitLabel="Change"
                disabled={saving}
              />
            )}
          </Modal>
        )}
      </PageWrapper>
    );
  }
}
