import React, { CSSProperties } from 'react';
import {
  getSlackID,
  getSlackList,
  slackNotify,
  UserClientService,
} from '../../../helpers';
import { Button } from '../Button/index';

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

interface State {}

export class SlackMessageButton extends React.PureComponent<Props, State> {
  userName: string = '';
  constructor(props: Props) {
    super(props);
    this.state = {};

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

    const messageToSend = `*From ${this.userName}*: ${this.props.textToSend}.`;

    const slackUser = await getSlackID(this.props.userName);
    await slackNotify(slackUser, messageToSend);

    console.log('Message sent successfully.');
  };

  render() {
    return (
      <>
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
