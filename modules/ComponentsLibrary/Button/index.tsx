import React, { FC, CSSProperties } from 'react';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import ButtonUI from '@material-ui/core/Button';
import './Button.module.less';

type Style = {
  compact?: boolean;
  size?: 'large' | 'medium' | 'small' | 'xsmall';
  status?: 'success' | 'failure';
};
export interface Props extends Style {
  label: string;
  url?: string;
  target?: string;
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
}

export const Button: FC<Props> = ({
  label,
  url,
  target,
  variant = 'contained',
  compact = false,
  size = 'small',
  color = 'primary',
  span = false,
  status,
  className,
  children,
  loading,
  ...props
}) => {
  const Component = (
    <ButtonUI
      className={clsx(
        'ButtonWrapper',
        className && className,
        `size-${size}`,
        `status-${status}`,
        `variant-${variant}`,
        {
          compact,
          status,
          icon: !label,
          disabled: props.disabled,
        },
      )}
      variant={variant}
      color={color}
      size={size === 'xsmall' ? 'small' : size}
      {...props}
      component={span ? 'span' : 'button'}
    >
      {loading && (
        <CircularProgress
          className="ButtonWrapperLoader"
          size={size === 'xsmall' ? 10 : 16}
        />
      )}
      {children}
      {label}
    </ButtonUI>
  );
  if (url) {
    return (
      <a href={url} target={target} className="ButtonLink">
        {Component}
      </a>
    );
  }
  return Component;
};
