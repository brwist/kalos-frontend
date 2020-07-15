import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';

interface Props {}

const useStyles = makeStyles(theme => ({}));

export const PDFMaker: FC<Props> = ({}) => {
  const classes = useStyles();
  return <div>PDFMaker</div>;
};
