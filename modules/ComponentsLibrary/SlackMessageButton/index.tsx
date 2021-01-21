import React, { CSSProperties } from 'react';
import {
  getSlackID,
  getSlackList,
  slackNotify,
  UserClientService,
} from '../../../helpers';
import { Button } from '../Button/index';
import { Form, Schema } from '../Form';
import { Modal } from '../Modal';

type SlackMessage = {
  user: string;
  message: string;
};

class SlackMessageInstance implements SlackMessage {
  user: string = '';
  message: string = '';
}

export const SCHEMA_SLACK_MESSAGE: Schema<SlackMessage> = [
  [
    {
      label: 'User to Send to: ',
      type: 'text',
      name: 'user',
    },
    {
      label: 'Message: ',
      type: 'text',
      name: 'message',
    },
  ],
];

interface Props {
  label: string;
  url?: string;
  disabled?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary';
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
  span?: boolean;
  startIcon?: JSX.Element;
  style?: CSSProperties;
  loading?: boolean;
  userName: string;
  textToSend: string;
  loggedUserId: number;
}

interface State {
  formOpened: boolean;
}

export class SlackMessageButton extends React.PureComponent<Props, State> {
  userName: string = '';
  constructor(props: Props) {
    super(props);
    this.state = {
      formOpened: false,
    };

    this.getUserNameFromId();
  }

  getUserNameFromId = async () => {
    try {
      let user = await UserClientService.loadUserById(this.props.loggedUserId);
      this.userName = `${user.firstname} ${user.lastname}`;
    } catch (error: any) {
      console.error('Could not fetch the user name from the given ID.');
    }
  };

  onClick = async () => {
    if (this.userName == '') {
      console.error(
        'An error occurred while sending the message. Please try again.',
      );
      return;
    }

    this.setState({ formOpened: true });
  };

  sendMessage = async () => {
    const messageToSend = `*From ${this.userName}*: ${this.props.textToSend}.`;

    const slackUser = await getSlackID(this.props.userName);
    await slackNotify(slackUser, messageToSend);

    console.log('Message sent successfully.');
  };

  render() {
    return (
      <>
        {this.state.formOpened && (
          <Modal open={true} onClose={() => alert('Closed')}>
            <Form
              title="Send a Message"
              onSave={msg => alert('Send ' + msg.message + ' to ' + msg.user)}
              onClose={() => alert('Closed form')}
              schema={SCHEMA_SLACK_MESSAGE}
              data={new SlackMessageInstance()}
              submitLabel="Send"
              cancelLabel="Cancel"
            />
          </Modal>
        )}
        <Button
          label={this.props.label}
          url={this.props.url}
          onClick={this.props.onClick ? this.props.onClick : this.onClick}
          disabled={this.props.disabled}
          variant={this.props.variant}
          color={this.props.color}
          fullWidth={this.props.fullWidth}
          className={this.props.className}
          span={this.props.span}
          startIcon={this.props.startIcon}
          style={this.props.style}
          loading={this.props.loading}
        />
      </>
    );
  }
}
