import { DispatchCall } from "@kalos-core/kalos-rpc/Dispatch";
import React, { FC, useEffect, useState, useCallback } from 'react';
import { InfoTable } from '../InfoTable';
import { format, setMinutes, setHours } from 'date-fns';

interface props {
  userID : number;
  calls : DispatchCall[];
}

export const DispatchCalls: FC<props> = props => {

  useEffect( () => {
    console.log(props.calls);
  }, [props.calls])

  return (
    <div>
      <InfoTable
        columns={[
          { name: 'Map ID' },
          { name: 'Window' },
          { name: 'Location' },
          { name: 'Customer' },
          { name: 'Description' },
          { name: 'Type/Subtype' },
          { name: 'Assigned' },
        ]}
        data={
          props.calls
          ? props.calls.map((call, i) => {
            const timeStartArray = call.getTimeStarted().split(':');
            let startHour : number = Number(timeStartArray[0]), startMin : number = Number(timeStartArray[1]);
            const timeEndedArray = call.getTimeEnded().split(':');
            let endHour : number = Number(timeEndedArray[0]), endMin = Number(timeEndedArray[1]);
            let timeStarted = setMinutes(setHours(new Date(), startHour), startMin);
            let timeEnded = setMinutes(setHours(new Date(), endHour), endMin);
            return [
              {
                value: i+1
              },
              {
                value: `${format(timeStarted, 'h:mm aa')} - ${format(timeEnded, 'h:mm aa')}`
                // `${format(new Date(call.getTimeStarted()), 'h:mm aa')} - ${format(new Date(call.getTimeEnded()), 'h:mm aa')}`
              },
              {
                value: call.getPropertyCity()
              },
              {
                value: call.getCustName()
              },
              {
                value: call.getDescription().length >= 800 ? call.getDescription().slice(0,100) : call.getDescription()
              },
              {
                value: `${call.getJobType()} / ${call.getJobSubtype()}`
              },
              {
                value: call.getAssigned() != '0' ? call.getAssigned() : 'Unassigned'
              },
            ];
          })
          : []
        }
      />
    </div>
  )
}