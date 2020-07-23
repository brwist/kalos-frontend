import React, { FC, ReactElement } from 'react';
import TooltipUI, { TooltipProps } from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import './styles.less';

type Style = {
  maxWidth?: number;
};
type Props = Style &
  Pick<TooltipProps, 'placement' | 'children'> & {
    content: string | ReactElement;
  };

export const Tooltip: FC<Props> = ({
  content,
  placement = 'left',
  children,
  maxWidth = 220,
}) => (
  <TooltipUI // TODO: make it clickable for mobile devices
    title={content}
    placement={placement}
    classes={{ tooltip: 'Tooltip' }}
    enterTouchDelay={50}
    leaveTouchDelay={60000}
    TransitionComponent={Fade}
    style={{ maxWidth }}
  >
    {children}
  </TooltipUI>
);
