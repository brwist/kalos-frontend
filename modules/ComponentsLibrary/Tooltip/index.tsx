import React, { FC, ReactElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TooltipUI, { TooltipProps } from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';

type Style = {
  maxWidth?: number;
};
type Props = Style &
  Pick<TooltipProps, 'placement' | 'children'> & {
    content: string | ReactElement;
  };

const useStyles = makeStyles(theme => ({
  tooltip: ({ maxWidth }: Style) => ({
    ...theme.typography.body1,
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    borderRadius: 0,
    boxSizing: 'content-box',
    margin: 4,
    boxShadow: theme.shadows[5],
    maxWidth,
  }),
}));

export const Tooltip: FC<Props> = ({
  content,
  placement = 'left',
  children,
  maxWidth = 220,
}) => {
  const classes = useStyles({ maxWidth });
  return (
    <TooltipUI // TODO: make it clickable for mobile devices
      title={content}
      placement={placement}
      classes={{ tooltip: classes.tooltip }}
      enterTouchDelay={50}
      leaveTouchDelay={60000}
      TransitionComponent={Fade}
    >
      {children}
    </TooltipUI>
  );
};
