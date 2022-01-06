import { DispatchableTech } from '@kalos-core/kalos-rpc/Dispatch';
import React, { FC, useEffect, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import differenceInMinutes from 'date-fns/esm/differenceInMinutes';
import parseISO from 'date-fns/esm/parseISO';
import format from 'date-fns/esm/format';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { InfoTable } from '../InfoTable';
import { makeFakeRows } from '../../../helpers';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import addMinutes from 'date-fns/esm/addMinutes';

interface props {
  userID: number;
  techs: DispatchableTech[];
  dismissedTechs: DispatchableTech[];
  offTechs?: {tech: DispatchableTech, start: string, end: string}[];
  handleMapRecenter?: (center: {lat: number, lng: number}, zoom: number) => void;
  loading: boolean;
  isFirstCall?: boolean;
}

export const DispatchTechs: FC<props> = props => {
  const {
    techs,
    loading,
    isFirstCall=false,
  } = props

  const sortTechs = (techs : DispatchableTech[]) => {
    const sorted = techs.sort((a,b) => (a.getTechname() > b.getTechname()) ? 1 : ((b.getTechname() > a.getTechname()) ? -1 : 0));
    setSortedTechnicians(sorted);
  }

  const [sortedTechnicians, setSortedTechnicians] = useState<DispatchableTech[]>([]);

  useEffect(() => {
    // console.log("DispatchTechs");
    sortTechs(techs);
  }, [props.dismissedTechs, techs, loading]);

  return (
    <div>
      {loading && (
        <InfoTable data={makeFakeRows(5,3)} loading />
      )}
      {!loading && (
      <TableContainer
        style={{maxHeight:isFirstCall && techs.length > 15 ? '900px': ''}}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow key="TechHeader" style={{fontWeight: "bold"}}>
              <TableCell align="center" style={{fontWeight: "bolder", fontSize: "16px"}}>Name</TableCell>
              <TableCell align="center" style={{fontWeight: "bolder", fontSize: "16px", display:isFirstCall?'none':''}}>Status</TableCell>
              <TableCell align="center" style={{fontWeight: "bolder", fontSize: "16px", display:isFirstCall?'none':''}}>Location</TableCell>
              <TableCell align="center" style={{fontWeight: "bolder", fontSize: "16px", display:isFirstCall?'none':''}}>Time On Status</TableCell>
              <TableCell align="center" style={{fontWeight: "bolder", fontSize: "16px"}}>Hours Worked</TableCell>
            </TableRow>
          </TableHead>
          <Droppable droppableId="techDroppable" isDropDisabled>
            {provided => (
              <TableBody
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {!techs.length && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No Entries Found!</TableCell>
                  </TableRow>
                )}
                {techs.length > 0 &&
                  sortedTechnicians.map((tech, index) => {
                    const timeOnHours = Math.floor(differenceInMinutes(new Date(), parseISO(tech.getActivityDate())) / 60);
                    const timeOnMinutes = differenceInMinutes(new Date(), parseISO(tech.getActivityDate())) - timeOnHours * 60;
                    const hoursWorked = Math.floor(tech.getHoursWorked() / 3600);
                    const minutesWorked = Math.floor((tech.getHoursWorked() - hoursWorked * 3600) / 60);
                    const techLatitude = tech.getGeolocationLat() ? tech.getGeolocationLat() : 0;
                    const techLongitude = tech.getGeolocationLng() ? tech.getGeolocationLng() : 0;
                    let timeoffData : {tech: DispatchableTech, start: string, end: string};
                    if (props.offTechs && props.offTechs.length) {
                      timeoffData = props.offTechs.find(req => req.tech.getUserId() === tech.getUserId())!;
                    }
                    return (
                      <Draggable
                        key={`${tech.getUserId()}`}
                        draggableId={`${tech.getUserId()}`}
                        index={index}
                      >
                        {(dragProvided, snapshot) => (
                          <TableRow
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            key={`tech_id_${tech.getUserId}`}
                            ref={dragProvided.innerRef}
                            style={{
                              backgroundColor: snapshot.draggingOver === 'dismissTech' || snapshot.draggingOver === 'onCallDroppable' ? '#711313' :  snapshot.draggingOver ? 'grey' : snapshot.isDragging ? 'beige' : timeoffData && format(addMinutes(new Date(), 30), 'yyyy-MM-dd HH:mm:ss') >= timeoffData.start ? '#ffcccb' : '',
                              width:'100%',
                              height:'auto',
                              margin:'auto',
                              ...dragProvided.draggableProps.style,
                              textAlign:'center',
                            }}
                            hover
                            onClick={props.handleMapRecenter ? () => props.handleMapRecenter!({lat: techLatitude, lng: techLongitude}, 12) : () => {}}
                          >
                            <TableCell align="center" style={{color: snapshot.draggingOver && snapshot.draggingOver !== "techDroppable" ? 'white' : 'black'}}>
                              {timeoffData && (
                                <Tooltip title={<h2 style={{}}>{`Time Off: ${format(parseISO(timeoffData.start), 'h:mm aaa')} - ${format(parseISO(timeoffData.end), 'h:mm aaa')}`}</h2>} placement={"top"}>
                                  <IconButton>
                                    <ErrorOutline/>
                                  </IconButton>
                                </Tooltip>
                              )}
                              {tech.getTechname()}
                            </TableCell>
                            <TableCell align="center" style={{display:isFirstCall?'none':'', color: snapshot.draggingOver && snapshot.draggingOver !== "techDroppable" ? 'white' : 'black'}}>
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
                            <TableCell align="center" style={{display:isFirstCall?'none':'', color: snapshot.draggingOver && snapshot.draggingOver !== "techDroppable" ? 'white' : 'black'}}>
                              {tech.getPropertyCity() === '0'
                                ? 'Not Known'
                                : tech.getPropertyCity()}
                            </TableCell>
                            <TableCell align="center" style={{display:isFirstCall?'none':'', color: snapshot.draggingOver && snapshot.draggingOver !== "techDroppable" ? 'white' : 'black'}}>{timeOnHours >= 10 ? String(timeOnHours) : `0${timeOnHours}`}:{timeOnMinutes >= 10 ? String(timeOnMinutes) : `0${timeOnMinutes}`}</TableCell>
                            <TableCell align="center" style={{color: snapshot.draggingOver && snapshot.draggingOver !== "techDroppable" ? 'white' : 'black'}}>{hoursWorked >= 10 ? String(hoursWorked) : `0${hoursWorked}`}:{minutesWorked >= 10 ? String(minutesWorked) : `0${minutesWorked}`}</TableCell>
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
      )}

      <TableContainer style={{paddingTop:'20px'}}>
        <Droppable
          droppableId="dismissTech" 
          // type="DispatchableTech"
        >
          {(provided, snapshot) => {
            return (
              <Table
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  width:'100%',
                  margin:'auto'
                }}
                size={'small'}
              >
                <TableHead></TableHead>
                <TableBody>
                  <TableRow
                    style={{
                      backgroundColor: snapshot.isDraggingOver ? '#711313' : 'white',
                      border: 1,
                      borderWidth: "3px",
                      borderColor: "#711313",
                      borderStyle: "solid",
                      height:'20px',
                    }}     
                  >
                    <TableCell style={{color: snapshot.isDraggingOver ? 'white' : '#711313', margin:'auto', fontSize:'16px', fontWeight:'bold', textAlign:!props.isFirstCall?'right':'center', width:'60%'}}>
                      {!props.isFirstCall?`Dismiss Technician`:'Set Technician As Off Tomorrow'}
                    </TableCell>
                    <TableCell style={{color: snapshot.isDraggingOver ? 'white' : '#711313', alignItems:'left', display:props.isFirstCall?'none':''}}>
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
