import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Skeleton from '@material-ui/lab/Skeleton';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      margin: `${theme.spacing(1)}px 0`,
    },
    cardHeader: {
      padding: theme.spacing(1),
    },
    cardContent: {
      padding: `0 ${theme.spacing(1)}px ${theme.spacing(1)}px`,
    },
  }),
);

export const SkeletonCard = () => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.cardHeader}
        avatar={<Skeleton variant="circle" width={16} height={16} />}
        title={<Skeleton width="50%" />}
        subheader={<Skeleton width="50%" />}
      />
      <CardContent className={classes.cardContent}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </CardContent>
    </Card>
  );
};
