import React, { FC, ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';
//@ts-ignore
import logoKalos from './kalos-logo-2019.png';

interface Props {
  title: string;
  subtitle?: ReactNode;
  logo?: string;
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.common.black,
    padding: theme.spacing(),
    marginBottom: theme.spacing(),
  },
  logo: {
    width: 'auto',
    height: 30,
  },
  content: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
    textAlign: 'center',
  },
  title: {
    ...theme.typography.body1,
    fontSize: 20,
    fontWeight: 900,
  },
  subtitle: {
    fontFamily: theme.typography.body1.fontFamily,
    fontSize: 10,
  },
}));

export const PrintHeader: FC<Props> = ({
  title,
  logo = logoKalos,
  subtitle,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <img src={logo} alt="Kalos Service" className={classes.logo} />
      <div className={classes.content}>
        <div className={classes.title}>{title}</div>
        <div className={classes.subtitle}>{subtitle}</div>
      </div>
    </div>
  );
};
