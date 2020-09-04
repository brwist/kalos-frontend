import React, { FC, CSSProperties } from 'react';
import clsx from 'clsx';
import ButtonUI from '@material-ui/core/Button';
import './styles.less';

type Style = {
  compact?: boolean;
  size?: 'large' | 'medium' | 'small' | 'xsmall';
  status?: 'success' | 'failure';
};
export interface Props extends Style {
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
}

export const Button: FC<Props> = ({
  label,
  url,
  variant = 'contained',
  compact = false,
  size = 'small',
  color = 'primary',
  span = false,
  status,
  className,
  children,
  ...props
}) => {
  const Component = (
    <ButtonUI
      className={clsx(
        'ButtonWrapper',
        className && className,
        `size-${size}`,
        `status-${status}`,
        {
          compact,
          status,
          icon: !label,
        },
      )}
      variant={variant}
      color={color}
      size={size === 'xsmall' ? 'small' : size}
      {...props}
      component={span ? 'span' : 'button'}
    >
      {children}
      {label}
    </ButtonUI>
  );
  if (url) {
    return (
      <a href={url} className="ButtonLink">
        {Component}
      </a>
    );
  }
  return Component;
};
