import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonUI from '@material-ui/core/Button';

export interface props {
  label: string;
  url?: string;
  onClick?: () => void;
}

const useStyles = makeStyles(theme => ({
  button: {
    marginLeft: theme.spacing(),
  },
  link: {
    textDecoration: 'inherit',
  },
}));

const Button = ({ label, url, onClick }: props) => {
  const classes = useStyles();
  const Component = (
    <ButtonUI
      className={classes.button}
      variant="contained"
      color="primary"
      onClick={onClick}
      size="small"
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

export default Button;
