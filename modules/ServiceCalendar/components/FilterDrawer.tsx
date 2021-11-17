import React, { useState, useReducer, useCallback } from 'react';
import compact from 'lodash/compact';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import { Button } from '../../ComponentsLibrary/Button';
import FilterPanel from './FilterPanel';
import SearchableList from './SearchableList';
import { JobTypePicker } from '../../ComponentsLibrary/Pickers/JobType';
import { JobTypePickerMulti } from '../../ComponentsLibrary/Pickers/JobTypeMulti';

import { JobSubtypePicker } from '../../ComponentsLibrary/Pickers/JobSubtype';
import { useWindowSize } from '../../ComponentsLibrary/hooks';
import { Field } from '../../ComponentsLibrary/Field';
import { useCalendarData } from '../hooks';
import './filterDrawer.less';

type State = {
  customers: string[];
  zip: string[];
  jobType: string;
  jobSubType: number;
  propertyUse: string[];
  techIds: string;
};

type Action =
  | { type: 'toggleAll'; key: string; value: string[] }
  | { type: 'customers'; value: string }
  | { type: 'zip'; value: string }
  | { type: 'jobType'; value: string }
  | { type: 'jobSubType'; value: number }
  | { type: 'techIds'; value: string }
  | { type: 'propertyUse'; value: string }
  | { type: 'resetFilters'; value: State };

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
        customers,
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
      console.log('what we received to reducer', action.value.toString());
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
    case 'techIds': {
      return {
        ...state,
        techIds: action.value,
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
      return { ...state };
  }
};

type Props = {
  open: boolean;
  toggleDrawer: (show: boolean) => void;
};

const FilterDrawer = ({ open, toggleDrawer }: Props) => {
  const {
    fetchingCalendarData,
    filters,
    initialFilters,
    changeFilters,
    customersMap,
    zipCodesMap,
  } = useCalendarData();
  const [expanded, setExpanded] = useState('');
  const [state, dispatch] = useReducer(reducer, filters);
  const { customers, zip, jobType, jobSubType, propertyUse, techIds } = state;

  const [, wHeight] = useWindowSize();
  const maxListHeight = wHeight - 64 * 4 - 46 - 46 - 32;
  const toggleExpanded = useCallback(
    key => {
      if (key === expanded) {
        setExpanded('');
      } else {
        setExpanded(key);
      }
    },
    [expanded],
  );

  const handleSave = () => {
    changeFilters(state);
    window.localStorage.setItem(
      'SERVICE_CALENDAR_FILTER',
      JSON.stringify(state),
    );
    toggleDrawer(false);
  };
  const handleClear = () => {
    const temp = {
      customers: [],
      jobType: '0',
      jobSubType: 0,
      zip: [],
      propertyUse: [],
      techIds: '0',
    };
    dispatch({ type: 'resetFilters', value: temp });
    changeFilters(temp);
  };

  const handleReset = () => {
    dispatch({ type: 'resetFilters', value: initialFilters });
  };

  return (
    <Drawer anchor="right" open={open} onClose={() => toggleDrawer(!open)}>
      <Box className="ServiceCalendarFilterDrawer">
        <Box className="ServiceCalendarFilterDrawerPanels">
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
              maxListHeight={maxListHeight}
              handleChange={value => dispatch({ type: 'customers', value })}
              handleToggleAll={value =>
                dispatch({
                  type: 'toggleAll',
                  key: 'customers',
                  value: value ? Object.keys(customersMap || {}) : [],
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
              maxListHeight={maxListHeight}
              handleChange={value => dispatch({ type: 'zip', value })}
              handleToggleAll={value =>
                dispatch({
                  type: 'toggleAll',
                  key: 'zip',
                  value: value ? Object.keys(zipCodesMap || {}) : [],
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
              handleChange={value => dispatch({ type: 'propertyUse', value })}
              noSearch
            />
          </FilterPanel>
          <FilterPanel
            title="Job Type & Subtype"
            expanded={expanded === 'jobType'}
            handleChange={() => toggleExpanded('jobType')}
          >
            {
              <JobTypePickerMulti
                key="JobTypeMultiPicker"
                selected={jobType}
                onSelect={value =>
                  dispatch({ type: 'jobType', value: String(value) })
                }
              />
            }

            <JobSubtypePicker
              key="jobTypeSubtypePicker"
              selected={jobSubType}
              onSelect={value => dispatch({ type: 'jobSubType', value })}
            />
          </FilterPanel>
          <FilterPanel
            title="Technician Assigned"
            expanded={expanded === 'techAssigned'}
            handleChange={() => toggleExpanded('techAssigned')}
            selectedCount={
              compact((techIds || '0').split(','))
                .map(Number)
                .filter(e => e !== 0).length
            }
          >
            <Field
              name="techIds"
              value={techIds || '0'}
              type="technicians"
              onChange={value =>
                dispatch({ type: 'techIds', value: String(value) })
              }
              label=" "
            />
          </FilterPanel>
        </Box>
        <div className="ServiceCalendarFilterDrawerButtons">
          <Button
            label="Reset"
            className="ServiceCalendarFilterDrawerButton"
            onClick={handleReset}
            color="secondary"
            fullWidth
          />
          <Button
            label="Save"
            className="ServiceCalendarFilterDrawerButton"
            onClick={handleSave}
            fullWidth
          />
          <Button
            label="Clear"
            className="ServiceCalendarFilterDrawerButton"
            onClick={handleClear}
            fullWidth
          />
        </div>
      </Box>
    </Drawer>
  );
};

export default FilterDrawer;
