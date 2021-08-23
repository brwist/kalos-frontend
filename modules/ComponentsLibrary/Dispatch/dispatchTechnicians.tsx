import { DispatchableTech } from '@kalos-core/kalos-rpc/Dispatch';
import React, { FC, useEffect, useState, useCallback } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import { TableCell } from '@material-ui/core';

interface props {
  userID : number;
  techs : DispatchableTech[];
}

export const DispatchTechs: FC<props> = props => {

  useEffect( () => {
    console.log(props.techs);
  }, [props.techs])

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Time On Status</TableCell>
              <TableCell>Hours Worked</TableCell>
            </TableRow>
          </TableHead>
          <Droppable droppableId="TechDroppable" isDropDisabled={true}>
            {(provided, snapshop) => (
              <TableBody
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {props.techs &&
                props.techs.map((tech,index) => {
                  console.log("maybe here");
                  return (
                  <Draggable
                    key={tech.getUserId.toString()}
                    draggableId={tech.getUserId().toString()}
                    index={index}
                  >
                    {(dragProvided, snapshot) => (
                      <TableRow
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        key={`${tech.getUserId}_techs`}
                      >
                        {console.log("here")}
                        <TableCell>{tech.getTechname()}</TableCell>
                        <TableCell>{tech.getActivity() != "Standby" ? ( 
                              <a
                              target='_blank' 
                              href={`/index.cfm?action=admin:service.editServiceCall&id=${tech.getEventId()}&user_id=${tech.getPropertyUserId()}&property_id=${tech.getPropertyId()}`} rel="noreferrer">
                                {tech.getActivity()}
                              </a> ) : (
                                tech.getActivity()
                            )}</TableCell>
                        <TableCell>{tech.getPropertyCity() === '0' ? 'Not Known' : tech.getPropertyCity()}</TableCell>
                        <TableCell>{"15.50"}</TableCell>
                        <TableCell>{"40.40"}</TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                )})
              }
              {provided.placeholder}
              </TableBody>
            )}
          </Droppable>
        </Table>
      </TableContainer>
      
      <div>
        <Droppable droppableId="dismissTech">
          {(provided, snapshot) => {
            return (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {"This is a Stupid Test"}
                {provided.placeholder}
              </div>
            )
          }}
        </Droppable>
      </div>
    </div>
  )
}