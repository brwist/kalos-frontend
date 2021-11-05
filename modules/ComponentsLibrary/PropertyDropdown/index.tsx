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

interface props {
  userId: number;
  onSave?: (propertiesSaved: Property[]) => any; // For the future in case we need the onSave or onClose
  onClose?: (currentProperties?: Property[]) => any;
  onChange?: (currentProperties?: Property[]) => any;
  initialPropertiesSelected?: Property[];
  loading?: boolean;
}

type Properties = {
  propertyArray: Property[];
};

export const PropertyDropdown: FC<props> = ({
  userId,
  onSave,
  onClose,
  onChange,
  initialPropertiesSelected,
  loading,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoaded: loading ? !loading : false,
    propertiesSelected:
      initialPropertiesSelected !== undefined ? initialPropertiesSelected : [],
    propertiesLoaded:
      initialPropertiesSelected !== undefined ? initialPropertiesSelected : [],
    error: false,
  });

  const SCHEMA: Schema<Properties> = [
    [
      {
        label: 'Select Properties',
        type: 'multiselect',
        options: state.propertiesLoaded.map(property => property.getAddress()),
        name: 'propertyArray',
        defaultValue: {
          propertyArray: initialPropertiesSelected,
        } as Properties,
      },
    ],
  ];

  const load = useCallback(async () => {
    try {
      let req = new Property();
      req.setUserId(userId);
      req.setIsActive(1);
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
    if (loading !== undefined) {
      if (loading !== true) dispatch({ type: ACTIONS.SET_LOADED, data: true });
    }
  }, [loading, userId]);

  const cleanup = useCallback(() => {}, []);

  useEffect(() => {
    if (!state.isLoaded) load();

    return () => {
      cleanup();
    };
  }, [load, cleanup, state.isLoaded]);

  return (
    <>
      <Form<Properties>
        disabled={!state.isLoaded}
        className="PropertyDropdown"
        key={state.isLoaded.toString()}
        error={state.error}
        title={state.error ? `An Error Occurred` : undefined}
        data={{
          // Passing this as a string instead of a Properties because this allows the data to
          // get checked as it comes in, assuming it was selected (the two strings get compared in <Field /> in the form)
          // @ts-ignore
          propertyArray: state.propertiesSelected.map(property =>
            property.getAddress ? property.getAddress() : property,
          ),
        }}
        schema={SCHEMA}
        onSave={propertiesSaved => {
          if (onSave) onSave(propertiesSaved.propertyArray);
        }}
        onClose={() => {
          if (onClose) onClose(state.propertiesSelected);
        }}
        onChange={(currentProperties: any) => {
          if (onChange)
            onChange(
              state.propertiesLoaded.filter(loaded => {
                for (const prop of currentProperties.propertyArray) {
                  if (loaded.getAddress() === prop)
                    return loaded.getAddress() === prop;
                }
              }),
            );
          dispatch({
            type: ACTIONS.SET_PROPERTIES_SELECTED,
            data: currentProperties.propertyArray,
          });
        }}
      />
    </>
  );
};
