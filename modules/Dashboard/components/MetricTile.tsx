import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Tooltip from '@material-ui/core/Tooltip';

interface tileProps {
  title: string;
  subtitle: string;
  isLoading: boolean;
  tooltip: string;
}

export const MetricTile = ({
  title,
  subtitle,
  isLoading,
  tooltip,
}: tileProps) => {
  return (
    <Grid item xs={6} lg={3}>
      <Grid
        container
        direction="column"
        justify="space-evenly"
        alignItems="center"
      >
        <Typography variant="subtitle1" component="h1">
          {title}
        </Typography>
        {isLoading && (subtitle === '$0' || subtitle === '0') ? (
          <Skeleton variant="text" width={20} height={41} />
        ) : (
          <Tooltip placement="bottom" title={tooltip}>
            <Typography variant="h4" component="span">
              {subtitle}
            </Typography>
          </Tooltip>
        )}
      </Grid>
    </Grid>
  );
};
