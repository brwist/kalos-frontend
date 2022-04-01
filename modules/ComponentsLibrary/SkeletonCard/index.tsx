import React, { FC } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Skeleton from '@material-ui/lab/Skeleton';
import CardContent from '@material-ui/core/CardContent';
import "./SkeletonCard.module.less";

interface Props {
  skipAvatar?: boolean;
}

export const SkeletonCard: FC<Props> = ({ skipAvatar }) => (
  <Card className="SkeletonCard">
    <CardHeader
      className="SkeletonCardHeader"
      avatar={
        skipAvatar ? undefined : (
          <Skeleton variant="circle" width={16} height={16} />
        )
      }
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
