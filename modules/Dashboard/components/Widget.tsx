import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Paper from '@material-ui/core/Paper';

interface WidgetProps {
  title: string;
  subtitle: string;
  displayData: string;
  displaySubtitle: string;
  action: React.ReactElement;
  isLoading: boolean;
}

export const Widget = ({
  title,
  subtitle,
  displayData,
  displaySubtitle,
  action,
  isLoading,
}: WidgetProps) => {
  console.log(displayData);
  return (
    <Grid item xs={6} lg={3}>
      <Paper elevation={7} style={{ margin: 20, padding: 10 }}>
        <Grid
          container
          item
          direction="column"
          alignItems="center"
          justify="space-between"
        >
          <span>
            <Typography variant="subtitle1" component="span">
              {title}
            </Typography>
            <Typography variant="subtitle2" component="span">
              {subtitle}
            </Typography>
          </span>
          <span style={{ margin: 10 }}>
            {isLoading &&
            (displayData === '' ||
              displayData === '0' ||
              displayData === '$0') ? (
              <Skeleton variant="text" width={38} height={38} />
            ) : (
              <Typography variant="h4" component="span">
                {displayData}
              </Typography>
            )}
            {!isLoading && (
              <Typography variant="body1" component="span">
                {displaySubtitle}
              </Typography>
            )}
          </span>
          {action}
        </Grid>
      </Paper>
    </Grid>
  );
};
