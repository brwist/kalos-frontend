import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';

interface Props {}

const useStyles = makeStyles(theme => ({}));

export const EditProject: FC<Props> = ({}) => {
  const classes = useStyles();
  return <div>EditProject</div>;
};
