import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import EventIcon from '@material-ui/icons/Event';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AddAlertIcon from '@material-ui/icons/AddAlert';

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
    }
  }),
);

const actions = [
  { icon: <AssignmentIndIcon />, name: 'Task', url: 'https://app.kalosflorida.com/index.cfm?action=admin:service.addServiceCallGeneral' },
  { icon: <AddAlertIcon />, name: 'Reminder', url: 'https://app.kalosflorida.com/index.cfm?action=admin:service.addReminder' },
  { icon: <EventIcon />, name: 'Service Call', url: 'https://app.kalosflorida.com/index.cfm?action=admin:tasks.addtask' },
];

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void,
}

const AddNewButton = ({ open, setOpen}: Props) => {
  const classes = useStyles();
  const toggleOpen = () => {
    setOpen(!open);
  };

  const handleClick = (url: string) => {
    const win = window.open(url, '_blank');
    if (win) {
      win.focus();
    }
  };

  return (
    <SpeedDial
      ariaLabel="Add new event"
      className={classes.speedDial}
      icon={<SpeedDialIcon />}
      onClick={toggleOpen}
      open={open}
    >
      {actions.map(action => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen
          onClick={() => {
            handleClick(action.url);
          }}
          classes={{ staticTooltipLabel: classes.staticTooltipLabel }}
        />
      ))}
    </SpeedDial>
  );
};

export default AddNewButton;