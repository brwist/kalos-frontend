import React, { useState, useReducer } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { Button } from '../../ComponentsLibrary/Button';
import SearchableList from './SearchableList';

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

const FilterDrawer = ({ open, toggleDrawer, filterOptions, filters, changeFilters }) => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, filters);
  const { customers, zip } = state;

  const handleSave = () => {
    changeFilters(state);
    toggleDrawer();
  };

  return (
    <Drawer anchor="right" open={open} onClose={() => toggleDrawer(!open)}>
      <SearchableList
        title="Customers"
        options={filterOptions.customers}
        values={customers}
        handleChange={value =>
          dispatch({ type: 'customers', value })
        }
      />
      <SearchableList
        title="ZIP codes"
        options={filterOptions.zip}
        values={zip}
        handleChange={value =>
          dispatch({ type: 'zip', value })
        }
      />
      <Button label="Save" onClick={handleSave} />
    </Drawer>
  );
};

export default FilterDrawer;
