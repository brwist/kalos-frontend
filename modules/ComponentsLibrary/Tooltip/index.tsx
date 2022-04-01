import React, { FC, ReactElement } from 'react';
import TooltipUI, { TooltipProps } from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import "./Tooltip.module.less";

type Style = {
  controlled?: boolean;
  maxWidth?: number;
  noPadding?: boolean;
};
type Props = Style &
  Pick<TooltipProps, 'placement' | 'children' | 'open'> & {
    content: string | ReactElement;
    open?: boolean;
  };

export const Tooltip: FC<Props> = ({
  content,
  placement = 'left',
  children,
  maxWidth = 220,
  open = false,
  controlled = false,
  noPadding = false,
}) => (
  <TooltipUI // TODO: make it clickable for mobile devices
    title={content}
    placement={placement}
    classes={{
      tooltip: `Tooltip ${noPadding ? 'NoPadding' : ''}`,
      popper: controlled ? 'TooltipPopover' : '',
    }}
    enterTouchDelay={50}
    leaveTouchDelay={60000}
    TransitionComponent={Fade}
    style={{ maxWidth }}
    open={controlled ? open : undefined}
  >
    {children}
  </TooltipUI>
);
