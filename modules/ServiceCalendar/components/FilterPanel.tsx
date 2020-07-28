import React from 'react';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import './filterPanel.less';

type Props = {
  title: string;
  selectedCount?: number;
  expanded: boolean;
  handleChange: () => void;
  children: React.ReactNode;
};

const FilterPanel = ({
  title,
  selectedCount,
  expanded,
  handleChange,
  children,
}: Props) => (
  <ExpansionPanel expanded={expanded} onChange={handleChange}>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <Typography className="ServiceCalendarFilterPanelHeading">
        {title}
      </Typography>
      {!!selectedCount && (
        <Typography className="ServiceCalendarFilterPanelDesc">
          | {selectedCount} Selected
        </Typography>
      )}
    </ExpansionPanelSummary>
    <ExpansionPanelDetails className="ServiceCalendarFilterPanelPanelDetails">
      {children}
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

export default FilterPanel;
