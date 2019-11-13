import React, { ChangeEvent } from 'react';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CssBaseline from '@material-ui/core/CssBaseline';
interface props {
  userId: number;
}

interface state {
  user: User.AsObject;
  isModalOpen: boolean;
  isEditing: boolean;
  isLoginModalOpen: boolean;
}

export class AccountInfo extends React.PureComponent<props, state> {
  UserClient: UserClient;
  oldPassword: React.RefObject<HTMLInputElement>;
  newPassword: React.RefObject<HTMLInputElement>;
  reTypePassword: React.RefObject<HTMLInputElement>;
  Login: React.RefObject<HTMLInputElement>;

  constructor(props: props) {
    super(props);
    this.state = {
      user: new User().toObject(),
      isModalOpen: false,
      isEditing: false,
      isLoginModalOpen: false,
    };
    this.handleUpdateLogin = this.handleUpdateLogin.bind(this);
    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
    this.UserClient = new UserClient();
    this.oldPassword = React.createRef();
    this.newPassword = React.createRef();
    this.reTypePassword = React.createRef();
    this.Login = React.createRef();
  }

  async fetchUser() {
    const req = new User();
    req.setId(this.props.userId);

    const result = await this.UserClient.Get(req);
    this.setState({
      user: result,
    });
  }

