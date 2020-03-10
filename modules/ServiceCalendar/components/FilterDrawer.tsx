import React, { useState, useReducer } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import {Button} from '../../ComponentsLibrary/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }),
);

type State = {
  filters: Filters
}

type Action =
  | { type: 'customers', value: number }
  | { type: 'zip', value: number }
  | { type: 'jobType', value: number}
  | { type: 'jobSubType', value: number}
  | { type: 'propertyUse', value: string};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
  case 'customers': {
    const customers = [...state.customers];
    const currentIndex = customers.indexOf(action.value);
    if (currentIndex === -1) {
      customers.push(action.value);
    } else {
      customers.splice(currentIndex, 1);
    }
    return {
      ...state,
      customers
    };
  }
  case 'zip': {
    const zip = [...state.zip];
    const currentIndex = zip.indexOf(action.value);
  
    if (currentIndex === -1) {
      zip.push(action.value);
    } else {
      zip.splice(currentIndex, 1);
    }
    return {
      ...state,
      zip,
    };
  }
  case 'jobType': {
    return {
      ...state,
      jobType: action.value,
    };
  }
  case 'jobSubType': {
    return {
      ...state,
      jobSubType: action.value,
    };
  }
  case 'propertyUse': {
    return {
      ...state,
      propertyUse: action.value,
    };
  }
  default:
    return {...state};
  }
};

const FilterDrawer = ({ open, toggleDrawer, filters, customersList, changeFilters }) => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, filters);
  const { customers } = state;

  const handleSave = () => {
    changeFilters(state);
    toggleDrawer();
  };

  return (
    <Drawer anchor="right" open={open} onClose={() => toggleDrawer(!open)}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.heading}>Customers</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List>
            {Object.entries(customersList).map(([id, name]) => (
              <ListItem key={`customer-${id}`} role={undefined} dense button onClick={() => {dispatch({ type: 'customers', value: +id })}}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={customers.indexOf(+id) !== -1}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            ))}
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <Button label="Save" onClick={handleSave} />
    </Drawer>
  );
};

export default FilterDrawer;
