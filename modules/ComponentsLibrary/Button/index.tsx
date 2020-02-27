import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonUI from '@material-ui/core/Button';

export interface Props {
  label: string;
  url?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'contained' | 'outlined';
}

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(),
    marginBottom: theme.spacing(),
    marginLeft: theme.spacing(),
  },
  link: {
    textDecoration: 'inherit',
  },
}));

export const Button = ({
  label,
  url,
  variant = 'contained',
  ...props
}: Props) => {
  const classes = useStyles();
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
