import { DispatchCall } from '@kalos-core/kalos-rpc/Dispatch';
import React, { FC, useEffect, useState, useCallback } from 'react';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';

import TableCell from '@material-ui/core/TableCell';
import { format, setMinutes, setHours } from 'date-fns';
import { Droppable } from 'react-beautiful-dnd';

interface props {
  userID: number;
  calls: DispatchCall[];
}

export const DispatchCalls: FC<props> = props => {
  useEffect(() => {
    console.log(props.calls);
  }, [props.calls]);

  return (
    <Table>
      <TableBody>
        <TableRow key="Header">
          <TableCell>Map Id</TableCell>
          <TableCell>Window</TableCell>
          <TableCell>Location</TableCell>
          <TableCell>Customer</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Type/Subtype</TableCell>
          <TableCell>Assigned</TableCell>
        </TableRow>
        {props.calls.map((call, index) => {
          const timeStartArray = call.getTimeStarted().split(':');
          let startHour: number = Number(timeStartArray[0]),
            startMin: number = Number(timeStartArray[1]);
          const timeEndedArray = call.getTimeEnded().split(':');
          let endHour: number = Number(timeEndedArray[0]),
            endMin = Number(timeEndedArray[1]);
          let timeStarted = setMinutes(
            setHours(new Date(), startHour),
            startMin,
          );
          let timeEnded = setMinutes(setHours(new Date(), endHour), endMin);
          return (
            <Droppable
              droppableId={call.getId().toString()}
              key={call.getId() + call.getLogNotes()}
            >
              {(provided, snapshot) => (
                <TableRow
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  key={
                    call.getId() +
                    call.getLogNotes() +
                    call.getLogTechnicianAssigned() +
                    'Call'
                  }
                >
                  <TableCell>{index}</TableCell>
                  <TableCell>{`${format(timeStarted, 'h:mm aa')} - ${format(
                    timeEnded,
                    'h:mm aa',
                  )}`}</TableCell>
                  <TableCell>{call.getPropertyCity()}</TableCell>
                  <TableCell>{call.getCustName()}</TableCell>
                  <TableCell>{call.getDescription()}</TableCell>
                  <TableCell>{`${call.getJobType()}/${call.getJobSubtype()}`}</TableCell>
                  <TableCell>{call.getAssigned()}</TableCell>
                  {provided.placeholder}
                </TableRow>
              )}
            </Droppable>
          );
        })}
      </TableBody>
    </Table>
  );
};
