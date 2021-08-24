import { DispatchableTech } from '@kalos-core/kalos-rpc/Dispatch';
import React, { FC, useEffect, useState, useCallback } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';

interface props {
  userID: number;
  techs: DispatchableTech[];
}

export const DispatchTechs: FC<props> = props => {
  useEffect(() => {
    console.log(props.techs);
  }, [props.techs]);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow key="TechHeader">
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Time On Status</TableCell>
            <TableCell>Hours Worked</TableCell>
          </TableRow>
        </TableHead>
        <Droppable droppableId="TechDroppable" isDropDisabled={true}>
          {(provided, snapshop) => (
            <TableBody ref={provided.innerRef} {...provided.droppableProps}>
              {props.techs &&
                props.techs.map((tech, index) => {
                  return (
                    <Draggable
                      key={tech.getUserId.toString() + tech.getActivityDate()}
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
                          <TableCell>{tech.getTechname()}</TableCell>
                          <TableCell>
                            {tech.getActivity() != 'Standby' ? (
                              <a
                                target="_blank"
                                href={`/index.cfm?action=admin:service.editServiceCall&id=${tech.getEventId()}&user_id=${tech.getPropertyUserId()}&property_id=${tech.getPropertyId()}`}
                                rel="noreferrer"
                              >
                                {tech.getActivity()}
                              </a>
                            ) : (
                              tech.getActivity()
                            )}
                          </TableCell>
                          <TableCell>
                            {tech.getPropertyCity() === '0'
                              ? 'Not Known'
                              : tech.getPropertyCity()}
                          </TableCell>
                          <TableCell>{'15.50'}</TableCell>
                          <TableCell>{'40.40'}</TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  );
                })}
              {provided.placeholder}
            </TableBody>
          )}
        </Droppable>
      </Table>
      <Table>
        <Droppable droppableId="dismissTech">
          {(provided, snapshot) => {
            return (
              <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                <TableRow>
                  <TableCell>This is a Stupid Test</TableCell>
                </TableRow>
                {provided.placeholder}
              </TableBody>
            );
          }}
        </Droppable>
      </Table>
    </TableContainer>
  );
};
