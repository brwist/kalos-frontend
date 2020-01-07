import React, { ChangeEvent } from 'react';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import EditIcon from '@material-ui/icons/Edit';
import SendIcon from '@material-ui/icons/Send';
import {
  TextField,
  Grid,
  Modal,
  Button,
  Paper,
  Switch,
  Typography,
  Divider,
  IconButton,
  FormControlLabel,
  CssBaseline,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/CloseSharp';

interface props {
  userId: number;
}

interface state {
  user: User.AsObject;
  isModalOpen: boolean;
  isEditing: boolean;
  isLoginModalOpen: boolean;
  searchString: string;
}

export class AccountInfo extends React.PureComponent<props, state> {
  UserClient: UserClient;
  oldPassword: React.RefObject<HTMLInputElement>;
  newPassword: React.RefObject<HTMLInputElement>;
  reTypePassword: React.RefObject<HTMLInputElement>;
  oldLogin: React.RefObject<HTMLInputElement>;
  newLogin: React.RefObject<HTMLInputElement>;
  reTypeLogin: React.RefObject<HTMLInputElement>;

  constructor(props: props) {
    super(props);
    this.state = {
      user: new User().toObject(),
      isModalOpen: false,
      isEditing: false,
      isLoginModalOpen: false,
      searchString: '',
    };
    this.handleUpdateLogin = this.handleUpdateLogin.bind(this);
    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
    this.UserClient = new UserClient('https://core-dev.kalosflorida.com:8443');
    this.oldPassword = React.createRef();
    this.newPassword = React.createRef();
    this.reTypePassword = React.createRef();
    this.oldLogin = React.createRef();
    this.newLogin = React.createRef();
    this.reTypeLogin = React.createRef();
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
    try {
      if (
        this.oldLogin.current &&
        this.newLogin.current &&
        this.reTypeLogin.current
      ) {
        const oldLogin = this.oldLogin.current.value;
        const newLogin = this.newLogin.current.value;
        const reTypeLogin = this.reTypeLogin.current.value;

        if (newLogin !== reTypeLogin) {
          throw 'Usernames do not match';
        }
        if (oldLogin !== this.state.user.login) {
          throw 'Old Login is incorrect';
        }
        const login = this.oldLogin.current.value;
        const req = new User();
        req.setLogin(newLogin);
        req.setId(this.state.user.id);
        req.setFieldMaskList(['Login']);
        const updatedUser = await this.UserClient.Update(req);
        this.setState({ user: updatedUser });

        this.toggleLoginModal();
      }
    } catch (err) {
      alert(err);
    }
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
      const methodName = `set${upperCaseProp}`;
      user.setId(this.state.user.id);
      //@ts-ignore
      user[methodName](e.target.value);
      user.setFieldMaskList([upperCaseProp]);
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
    await this.UserClient.GetToken('gavinorr', 'G@vin123');
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
          justify="center"
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

          <Grid
            style={{ paddingBottom: '20px', paddingTop: '20px' }}
            container
            alignItems="stretch"
            justify="flex-start"
            direction="column"
          >
            <TextField
              style={{ paddingBottom: '10px', paddingTop: '10px' }}
              disabled={!isEditing}
              defaultValue={this.state.user.address}
              onChange={this.updateStreetAddress}
              label={'Street Address'}
            />
            <TextField
              style={{ paddingBottom: '10px', paddingTop: '10px' }}
              disabled={!isEditing}
              defaultValue={this.state.user.city}
              onChange={this.updateCity}
              label={'City'}
            />
            <TextField
              style={{ paddingBottom: '10px', paddingTop: '10px' }}
              disabled={!isEditing}
              defaultValue={this.state.user.zip}
              onChange={this.updateZipCode}
              label={'Zip Code'}
            />

            <TextField
              style={{ paddingBottom: '10px', paddingTop: '10px' }}
              disabled={!isEditing}
              defaultValue={this.state.user.cellphone}
              onChange={this.updateCellPhone}
              label={'Phone Number'}
            />
            <TextField
              style={{
                paddingBottom: '10px',
                paddingTop: '10px',
                paddingRight: 10,
              }}
              disabled
              defaultValue={this.state.user.email}
              onChange={this.updateEmail}
              label={'Email'}
            />
          </Grid>
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
              style={{ width: '30%' }}
            >
              Change Login
            </Button>
            <Button
              disabled={!isEditing}
              onClick={this.toggleModal}
              variant="contained"
              style={{ width: '30%' }}
            >
              Change Password
            </Button>
          </Grid>
        </Grid>
        <Modal
          open={this.state.isModalOpen}
          onClose={this.toggleModal}
          style={{
            margin: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Paper
            style={{
              padding: 20,
              width: '30%',
            }}
          >
            <Grid container direction={'column'}>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
              >
                <Typography component="h2" variant="h6">
                  Change Password
                </Typography>
                <IconButton onClick={this.toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Grid>
              <Divider />
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
                label={'Repeat Password'}
                type="password"
                inputProps={{
                  ref: this.reTypePassword,
                }}
              />
              <Button
                endIcon={<SendIcon />}
                variant="contained"
                style={{ padding: 5, marginTop: 10 }}
                onClick={this.handleUpdatePassword}
              >
                Submit
              </Button>
            </Grid>
          </Paper>
        </Modal>
        <Modal
          open={this.state.isLoginModalOpen}
          onClose={this.toggleLoginModal}
          style={{
            margin: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Paper
            style={{
              padding: 20,
              width: '30%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Typography component="h1" variant="h6">
                Change Login
              </Typography>
              <IconButton onClick={this.toggleLoginModal}>
                <CloseIcon />
              </IconButton>
            </Grid>
            <Divider />
            <TextField
              fullWidth
              defaultValue={this.state}
              disabled={!isEditing}
              label={'Old Login'}
              inputProps={{
                ref: this.oldLogin,
              }}
            />
            <TextField
              fullWidth
              disabled={!isEditing}
              label={'New Login'}
              inputProps={{
                ref: this.newLogin,
              }}
            />
            <TextField
              fullWidth
              disabled={!isEditing}
              label={' ReType Login'}
              inputProps={{
                ref: this.reTypeLogin,
              }}
            />
            <Button
              endIcon={<SendIcon />}
              variant="contained"
              style={{ padding: 5, marginTop: 10, width: '100%' }}
              onClick={this.handleUpdateLogin}
            >
              Confirm
            </Button>
          </Paper>
        </Modal>
      </>
    );
  }
}
