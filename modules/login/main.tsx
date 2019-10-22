import React, { RefObject, KeyboardEvent } from 'react';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import {
  ActivityLog,
  ActivityLogClient,
} from '@kalos-core/kalos-rpc/ActivityLog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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
    this.LogClient = new ActivityLogClient();
    this.UserClient = new UserClient();

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    this.LoginInput = React.createRef();
    this.PwdInput = React.createRef();
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

  handleUsernameChange = this.handleValueChange('username');

  handlePasswordChange = this.handleValueChange('password');

  redirect() {
    window.location.href = '/transaction/index.html';
  }

  async handleLogin() {
    try {
      const userData = new User();
      userData.setLogin(this.state.inputs.username);
      userData.setPwd(this.state.inputs.password);
      await this.LogClient.GetToken(
        this.state.inputs.username,
        this.state.inputs.password,
      );
      const user = await this.UserClient.Get(userData);
      const log = new ActivityLog();
      log.setActivityName(`${user.firstname} ${user.lastname} authenticated`);
      log.setUserId(user.id);
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
      <div
        style={{
          display: 'flex',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="flex-col p-10">
          {/*<TextField onKeyDown={this.handleUsernameChange} ref={this.LoginInput} label="Username" />*/}
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            onKeyDown={this.handleUsernameChange}
            className="w-100 m-b-10"
            ref={this.LoginInput}
          />
          {/*<TextField onKeyDown={this.handlePasswordChange} ref={this.PwdInput} label="Password" />*/}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onKeyDown={this.handlePasswordChange}
            className="w-100 m-b-10"
            ref={this.PwdInput}
          />
          <Button
            style={{ width: 250, marginTop: 10 }}
            onClick={this.handleLogin}
          >
            Login
          </Button>
        </div>
      </div>
    );
  }
}
