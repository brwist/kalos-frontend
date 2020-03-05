import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonUI from '@material-ui/core/Button';

type Style = {
  compact?: boolean;
};
export interface Props extends Style {
  label: string;
  url?: string;
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  disabled?: boolean;
  variant?: 'contained' | 'outlined';
}

const useStyles = makeStyles(theme => ({
  button: ({ compact }: Style) => ({
    marginTop: theme.spacing(compact ? 0 : 1),
    marginBottom: theme.spacing(compact ? 0 : 1),
    marginLeft: theme.spacing(compact ? 0 : 1),
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
  ...props
}: Props) => {
  const classes = useStyles({ compact });
  const Component = (
    <ButtonUI
      className={classes.button}
      variant={variant}
      color="primary"
      size="small"
      {...props}
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
