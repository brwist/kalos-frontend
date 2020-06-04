import React, { FC, ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';

export interface Props {
  items: ReactNode[];
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    fontFamily: theme.typography.body1.fontFamily,
    fontSize: 10,
    marginTop: theme.spacing(),
    marginBottom: theme.spacing(),
    paddingLeft: theme.spacing(2.5),
  },
  item: {
    marginBottom: theme.spacing(0.5),
  },
}));

export const PrintList: FC<Props> = ({ items }) => {
  const classes = useStyles();
  return (
    <ul className={classes.wrapper}>
      {items.map((item, idx) => (
        <li key={idx} className={classes.item}>
          {item}
        </li>
      ))}
    </ul>
  );
};
