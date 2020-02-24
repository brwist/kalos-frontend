import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

interface props {
  title: string;
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    backgroundColor: theme.palette.grey[300],
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const SectionBar = ({ title }: props) => {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <Typography variant="h6">{title}</Typography>
    </div>
  );
};

export default SectionBar;
