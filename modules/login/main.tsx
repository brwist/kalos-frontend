import React, { RefObject, KeyboardEvent } from 'react';
import { UserClient, User } from '../../@kalos-core/kalos-rpc/User';
import {
  ActivityLog,
  ActivityLogClient,
} from '../../@kalos-core/kalos-rpc/ActivityLog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { ENDPOINT } from '../../@kalos-core/kalos-rpc/constants';

interface props {
  onSuccess?(): void;
}

interface state {
  inputs: {
    [key: string]: string;
  };
}

export class Login extends React.PureComponent<props, state> {
  private LogClient: ActivityLogClient;
  private UserClient: UserClient;
  private LoginInput: RefObject<HTMLInputElement>;
  private PwdInput: RefObject<HTMLInputElement>;
  constructor(props: props) {
    super(props);
    this.state = {
      inputs: {
        username: '',
        password: '',
      },
    };
    this.LogClient = new ActivityLogClient(ENDPOINT);
    this.UserClient = new UserClient(ENDPOINT);

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    this.LoginInput = React.createRef();
    this.PwdInput = React.createRef();
  }

  enterListener(target: string) {
    return (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (target === 'username') {
          this.focusNext();
        } else {
          this.handleLogin();
        }
      }
    };
  }

  handleValueChange(target: string) {
    return (e: KeyboardEvent<HTMLInputElement>) => {
      const value = e.key;
      if (value.length === 1) {
        this.setState(prevState => ({
          inputs: {
            ...prevState.inputs,
            [target]: `${prevState.inputs[target]}${value}`,
          },
        }));
      } else if (value === 'Backspace') {
        this.setState(prevState => ({
          inputs: {
            ...prevState.inputs,
            username: `${prevState.inputs[target].slice(
              0,
              prevState.inputs[target].length - 1,
            )}`,
          },
        }));
      } else if (value === 'Enter') {
        if (target === 'username') {
          this.focusNext();
        } else {
          this.handleLogin();
        }
      }
    };
  }

  handleUsernameEnter = this.enterListener('username');
  handleUsernameChange = this.handleValueChange('username');

  handlePasswordEnter = this.enterListener('password');
  handlePasswordChange = this.handleValueChange('password');

  async handleLogin() {
    try {
      const userData = new User();
      const username = this.LoginInput.current!.value;
      const password = this.PwdInput.current!.value;
      userData.setLogin(username);
      userData.setPwd(password);
      await this.LogClient.GetToken(username, password);
      const user = await this.UserClient.Get(userData);
      const log = new ActivityLog();
      log.setActivityName(
        `${user.getFirstname()} ${user.getLastname()} authenticated`,
      );
      log.setUserId(user.getId());
      await this.LogClient.Create(log);
      if (this.props.onSuccess) {
        this.props.onSuccess();
      }
    } catch (err) {
      console.log(err);
    }
  }

  focusNext() {
    this.PwdInput.current && this.PwdInput.current.focus();
  }
  componentDidMount() {
    this.LoginInput.current && this.LoginInput.current.focus();
  }
  render() {
    return (
      <Grid container direction="column" alignItems="center" justify="center">
        <TextField
          inputRef={this.LoginInput}
          label="Username"
          inputProps={{ onKeyDown: this.handleUsernameEnter }}
        />
        <TextField
          inputProps={{
            onKeyDown: this.handlePasswordEnter,
          }}
          type="password"
          inputRef={this.PwdInput}
          label="Password"
        />
        <Button
          style={{ width: 250, marginTop: 10 }}
          onClick={this.handleLogin}
        >
          Login
        </Button>
      </Grid>
    );
  }
}
