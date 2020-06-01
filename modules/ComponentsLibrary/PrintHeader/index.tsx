import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
//@ts-ignore
import logoKalos from './kalos-logo-2019.png';

interface Props {
  title: string;
  subtitle?: string;
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
  title: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
    ...theme.typography.body1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 900,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 900,
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
      <div className={classes.title}>
        <div>{title}</div>
        <div className={classes.subtitle}>{subtitle}</div>
      </div>
    </div>
  );
};
