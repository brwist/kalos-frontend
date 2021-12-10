/* 

  Description: create spiffs

  Design Specification / Document: None Specified
  
*/

import React, { useReducer, useEffect, useCallback, FC } from 'react';
import { reducer, ACTIONS } from './reducer';
import { Devlog } from '@kalos-core/kalos-rpc/Devlog';
import {
  DevlogClientService,
  escapeText,
  TaskClientService,
  timestamp,
  EventClientService,
  makeSafeFormObject,
} from '../../../helpers';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { format } from 'date-fns';
import { SpiffType, TaskEventData, Task } from '@kalos-core/kalos-rpc/Task';
import { Modal } from '../Modal';
import { Option } from '../../ComponentsLibrary/Field';

// add any prop types here
interface props {
  loggedUserId: number;
  onClose: () => void;
}

export const SpiffApplyComponent: FC<props> = ({ loggedUserId, onClose }) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoaded: false,
    error: undefined,
    spiffTypes: [],
    saving: false,
  });
  const SPIFF_TYPES_OPTIONS: Option[] = state.spiffTypes.map(type => ({
    label: escapeText(type.getType()),
    value: type.getId(),
  }));
  const SCHEMA: Schema<Task> = [
    [
      {
        name: 'getExternalId',
        label: 'Technician',
        type: 'technician',
        disabled: true,
      },
      {
        name: 'getTimeDue',
        label: 'Claim Date',
        readOnly: true,
        type: 'date',
      },
      {
        name: 'getSpiffAmount',
        label: 'Amount',
        startAdornment: '$',
        type: 'number',
        required: true,
      },
      {
        name: 'getSpiffJobNumber',
        label: 'Job #',
        type: 'eventId',
        required: true,
      },
      {
        name: 'getDatePerformed',
        label: 'Date Performed',
        type: 'date',
        required: true,
      },
    ],
    [
      {
        name: 'getSpiffTypeId',
        label: 'Spiff Type',
        options: SPIFF_TYPES_OPTIONS,
        required: true,
      },
      {
        name: 'getBriefDescription',
        label: 'Description',
        multiline: true,
      },
    ],
    [
      { name: 'getReferenceNumber', label: 'Reference #' },
      {
        name: 'getBriefDescription',
        label: 'Tool Description',
        multiline: true,
      },
    ],
  ];
  const makeNewTask = useCallback(() => {
    const newTask = new Task();
    newTask.setTimeDue(timestamp());

    newTask.setDatePerformed(timestamp());
    if (SPIFF_TYPES_OPTIONS.length > 0) {
      newTask.setSpiffTypeId(+SPIFF_TYPES_OPTIONS[0].value);
    }
    newTask.setExternalId(loggedUserId);
    return newTask;
  }, [SPIFF_TYPES_OPTIONS, loggedUserId]);

  const load = useCallback(async () => {
    const spiffTypes = (
      await TaskClientService.GetSpiffTypes()
    ).getResultsList();
    dispatch({ type: ACTIONS.SET_SPIFF_TYPES, data: spiffTypes });
    dispatch({ type: ACTIONS.SET_LOADED, data: true });
  }, []);

  const cleanup = useCallback(() => {
    // TODO clean up your function calls here (called once the component is unmounted, prevents "Can't perform a React state update on an unmounted component" errors)
    // This is important for long-term performance of our components
  }, []);

  const handleError = useCallback(
    async (errorToSet: string) => {
      // This will send out an error devlog automatically when called
      // The idea is that this will be used for any errors which we should be able to look up for debugging

      try {
        let errorLog = new Devlog();
        errorLog.setUserId(loggedUserId);
        errorLog.setTimestamp(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
        errorLog.setIsError(1);
        errorLog.setDescription(
          `An error occurred in SpiffApplyComponent: ${errorToSet}`,
        );
        await DevlogClientService.Create(errorLog);
        dispatch({ type: ACTIONS.SET_ERROR, data: errorToSet });
      } catch (err) {
        console.error(`An error occurred while saving a devlog: ${err}`);
      }
    },
    [loggedUserId],
  );

  useEffect(() => {
    if (!state.isLoaded) load();

    return () => {
      cleanup();
    };
  }, [load, cleanup, state.isLoaded]);
  const handleSaveNewSpiff = useCallback(
    async (data: Task) => {
      dispatch({ type: ACTIONS.SET_SAVING, data: true });
      const now = timestamp();
      const req = makeSafeFormObject(data, new Task());
      req.setTimeCreated(now);
      req.setTimeDue(now);
      req.setPriorityId(2);
      req.setSpiffToolId('');

      req.setExternalCode('user');
      req.setCreatorUserId(loggedUserId);
      req.setBillableType('Spiff');
      req.setStatusId(1);
      //req.addFieldMask('AdminActionId');
      let tempEvent;
      try {
        tempEvent = await EventClientService.LoadEventByServiceCallID(
          parseInt(req.getSpiffJobNumber()),
        );
      } catch (err) {
        console.error(
          `An error occurred while loading event by server: ${err}`,
        );
        return;
      }
      if (!tempEvent) {
        console.error(
          `No tempEvent variable was set to set spiff address with, aborting save.`,
        );
        return;
      }
      req.setSpiffAddress(
        tempEvent.getProperty()?.getAddress() === undefined
          ? tempEvent.getCustomer()?.getAddress() === undefined
            ? ''
            : tempEvent.getCustomer()!.getAddress()
          : tempEvent.getProperty()!.getAddress(),
      );

      req.setSpiffJobNumber(tempEvent.getLogJobNumber());
      req.setFieldMaskList([]);
      const res = await TaskClientService.Create(req);
      const id = res.getId();
      const updateReq = new Task();
      updateReq.setId(id);
      updateReq.setFieldMaskList(['AdminActionId']);
      updateReq.setAdminActionId(0);
      await TaskClientService.Update(updateReq);
    },
    [loggedUserId],
  );
  return (
    <Modal open onClose={onClose}>
      <Form<Task>
        title={'Add Spiff Request'}
        schema={SCHEMA}
        onClose={onClose}
        data={makeNewTask()}
        onSave={handleSaveNewSpiff}
        disabled={state.saving}
      />
    </Modal>
  );
};
