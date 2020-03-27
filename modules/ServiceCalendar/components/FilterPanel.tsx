import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    desc: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: 400,
      color: theme.palette.grey.A200,
      marginLeft: theme.spacing(1),
    },
    panelDetails: {
      flexDirection: 'column',
    },
  }),
);

type Props = {
  title: string;
  selectedCount?: number;
  expanded: boolean;
  handleChange: () => void;
  children: React.ReactNode;
}

const FilterPanel = ({
  title,
  selectedCount,
  expanded,
  handleChange,
  children
}: Props) => {
  const classes = useStyles();
  return (
    <ExpansionPanel expanded={expanded} onChange={handleChange}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography className={classes.heading}>{title}</Typography>
        {!!selectedCount && (
          <Typography className={classes.desc}>| {selectedCount} Selected</Typography>
        )}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.panelDetails}>
        {children}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default FilterPanel;
