/* 

  Design Specification: Property Pane at https://app.kalosflorida.com/index.cfm?action=admin:contracts.contractnew&contract_id=3365

*/

import { Devlog } from '@kalos-core/kalos-rpc/Devlog';
import { Property } from '@kalos-core/kalos-rpc/Property';
import format from 'date-fns/format';
import React, { useReducer, useEffect, useCallback, FC } from 'react';
import { DevlogClientService, PropertyClientService } from '../../../helpers';
import { Form, Schema } from '../Form';
import { reducer, ACTIONS } from './reducer';
import { Loader } from '../../Loader/main';

interface props {
  userId: number;
  onSave: (propertiesSaved: Property[]) => any;
  onClose: (currentProperties?: Property[]) => any;
  onChange?: (currentProperties?: Property[]) => any;
}

type Properties = {
  propertyArray: Property[];
};

export const PropertyDropdown: FC<props> = ({
  userId,
  onSave,
  onClose,
  onChange,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoaded: false,
    propertiesSelected: [],
    propertiesLoaded: [],
    error: false,
  });

  const SCHEMA: Schema<Properties> = [
    [
      {
        label: 'Select Properties',
        type: 'multiselect',
        options: state.propertiesLoaded.map(property => property.getAddress()),
        name: 'propertyArray',
      },
    ],
  ];

  const load = useCallback(async () => {
    try {
      let req = new Property();
      req.setUserId(userId);
      const res = await PropertyClientService.BatchGet(req);
      dispatch({
        type: ACTIONS.SET_PROPERTIES_LOADED,
        data: res.getResultsList(),
      });
    } catch (err) {
      dispatch({ type: ACTIONS.SET_ERROR, data: true });
      console.error(
        `An error occurred while getting properties from the property client service: ${err}`,
      );
      try {
        let devlog = new Devlog();
        devlog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
        devlog.setUserId(userId);
        devlog.setErrorSeverity(0);
        const errRes = await DevlogClientService.Create(devlog);
        console.log(`Successfully created dev log with id: ${errRes.getId()}`);
      } catch (err) {
        console.error(`Failed to create error log: ${err}`);
      }
    }
    dispatch({ type: ACTIONS.SET_LOADED, data: true });
  }, [userId]);

  const cleanup = useCallback(() => {}, []);

  useEffect(() => {
    if (!state.isLoaded) load();

    return () => {
      cleanup();
    };
  }, [load, cleanup, state.isLoaded]);

  return (
    <>
      {!state.isLoaded && <Loader />}
      <Form<Properties>
        key={state.isLoaded.toString()}
        error={state.error}
        title={state.error ? `An Error Occurred` : undefined}
        data={{ propertyArray: state.propertiesSelected }}
        schema={SCHEMA}
        onSave={propertiesSaved => onSave(propertiesSaved.propertyArray)}
        onClose={() => onClose(state.propertiesSelected)}
        onChange={currentProperties => {
          if (onChange) onChange(currentProperties.propertyArray);
          dispatch({
            type: ACTIONS.SET_PROPERTIES_SELECTED,
            data: currentProperties.propertyArray,
          });
        }}
      />
    </>
  );
};
