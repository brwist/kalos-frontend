import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';

interface Props {
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  blank?: boolean;
}

const useStyles = makeStyles(theme => ({
  link: {
    ...theme.typography.body1,
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.dark,
    },
    '&:active': {
      color: theme.palette.primary.dark,
    },
  },
}));

export const Link: FC<Props> = ({ href = '', blank = false, ...props }) => {
  const classes = useStyles();
  return (
    <a
      className={classes.link}
      href={href}
      {...props}
      target={blank ? '_blank' : '_self'}
    />
  );
};
