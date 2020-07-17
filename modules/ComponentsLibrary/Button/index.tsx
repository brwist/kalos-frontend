import React, { FC, CSSProperties } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import ButtonUI from '@material-ui/core/Button';

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

const useStyles = makeStyles(theme => ({
  button: ({ compact, size, status }: Style) => ({
    marginTop: theme.spacing(compact ? 0 : 1),
    marginBottom: theme.spacing(compact ? 0 : 1),
    marginLeft: theme.spacing(1),
    ...(size === 'xsmall'
      ? {
          fontSize: 11,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 6,
          paddingRight: 6,
        }
      : {}),
    ...(status
      ? {
          backgroundColor: status === 'success' ? 'green' : 'red',
        }
      : {}),
  }),
  link: {
    textDecoration: 'inherit',
  },
}));

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
  const classes = useStyles({ compact, size, status });
  const Component = (
    <ButtonUI
      className={clsx(classes.button, className && className)}
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
      <a href={url} className={classes.link}>
        {Component}
      </a>
    );
  }
  return Component;
};
