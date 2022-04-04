import React from 'react';
import AccordianSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import AccordianDetails from '@material-ui/core/AccordionDetails';
import Accordian from '@material-ui/core/Accordion';
import './FilterPanel.module.less';

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
  <Accordian expanded={expanded} onChange={handleChange}>
    <AccordianSummary expandIcon={<ExpandMoreIcon />}>
      <Typography className="ServiceCalendarFilterPanelHeading">
        {title}
      </Typography>
      {!!selectedCount && (
        <Typography className="ServiceCalendarFilterPanelDesc">
          | {selectedCount} Selected
        </Typography>
      )}
    </AccordianSummary>
    <AccordianDetails className="ServiceCalendarFilterPanelPanelDetails">
      {children}
    </AccordianDetails>
  </Accordian>
);

export default FilterPanel;
