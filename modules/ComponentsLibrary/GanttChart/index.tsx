import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';

interface Props {}

const useStyles = makeStyles(theme => ({}));

export const GanttChart: FC<Props> = ({}) => {
  const classes = useStyles();
  return <div>GanttChart</div>;
};
