import { IconButton } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React, { CSSProperties } from 'react';
import { getSlackID, slackNotify, UserClientService } from '../../../helpers';
import { Alert } from '../Alert';
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
  ],
  [
    {
      label: 'Message: ',
      type: 'text',
      name: 'message',
      multiline: true,
    },
  ],
];

interface Props {
  // Button options
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

  // Modal options
  compact?: boolean;
  maxWidth?: number | 'none';
  fullScreen?: boolean;
  fullHeight?: boolean;
  classNameForModal?: string;
  modalStyles?: CSSProperties;
  onOpenModal?: () => void;

  // For this specific component
  loggedUserId: number;
  autofillName?: string;
  autofillMessage?: string;
  title?: string;
  type: 'icon' | 'regular';
}

interface State {
  formOpened: boolean;
  noUserFoundWarningOpen: boolean;
}

export class SlackMessageButton extends React.PureComponent<Props, State> {
  userName: string = '';
  data: SlackMessageInstance;
  constructor(props: Props) {
    super(props);
    this.state = {
      formOpened: false,
      noUserFoundWarningOpen: false,
    };
    this.data = new SlackMessageInstance();
    if (this.props.autofillMessage)
      this.data.message = this.props.autofillMessage;
    if (this.props.autofillName) this.data.user = this.props.autofillName;
    this.getUserNameFromId();
  }

  getUserNameFromId = async () => {
    try {
      let user = await UserClientService.loadUserById(this.props.loggedUserId);
      this.userName = `${user.getFirstname()} ${user.getLastname()}`;
    } catch (error: any) {
      console.error('Could not fetch the user name from the given ID.');
    }
  };

  onClick = async () => {
    this.toggleForm();
  };

  sendMessage = async (userToSendTo: string, message?: string) => {
    if (this.userName == '') {
      console.error(
        'An error occurred while sending the message. Please try again.',
      );
      return;
    }
    const messageToSend = `*From ${this.userName}*: ${message}`;

    const slackUser = await getSlackID(userToSendTo);
    if (slackUser === '0') {
      this.toggleNotice();
      return;
    }
    await slackNotify(slackUser, messageToSend);

    console.log('Message sent successfully.');
    this.toggleForm();
  };

  toggleForm = () => {
    this.setState({ formOpened: !this.state.formOpened });
  };

  toggleNotice = () => {
    this.setState({
      noUserFoundWarningOpen: !this.state.noUserFoundWarningOpen,
    });
  };

  render() {
    return (
      <>
        {this.state.noUserFoundWarningOpen && (
          <Alert open={true} onClose={this.toggleNotice} title="Notice">
            <Typography>
              No user could be found with that username. Please double check the
              spelling and try again.
            </Typography>
          </Alert>
        )}
        {this.state.formOpened && (
          <Modal
            open={true}
            onClose={this.toggleForm}
            compact={this.props.compact}
            maxWidth={this.props.maxWidth}
            fullScreen={this.props.fullScreen}
            fullHeight={this.props.fullHeight}
            classname={this.props.classNameForModal}
            styles={this.props.modalStyles}
            onOpen={this.props.onOpenModal}
          >
            <Form
              title={this.props.title ? this.props.title : 'Send a Message'}
              onSave={msg => this.sendMessage(msg.user, msg.message)}
              onClose={this.toggleForm}
              schema={SCHEMA_SLACK_MESSAGE}
              data={this.data}
              submitLabel="Send"
              cancelLabel="Cancel"
            />
          </Modal>
        )}
        {this.props.type == 'regular' && (
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
        )}
        {this.props.type == 'icon' && (
          <IconButton
            onClick={this.props.onClick ? this.props.onClick : this.onClick}
            className={this.props.className}
            style={this.props.style}
          >
            {this.props.children}
          </IconButton>
        )}
      </>
    );
  }
}
