import React, { FC } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';

interface Props {
  title: string;
  statusColor: string;
  onClick?: () => void;
  className?: string;
}

const useStyles = makeStyles(theme => ({
  card: {
    margin: `${theme.spacing(1)}px 0`,
    roundColor: theme.palette.primary.light,
  },
  cardHeader: {
    padding: theme.spacing(1),
  },
  cardContent: {
    padding: `0 ${theme.spacing(1)}px ${theme.spacing(1)}px`,
  },
  colorIndicator: {
    display: 'block',
    width: theme.spacing(2),
    height: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
}));

export const CalendarCard: FC<Props> = ({
  title,
  statusColor,
  onClick,
  className = '',
  children,
}) => {
  const classes = useStyles();
  return (
    <Card className={classes.card + ' ' + className} onClick={onClick}>
      <CardActionArea>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <span
              className={classes.colorIndicator}
              style={{ backgroundColor: statusColor }}
            />
          }
          title={title}
        />
        <CardContent className={classes.cardContent}>{children}</CardContent>
      </CardActionArea>
    </Card>
  );
};
