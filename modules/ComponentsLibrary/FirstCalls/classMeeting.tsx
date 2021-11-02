import React, { FC, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { PlainForm, Schema } from '../PlainForm';
import { DispatchableTech } from '@kalos-core/kalos-rpc/Dispatch';
import { FormData } from './reducer';

interface props {
  userID: number;
  techs: DispatchableTech[];
  listTechs: DispatchableTech[];
  schema: Schema<FormData>;
  formData: FormData;
  handleFormDataUpdate:(formData:FormData, timesOnly?:boolean)=>void
}


export const ClassMeeting: FC<props> = props => {
  const {
    userID,
    techs,
    listTechs,
    schema,
    formData,
  } = props

  const [availableTechs, setAvailableTechs] = useState<DispatchableTech[]>([]);
  const [assignedTechs, setAssignedTechs] = useState<DispatchableTech[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const sorted = (techs : DispatchableTech[]) => {
    return techs.sort((a,b) => (a.getTechname() > b.getTechname()) ? 1 : ((b.getTechname() > a.getTechname()) ? -1 : 0));
  }

  useEffect(() => {
    setAvailableTechs(sorted(techs.filter(tech => !listTechs.includes(tech))));
    setAssignedTechs(sorted(listTechs));
  }, []);

  return (
    <>
      <div style={{justifyContent:'center', alignItems:'center', display:'flex'}}>
        <Typography style={{fontWeight:'bold', fontSize:'20px', margin:'0'}}>
          Start Time:
        </Typography>
        <PlainForm
          schema={schema}
          data={formData}
          onChange={async(callback)=> {
            props.handleFormDataUpdate(callback, true);
          }}
        />
      </div>
      <DragDropContext onDragEnd={async (callback) => {
        if (callback.destination && callback.destination.droppableId !== callback.source.droppableId && !loading) {
          setLoading(true);
            let assignedTechnicians = assignedTechs;
            const movedTech = techs.filter(tech => tech.getUserId().toString() === callback.draggableId);
            if (callback.destination.droppableId === 'assignedTechDropList') {
              assignedTechnicians.push(movedTech[0]);
            } else {
              const index = assignedTechs.findIndex(tech => tech.getUserId().toString() === callback.draggableId);
              assignedTechnicians.splice(index, 1);
            }
            setAssignedTechs(sorted(assignedTechnicians));
            setAvailableTechs(sorted(techs.filter(tech => !assignedTechnicians.includes(tech))));
          setLoading(false);
        }
      }}>
        <Grid container spacing={4} style={{minWidth:window.innerWidth * .5, maxWidth:window.innerWidth * .8}}>
          <Grid item xs={6}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>
                    <Typography style={{fontWeight:'bold', fontSize:'20px'}}>
                      Available Technicians
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <Droppable
                droppableId="unassignedTechDropList"
                type="DispatchableTech"
              >
                {(provided, snapshot) => (
                  <TableBody
                    ref={provided.innerRef}
                    style={{
                      border:'2px',
                      borderStyle:'solid',
                      width:'100%',
                      maxHeight:window.innerHeight * .65,
                      overflowY:'scroll',
                      backgroundColor: snapshot.isDraggingOver ? 'gray' : 'white',
                      display:'inline-block',
                    }}
                    {...provided.droppableProps}
                  >
                    {!availableTechs.length && (
                      <TableRow
                        style={{
                          display:'inline-table', 
                          width:'100%'
                        }}
                      >
                        <TableCell align="center">
                          No Techs Available!
                        </TableCell>
                      </TableRow>
                    )}
                    {availableTechs.length > 0 && availableTechs.map((tech, index) => {
                      return (
                      <Draggable
                        key={`${tech.getUserId()}`}
                        draggableId={`${tech.getUserId()}`}
                        index={index}
                      >
                        {(provided,snapshot) => (
                          <TableRow
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            key={`${tech.getUserId()}_${index}`}
                            ref={provided.innerRef}
                            style={{
                              width:'100%', 
                              display:'table',
                              backgroundColor: snapshot.isDragging ? 'gray' : 'white',
                              ...provided.draggableProps.style,
                            }}
                            hover
                          >
                            <TableCell 
                              align="center"
                            >
                              {tech.getTechname()}
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    )})}
                    {provided.placeholder}
                  </TableBody>
                )}
              </Droppable>
            </Table>
          </Grid>
          <Grid item xs={6}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>
                    <Typography style={{fontWeight:'bold', fontSize:'20px'}}>
                      Assigned Technicians
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <Droppable
                droppableId="assignedTechDropList"
                type="DispatchableTech"
              >
                {(provided, snapshot) => (
                  <TableBody
                    ref={provided.innerRef}
                    style={{
                      border:'2px',
                      borderStyle:'solid',
                      backgroundColor: snapshot.isDraggingOver ? 'gray' : 'white',
                      width:'100%',
                      maxHeight:window.innerHeight * .65,
                      overflow:'auto',
                      display:'inline-block',
                      justifyContent:'center',
                      alignItems:'center'
                    }}
                    {...provided.droppableProps}
                  >
                    {!assignedTechs.length && (
                      <TableRow
                        style={{
                          display:'inline-table', 
                          width:'100%', 
                        }}
                      >
                        <TableCell align="center">
                          No Techs Assigned!
                        </TableCell>
                      </TableRow>
                    )}
                    {assignedTechs.length > 0 && assignedTechs.map((tech, index) => {
                      return (
                      <Draggable
                        key={`${tech.getUserId()}`}
                        draggableId={`${tech.getUserId()}`}
                        index={index}
                      >
                        {(provided,snapshot) => (
                          <TableRow
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            key={`${tech.getUserId()}_${index}`}
                            ref={provided.innerRef}
                            style={{
                              width:'100%',
                              display:'inline-table', 
                              ...provided.draggableProps.style,
                            }}
                            hover
                          >
                            <TableCell align="center" >
                              {tech.getTechname()}
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    )})}
                    {provided.placeholder}
                  </TableBody>
                )}
              </Droppable>
            </Table>
          </Grid>
        </Grid>
      </DragDropContext>
    </>
  )
}