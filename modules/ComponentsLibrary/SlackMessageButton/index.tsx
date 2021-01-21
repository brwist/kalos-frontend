import React, { CSSProperties } from 'react';
import { Button } from '../Button/index';

interface Props {
  label: string;
  url?: string;
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  disabled?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary';
  fullWidth?: boolean;
  className?: string;
  span?: boolean;
  startIcon?: JSX.Element;
  style?: CSSProperties;
  loading?: boolean;
  userId: number;
}

interface State {}

export class SlackMessageButton extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <Button
          label={this.props.label}
          url={this.props.url}
          onClick={this.props.onClick}
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
