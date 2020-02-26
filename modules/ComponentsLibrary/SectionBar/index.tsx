import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Props as ButtonProps } from '../Button';
import Typography from '@material-ui/core/Typography';

interface Props {
  title: string;
  buttons?: ButtonProps[];
  className?: string;
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    backgroundColor: theme.palette.grey[300],
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

export const SectionBar = ({ title, buttons = [], className = '' }: Props) => {
  const classes = useStyles();
  return (
    <div className={className + ' ' + classes.wrapper}>
      <Typography variant="h6">{title}</Typography>
      {buttons.length > 0 && (
        <div>
          {buttons.map((props, idx) => (
            <Button key={idx} {...props} />
          ))}
        </div>
      )}
    </div>
  );
};
