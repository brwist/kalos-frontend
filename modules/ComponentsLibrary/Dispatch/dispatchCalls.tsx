import { DispatchCall } from "@kalos-core/kalos-rpc/Dispatch";
import React, { FC, useEffect, useState, useCallback } from 'react';
import { InfoTable } from '../InfoTable';
import { format, setMinutes, setHours } from 'date-fns';
import { Droppable } from "react-beautiful-dnd";

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
                value: (
                  <Droppable droppableId={call.getId().toString()}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                      {i+1}
                      {provided.placeholder}
                      </div> 
                    )}
                  </Droppable>
                )
              },
              {
                value: (
                  <Droppable droppableId={call.getId().toString()}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {`${format(timeStarted, 'h:mm aa')} - ${format(timeEnded, 'h:mm aa')}`}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )
                // `${format(new Date(call.getTimeStarted()), 'h:mm aa')} - ${format(new Date(call.getTimeEnded()), 'h:mm aa')}`
              },
              {
                value: (
                  <Droppable droppableId={call.getId().toString()}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {call.getPropertyCity()}
                        {provided.placeholder}
                      </div>           
                    )}
                  </Droppable>
                )
            
              },
              {
                value: (
                  <Droppable droppableId={call.getId().toString()}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {call.getCustName()}
                        {provided.placeholder}
                      </div>           
                    )}
                  </Droppable>
                )
              },
              {
                value: (
                  <Droppable droppableId={call.getId().toString()}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {call.getDescription().length >= 800 ? call.getDescription().slice(0,100) : call.getDescription()}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )
              },
              {
                value: (
                  <Droppable droppableId={call.getId().toString()}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {`${call.getJobType()} / ${call.getJobSubtype()}`}
                        {provided.placeholder}
                      </div>           
                    )}
                  </Droppable>
                )
              },
              {
                value: (
                  <Droppable droppableId={call.getId().toString()}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {call.getAssigned() != '0' ? call.getAssigned() : 'Unassigned'}
                        {provided.placeholder}
                      </div>           
                    )}
                  </Droppable>
                )
              },
            ];
          })
          : []
        }
      />
    </div>
  )
}