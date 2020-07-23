import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Skeleton from '@material-ui/lab/Skeleton';
import CardContent from '@material-ui/core/CardContent';
import './styles.less';

export const SkeletonCard = () => (
  <Card className="SkeletonCard">
    <CardHeader
      className="SkeletonCardHeader"
      avatar={<Skeleton variant="circle" width={16} height={16} />}
      title={<Skeleton width="50%" />}
      subheader={<Skeleton width="50%" />}
    />
    <CardContent className="SkeletonCardContent">
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </CardContent>
  </Card>
);
