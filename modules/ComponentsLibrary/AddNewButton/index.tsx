import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import Backdrop from '@material-ui/core/Backdrop';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    speedDial: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      cursor: 'pointer',
    },
    staticTooltipLabel: {
      whiteSpace: 'nowrap',
    },
  }),
);

type Option = {
  icon: JSX.Element;
  name: string;
  url?: string;
  action?: () => void;
};

type Props = {
  options: Option[];
};

export const AddNewButton = ({ options }: Props) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleClick = (url?: string, action?: () => void) => {
    if (url) {
      const win = window.open(url, '_blank');
      if (win) {
        win.focus();
      }
    } else if (action) {
      action();
    }
  };

  return (
    <>
      <Backdrop open={open} style={{ zIndex: 10 }} />
      <SpeedDial
        ariaLabel="Add new event"
        className={classes.speedDial}
        icon={<SpeedDialIcon />}
        onClick={() => setOpen(!open)}
        open={open}
      >
        {options.map(option => (
          <SpeedDialAction
            key={option.name}
            icon={option.icon}
            tooltipTitle={option.name}
            tooltipOpen
            onClick={() => {
              handleClick(option.url, option.action);
            }}
            classes={{ staticTooltipLabel: classes.staticTooltipLabel }}
          />
        ))}
      </SpeedDial>
    </>
  );
};
