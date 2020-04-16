import React from 'react';
import { attachProtobuf, expects, supplies } from './attachProtobuf';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';

interface props {
  userId?: number;
}

interface state {
  lastname: string;
  firstname: string;
  currentStatus?: string;
}

@attachProtobuf(UserClient, User, 'me')
@supplies('me', 'id', 'currentStatus')
@expects('me', 'firstname', 'lastname', 'currentStatus')
export class PBInjectorDemonstration extends React.PureComponent<props, state> {
  id?: number;
  begin: () => void;
  save: () => void;
  constructor(props: props) {
    super(props);
    this.state = { firstname: '', lastname: '' };
    this.id = props.userId || 1550;
    this.begin = Reflect.get(this, 'me$Get').bind(this);
    this.save = Reflect.get(this, 'me$Send').bind(this);
  }
  componentDidMount() {
    this.begin();
  }
  get firstname(): string {
    return this.state.firstname;
  }
  set firstname(name: string) {
    this.setState(old => ({ ...old, firstname: name }));
  }
  get lastname(): string {
    return this.state.lastname;
  }
  set lastname(named: string) {
    this.setState(old => ({ ...old, lastname: named }));
  }
  get currentStatus(): string {
    return this.state.currentStatus || '';
  }
  set currentStatus(named: string) {
    this.setState(old => ({ ...old, currentStatus: named }));
  }
  render() {
    return (
      <>
        <div>
          {this.firstname} {this.lastname}
        </div>
        <div>
          Status:
          <input
            value={this.currentStatus}
            onChange={event => (this.currentStatus = event.target.value)}
          />
          <button type="button" onClick={this.save}>
            Apply
          </button>
        </div>
      </>
    );
  }
}
