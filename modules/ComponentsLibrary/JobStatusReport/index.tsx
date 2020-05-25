import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FilterForm } from '../Reports';

const useStyles = makeStyles(theme => ({}));

export const JobStatusReport: FC<FilterForm> = ({}) => {
  const classes = useStyles();
  return <div>JobStatusReport</div>;
};
