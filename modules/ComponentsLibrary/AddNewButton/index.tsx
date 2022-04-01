import React, { useState } from 'react';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import Backdrop from '@material-ui/core/Backdrop';
import SearchIcon from '@material-ui/icons/Search';
import 'AddNewButton.module.less';

type Option = {
  icon: JSX.Element;
  name: string;
  url?: string;
  action?: () => void;
};

type Props = {
  options: Option[];
  url?: string;
  search?: boolean;
};

export const AddNewButton = ({ options, search, url }: Props) => {
  const [open, setOpen] = useState(false);

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
        className="AddNewButtonSpeedDial"
        icon={search ? <SearchIcon /> : <SpeedDialIcon />}
        onClick={() => (url ? window.open(url, '_blank') : setOpen(!open))}
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
            classes={{ staticTooltipLabel: 'AddNewButtonStaticTooltipLabel' }}
          />
        ))}
      </SpeedDial>
    </>
  );
};
