import React, { RefObject, KeyboardEvent } from 'react';
import {
  ActivityLogClient,
  AuthData,
  ActivityLog,
  UserClient,
  User,
} from '@kalos-core/kalos-rpc';

interface props {}
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
      const authData = new AuthData();
      const userData = new User();
      authData.setUsername(this.state.inputs.username);
      authData.setPassword(this.state.inputs.password);
      console.log(authData.toObject());
      userData.setLogin(this.state.inputs.username);
      userData.setPwd(this.state.inputs.password);
      await this.LogClient.GetToken(authData);
      const user = await this.UserClient.Get(userData);
      const log = new ActivityLog();
      log.setActivityName('robbie succesfully tested login');
      log.setUserId(user.id);
      await this.LogClient.Create(log);
      this.redirect();
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
        <div style={{ flexDirection: 'column', display: 'flex' }}>
          <input
            type="text"
            onKeyDown={this.handleUsernameChange}
            style={{ width: 250, marginTop: 10 }}
            ref={this.LoginInput}
          />
          <input
            type="password"
            onKeyDown={this.handlePasswordChange}
            style={{ width: 250, marginTop: 10 }}
            ref={this.PwdInput}
          />
          <button style={{ width: 250, marginTop: 10 }}>Login</button>
        </div>
      </div>
    );
  }
}
