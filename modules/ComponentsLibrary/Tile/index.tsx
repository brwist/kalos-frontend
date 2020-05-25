import React, { useCallback, useState, ReactElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Form, Props } from '../Form';
import { SectionBar } from '../SectionBar';

const useStyles = makeStyles(theme => ({
  form: {
    gridColumnStart: 1,
    [theme.breakpoints.up('sm')]: {
      gridColumnEnd: 3,
    },
    [theme.breakpoints.up('md')]: {
      gridColumnEnd: 4,
    },
  },
  bar: {
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2),
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3),
    },
    height: '100%',
    cursor: 'pointer',
  },
  barTitle: {
    cursor: 'pointer',
  },
}));

export const Tile: <T>(
  props: Omit<Props<T>, 'onClose' | 'submitLabel' | 'cancelLabel'>,
) => ReactElement<Props<T>> = props => {
  const classes = useStyles();
  const [opened, setOpened] = useState<boolean>(false);
  const toggleOpened = useCallback(() => setOpened(!opened), [
    setOpened,
    opened,
  ]);
  return opened ? (
    <Form
      className={classes.form}
      {...props}
      onClose={toggleOpened}
      submitLabel="Report"
      cancelLabel="Close"
    />
  ) : (
    <div onClick={toggleOpened}>
      <SectionBar
        title={props.title}
        className={classes.bar}
        classNameTitle={classes.barTitle}
        actions={[{ label: 'View', variant: 'text' }]}
        fixedActions
      />
    </div>
  );
};
