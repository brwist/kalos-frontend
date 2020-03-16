import React, { useState, useReducer } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import { Button } from '../../ComponentsLibrary/Button';
import SearchableList from './SearchableList';
import {JobTypePicker} from '../../Pickers/JobType';
import {JobSubtypePicker} from '../../Pickers/JobSubtype';
import {useCalendarData} from '../hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
    },
    buttons: {
      display: 'flex',
      justifyContent: 'space-between',
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
    const propertyUse = [...state.propertyUse];
    const currentIndex = propertyUse.indexOf(action.value);

    if (currentIndex === -1) {
      propertyUse.push(action.value);
    } else {
      propertyUse.splice(currentIndex, 1);
    }
    return {
      ...state,
      propertyUse,
    };
  }
    case 'resetFilters':
      return action.value;
  default:
    return {...state};
  }
};

const FilterDrawer = ({
  open,
  toggleDrawer,
}) => {
  const classes = useStyles();
  const { fetchingCalendarData, filters, initialFilters, changeFilters, customersMap, zipCodesMap } = useCalendarData();
  const [state, dispatch] = useReducer(reducer, filters);
  const { customers, zip, jobType, jobSubType, propertyUse } = state;

  const handleSave = () => {
    changeFilters(state);
    toggleDrawer();
  };

  const handleReset = () => {
    dispatch({ type: 'resetFilters', value: initialFilters });
  };

  return (
    <Drawer anchor="right" open={open} onClose={() => toggleDrawer(!open)}>
      <div className={classes.root}>
        <div>
          <SearchableList
            title="Customers"
            options={customersMap}
            values={customers}
            loading={fetchingCalendarData}
            handleChange={value =>
              dispatch({ type: 'customers', value })
            }
          />
          <SearchableList
            title="ZIP Codes"
            options={zipCodesMap}
            values={zip}
            loading={fetchingCalendarData}
            handleChange={value =>
              dispatch({ type: 'zip', value })
            }
          />
          <SearchableList
            title="Property Use"
            options={{
              1: 'Residential',
              0: 'Commercial',
            }}
            values={propertyUse}
            handleChange={value =>
              dispatch({ type: 'propertyUse', value })
            }
            noSearch
          />
          <ListItem>
            <JobTypePicker
              selected={jobType}
              onSelect={value =>
                dispatch({ type: 'jobType', value })
              }
            />
          </ListItem>
          <ListItem>
            <JobSubtypePicker
              selected={jobSubType}
              jobTypeID={jobType}
              onSelect={value =>
                dispatch({ type: 'jobSubType', value })
              }
            />
          </ListItem>
        </div>
        <div className={classes.buttons}>
          <Button label="Reset" onClick={handleReset} color="secondary" fullWidth />
          <Button label="Save" onClick={handleSave} fullWidth />
        </div>
      </div>
    </Drawer>
  );
};

export default FilterDrawer;