  toggleModal() {
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen,
    }));
  }

  toggleLoginModal() {
    this.setState(prevState => ({
      isLoginModalOpen: !prevState.isLoginModalOpen,
    }));
  }

  async handleUpdateLogin() {
    if (this.Login.current) {
      console.log(this.Login.current);
      const login = this.Login.current.value;
      const req = new User();
      req.setLogin(login);
      req.setId(this.state.user.id);
      req.setFieldMaskList(['Login']);
      const updatedUser = await this.UserClient.Update(req);
      this.setState({ user: updatedUser });
    }
    this.toggleLoginModal();
  }

  async handleUpdatePassword() {
    try {
      if (
        this.oldPassword.current &&
        this.newPassword.current &&
        this.reTypePassword.current
      ) {
        const oldPassword = this.oldPassword.current.value;
        const newPassword = this.newPassword.current.value;
        const reTypePassword = this.reTypePassword.current.value;
        if (newPassword.length < 8) {
          throw 'Password needs to be 8 characters long';
        }
        if (newPassword !== reTypePassword) {
          throw 'Passwords do not match';
        }
        if (oldPassword !== this.state.user.pwd) {
          throw 'Old Password is incorrect';
        }
        const req = new User();
        req.setPwd(newPassword);
        req.setFieldMaskList(['Pwd']);
        req.setId(this.state.user.id);
        await this.UserClient.Update(req);
        this.toggleModal();
      }
    } catch (err) {
      alert(err);
    }
  }

  toggleEditing() {
    this.setState(prevState => ({
      isEditing: !prevState.isEditing,
    }));
  }

  updateUser<K extends keyof User.AsObject>(prop: K) {
    return async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const user = new User();
      const upperCaseProp = `${prop[0].toUpperCase()}${prop.slice(1)}`;
      console.log(prop, upperCaseProp);
      const methodName = `set${upperCaseProp}`;
      console.log(methodName);
      user.setId(this.state.user.id);
      //@ts-ignore
      user[methodName](e.target.value);
      user.setFieldMaskList([upperCaseProp]);
      console.log(user.toObject());
      const updatedUser = await this.UserClient.Update(user);
      this.setState(() => ({ user: updatedUser }));
    };
  }
  updatePassword = this.updateUser('pwd');
  updateLogin = this.updateUser('login');
  updateEmail = this.updateUser('email');
  updateCellPhone = this.updateUser('cellphone');

  updateZipCode = this.updateUser('zip');
  updateCity = this.updateUser('city');
  updateStreetAddress = this.updateUser('address');
  updateFirstName = this.updateUser('firstname');
  updateLastName = this.updateUser('lastname');

  async componentDidMount() {
    await this.UserClient.GetToken('test', 'test');
    await this.fetchUser();
  }

  render() {
    const { isEditing } = this.state;
    if (this.state.user.id === 0) {
      return null;
    }
    return (
      <>
        <CssBaseline />
        <Grid
          style={{ paddingBottom: '20px' }}
          container
          alignItems="stretch"
          justify="flex-start"
          direction="column"
        >
          <Grid container direction="row" justify="space-evenly">
            <TextField
              disabled={!isEditing}
              style={{ marginRight: '10px' }}
              defaultValue={this.state.user.firstname}
              onChange={this.updateFirstName}
              label={'First Name'}
            />
            <TextField
              disabled={!isEditing}
              defaultValue={this.state.user.lastname}
              onChange={this.updateLastName}
              label={'Last Name'}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.isEditing}
                  onChange={this.toggleEditing}
                  value="isEditing"
                  color="primary"
                />
              }
              label={
                this.state.isEditing ? 'Editing Enabled' : 'Editing Disabled'
              }
            />
          </Grid>

          <TextField
            disabled={!isEditing}
            defaultValue={this.state.user.address}
            onChange={this.updateStreetAddress}
            label={'Street Address'}
          />
          <TextField
            disabled={!isEditing}
            defaultValue={this.state.user.city}
            onChange={this.updateCity}
            label={'City'}
          />
          <TextField
            disabled={!isEditing}
            defaultValue={this.state.user.zip}
            onChange={this.updateZipCode}
            label={'Zip Code'}
          />

          <TextField
            disabled={!isEditing}
            defaultValue={this.state.user.cellphone}
            onChange={this.updateCellPhone}
            label={'Phone Number'}
          />
          <TextField
            disabled
            style={{ paddingRight: 10 }}
            defaultValue={this.state.user.email}
            onChange={this.updateEmail}
            label={'Email'}
          />
          <Grid
            container
            direction="row"
            justify="space-evenly"
            style={{ marginTop: 10 }}
          >
            <Button
              disabled={!isEditing}
              onClick={this.toggleLoginModal}
              variant="contained"
              style={{ width: '45%' }}
            >
              Change Login
            </Button>
            <Button
              disabled={!isEditing}
              onClick={this.toggleModal}
              variant="contained"
              style={{ width: '45%' }}
            >
              Change Password
            </Button>
          </Grid>
        </Grid>
        <Modal
          open={this.state.isModalOpen}
          onClose={this.toggleModal}
          style={{ margin: '10px' }}
        >
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Paper style={{ padding: 20 }}>
              <TextField
                disabled={!isEditing}
                defaultValue={this.state.user.login}
                onChange={this.updateLogin}
                label={'Login'}
              />
              <Grid container direction={'column'}>
                <TextField
                  disabled={!isEditing}
                  label={'Old Password'}
                  type="password"
                  inputProps={{ ref: this.oldPassword }}
                />
                <TextField
                  disabled={!isEditing}
                  label={'New Password'}
                  type="password"
                  inputProps={{
                    ref: this.newPassword,
                  }}
                />
                <TextField
                  disabled={!isEditing}
                  label={'Re-Type New Password'}
                  type="password"
                  inputProps={{
                    ref: this.reTypePassword,
                  }}
                />
                <Button onClick={this.handleUpdatePassword}>Confirm</Button>
              </Grid>
            </Paper>
          </Grid>
        </Modal>
        <Modal
          open={this.state.isLoginModalOpen}
          onClose={this.toggleLoginModal}
          style={{ margin: '10px' }}
        >
          <Paper style={{ padding: 20 }}>
            <Grid container direction="column">
              <TextField
                defaultValue={this.state.user.login}
                disabled={!isEditing}
                label={'Login'}
                inputProps={{
                  ref: this.Login,
                }}
              />
              <Button onClick={this.handleUpdateLogin}>Confirm</Button>
            </Grid>
          </Paper>
        </Modal>
      </>
    );
  }
}
