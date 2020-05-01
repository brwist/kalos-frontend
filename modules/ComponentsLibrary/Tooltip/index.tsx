import React, { FC, ReactElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TooltipUI, { TooltipProps } from '@material-ui/core/Tooltip';

interface Props extends Pick<TooltipProps, 'placement' | 'children'> {
  content: string | ReactElement;
}

const useStyles = makeStyles(theme => ({
  tooltip: {
    ...theme.typography.body1,
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    maxWidth: 220,
    borderRadius: 0,
    boxSizing: 'content-box',
    margin: 4,
    boxShadow: theme.shadows[5],
  },
}));

export const Tooltip: FC<Props> = ({
  content,
  placement = 'left',
  children,
}) => {
  const classes = useStyles();
  return (
    <TooltipUI // TODO: make it clickable for mobile devices
      title={content}
      placement={placement}
      classes={{ tooltip: classes.tooltip }}
    >
      {children}
    </TooltipUI>
  );
};
