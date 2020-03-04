import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';

interface Props {
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
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

export const Link: FC<Props> = ({ href = '', ...props }) => {
  const classes = useStyles();
  return <a className={classes.link} href={href} {...props} />;
};
