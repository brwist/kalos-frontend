import { DispatchableTech } from '@kalos-core/kalos-rpc/Dispatch';
import React, { FC, useEffect } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import { differenceInMinutes } from 'date-fns/esm';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';


interface props {
  userID: number;
  techs: DispatchableTech[];
  dismissedTechs: DispatchableTech[];
  handleMapRecenter: (center: {lat: number, lng: number}, zoom: number) => void;
}

export const DispatchTechs: FC<props> = props => {
  useEffect(() => {
  }, [props.dismissedTechs, props.techs]);

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow key="TechHeader" style={{fontWeight: "bold"}}>
              <TableCell align="center" style={{fontWeight: "bolder", fontSize: "16px"}}>Name</TableCell>
              <TableCell align="center" style={{fontWeight: "bolder", fontSize: "16px"}}>Status</TableCell>
              <TableCell align="center" style={{fontWeight: "bolder", fontSize: "16px"}}>Location</TableCell>
              <TableCell align="center" style={{fontWeight: "bolder", fontSize: "16px"}}>Time On Status</TableCell>
              <TableCell align="center" style={{fontWeight: "bolder", fontSize: "16px"}}>Hours Worked</TableCell>
            </TableRow>
          </TableHead>
          <Droppable droppableId="TechDroppable" isDropDisabled={true}>
            {(provided, snapshop) => (
              <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                {props.techs &&
                  props.techs.map((tech, index) => {
                    const timeOnHours = Math.floor(differenceInMinutes(new Date(), new Date(tech.getActivityDate())) / 60);
                    const timeOnMinutes = differenceInMinutes(new Date(), new Date(tech.getActivityDate())) - timeOnHours * 60;
                    const hoursWorked = Math.floor(tech.getHoursWorked() / 3600);
                    const minutesWorked = Math.floor((tech.getHoursWorked() - hoursWorked * 3600) / 60);
                    const techLatitude = tech.getGeolocationLat() ? tech.getGeolocationLat() : 0;
                    const techLongitude = tech.getGeolocationLng() ? tech.getGeolocationLng() : 0;
                    return (
                      <Draggable
                        key={tech.getUserId.toString() + tech.getActivityDate()}
                        draggableId={tech.getUserId().toString()}
                        index={index}
                      >
                        {(dragProvided, snapshot) => (
                          <TableRow
                            key={`tech_id_${tech.getUserId}`}
                            hover={true}
                            onClick={() => props.handleMapRecenter({lat: techLatitude, lng: techLongitude}, 12)}
                            ref={dragProvided.innerRef}
                            style={{backgroundColor: snapshot.draggingOver ? 'blue' : 'white'}}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                          >
                            <TableCell align="center">{tech.getTechname()}</TableCell>
                            <TableCell align="center">
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
                            <TableCell align="center">
                              {tech.getPropertyCity() === '0'
                                ? 'Not Known'
                                : tech.getPropertyCity()}
                            </TableCell>
                            <TableCell align="center">{timeOnHours >= 10 ? String(timeOnHours) : `0${timeOnHours}`}:{timeOnMinutes >= 10 ? String(timeOnMinutes) : `0${timeOnMinutes}`}</TableCell>
                            <TableCell align="center">{hoursWorked >= 10 ? String(hoursWorked) : `0${hoursWorked}`}:{minutesWorked >= 10 ? String(minutesWorked) : `0${minutesWorked}`}</TableCell>
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
      </TableContainer>

      <TableContainer style={{paddingTop:'20px'}}>
        <Droppable droppableId="dismissTech">
          {(provided, snapshot) => {
            return (
              <Table
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{width:'90%', margin:'auto'}} size={'small'}
              >
                <TableHead></TableHead>
                <TableBody>
                  <TableRow
                    style={{
                      backgroundColor: snapshot.isDraggingOver ? '#711313' : 'white',
                      border: 1,
                      borderWidth: "3px",
                      borderColor: "#711313",
                      borderStyle: "solid"
                    }}     
                  >
                    <TableCell style={{color: snapshot.isDraggingOver ? 'white' : '#711313', margin:'auto', fontSize:'16px', fontWeight:'bold', textAlign:'right', width:'60%'}}>
                      {`Dismiss Technician`}
                    </TableCell>
                    <TableCell style={{color: snapshot.isDraggingOver ? 'white' : '#711313', alignItems:'left'}}>
                      <DeleteOutlineIcon
                        style={{fontSize:'40'}}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
                <TableBody style={{ display: 'none' }}>{provided.placeholder}</TableBody>
              </Table>
            )
          }}
        </Droppable>
      </TableContainer>
    </div>
  );
};
