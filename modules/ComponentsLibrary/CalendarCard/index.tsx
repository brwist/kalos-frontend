import React, { FC } from 'react';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import './CalendarCard.module.less';

interface Props {
  title: string;
  statusColor: string;
  onClick?: () => void;
  className?: string;
}

export const CalendarCard: FC<Props> = ({
  title,
  statusColor,
  onClick,
  className = '',
  children,
}) => (
  <Card className={clsx('CalendarCard', className)} onClick={onClick}>
    <CardActionArea>
      <CardHeader
        className="CalendarCardHeader"
        avatar={
          <span
            className="CalendarCardColorIndicator"
            style={{ backgroundColor: statusColor }}
          />
        }
        title={title}
      />
      <CardContent className="CalendarCardContent">{children}</CardContent>
    </CardActionArea>
  </Card>
);
