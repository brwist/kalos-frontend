import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonUI from '@material-ui/core/Button';

type Style = {
  compact?: boolean;
  size?: 'large' | 'medium' | 'small' | 'xsmall';
};
export interface Props extends Style {
  label: string;
  url?: string;
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  disabled?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
}

const useStyles = makeStyles(theme => ({
  button: ({ compact, size }: Style) => ({
    marginTop: theme.spacing(compact ? 0 : 1),
    marginBottom: theme.spacing(compact ? 0 : 1),
    marginLeft: theme.spacing(compact ? 0 : 1),
    ...(size === 'xsmall'
      ? {
          fontSize: 11,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 6,
          paddingRight: 6,
        }
      : {}),
  }),
  link: {
    textDecoration: 'inherit',
  },
}));

export const Button = ({
  label,
  url,
  variant = 'contained',
  compact = false,
  size = 'small',
  ...props
}: Props) => {
  const classes = useStyles({ compact, size });
  const Component = (
    <ButtonUI
      className={classes.button}
      variant={variant}
      color="primary"
      {...props}
      size={size === 'xsmall' ? 'small' : size}
    >
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
