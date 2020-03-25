import React, {useState, useReducer, useCallback} from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import { Button } from '../../ComponentsLibrary/Button';
import FilterPanel from './FilterPanel';
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
      width: 320,
    },
    panels: {
      overflow: 'auto',
    },
    buttons: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    button: {
      margin: theme.spacing(1),
    },
  }),
);

type State = {
  customers: string[];
  zip: string[];
  jobType: number;
  jobSubType: number;
  propertyUse: string[];
}

type Action =
  | { type: 'toggleAll', key: string, value: string[] }
  | { type: 'customers', value: string }
  | { type: 'zip', value: string }
  | { type: 'jobType', value: number }
  | { type: 'jobSubType', value: number }
  | { type: 'propertyUse', value: string }
  | { type: 'resetFilters', value: State };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
  case 'toggleAll': {
    return {
      ...state,
      [action.key]: action.value,
    };
  }
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

type Props = {
  open: boolean;
  toggleDrawer: (show: boolean) => void;
}

const FilterDrawer = ({
  open,
  toggleDrawer,
}: Props) => {
  const classes = useStyles();
  const { fetchingCalendarData, filters, initialFilters, changeFilters, customersMap, zipCodesMap } = useCalendarData();
  const [expanded, setExpanded] = useState('');
  const [state, dispatch] = useReducer(reducer, filters);
  const { customers, zip, jobType, jobSubType, propertyUse } = state;

  const toggleExpanded = useCallback(key => {
    if (key === expanded) {
      setExpanded('');
    } else {
      setExpanded(key);
    }
  } , [expanded]);

  const handleSave = () => {
    changeFilters(state);
    toggleDrawer(false);
  };

  const handleReset = () => {
    dispatch({ type: 'resetFilters', value: initialFilters });
  };

  return (
    <Drawer anchor="right" open={open} onClose={() => toggleDrawer(!open)}>
      <Box className={classes.root}>
        <Box className={classes.panels}>
          <FilterPanel
            title="Customers"
            selectedCount={customers.length}
            expanded={expanded === 'customers'}
            handleChange={() => toggleExpanded('customers')}
          >
            <SearchableList
              title="Customers"
              options={customersMap}
              values={customers}
              loading={fetchingCalendarData}
              handleChange={value =>
                dispatch({ type: 'customers', value })
              }
              handleToggleAll={value =>
                dispatch({
                  type: 'toggleAll',
                  key: 'customers',
                  value: value ? Object.keys(customersMap) : [],
                })
              }
            />
          </FilterPanel>
          <FilterPanel
            title="ZIP Codes"
            selectedCount={zip.length}
            expanded={expanded === 'zip'}
            handleChange={() => toggleExpanded('zip')}
          >
            <SearchableList
              title="ZIP Codes"
              options={zipCodesMap}
              values={zip}
              loading={fetchingCalendarData}
              handleChange={value =>
                dispatch({ type: 'zip', value })
              }
              handleToggleAll={value =>
                dispatch({
                  type: 'toggleAll',
                  key: 'zip',
                  value: value ? Object.keys(zipCodesMap) : [],
                })
              }
            />
          </FilterPanel>
          <FilterPanel
            title="Property Use"
            selectedCount={propertyUse.length}
            expanded={expanded === 'propUse'}
            handleChange={() => toggleExpanded('propUse')}
          >
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
          </FilterPanel>
          <FilterPanel
            title="Job Type & Subtype"
            expanded={expanded === 'jobType'}
            handleChange={() => toggleExpanded('jobType')}
          >
            <JobTypePicker
              selected={jobType}
              onSelect={value =>
                dispatch({ type: 'jobType', value })
              }
            />
            <JobSubtypePicker
              selected={jobSubType}
              jobTypeID={jobType}
              onSelect={value =>
                dispatch({ type: 'jobSubType', value })
              }
            />
          </FilterPanel>
        </Box>
        <div className={classes.buttons}>
          <Button
            label="Reset"
            className={classes.button}
            onClick={handleReset}
            color="secondary"
            fullWidth
          />
          <Button
            label="Save"
            className={classes.button}
            onClick={handleSave}
            fullWidth
          />
        </div>
      </Box>
    </Drawer>
  );
};

export default FilterDrawer;
