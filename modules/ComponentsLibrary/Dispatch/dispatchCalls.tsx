import { DispatchCall } from '@kalos-core/kalos-rpc/Dispatch';
import React, { Dispatch, FC, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableCell from '@material-ui/core/TableCell';
import format from 'date-fns/esm/format';
import setMinutes from 'date-fns/esm/setMinutes';
import setHours from 'date-fns/esm/setHours';
import parseISO from 'date-fns/esm/parseISO';
import { Droppable } from 'react-beautiful-dnd';
import CircularProgress from '@material-ui/core/CircularProgress';
import { InfoTable } from '../InfoTable';
import { makeFakeRows } from '../../../helpers'

interface props {
  userID: number;
  calls: DispatchCall[];
  handleMapRecenter: (
    center: { lat: number; lng: number },
    zoom: number,
    address?: string,
  ) => void;
  handleDblClick: (call : DispatchCall) => void;
  loading: boolean;
  showAssigned?: boolean;
  isFirstCall?: boolean;
  startingIndex?: number;
}

export const DispatchCalls: FC<props> = props => {
  const {
    userID,
    calls,
    loading,
    showAssigned = true,
    isFirstCall = false,
    startingIndex = 0,
  } = props;

  useEffect(() => {
  }, [calls]);

  return (
    <TableContainer
      style={{maxHeight:isFirstCall && calls.length > 15 ? '1200px': ''}}
    >
      <Table>
        <TableHead></TableHead>
        <TableBody>
          <TableRow>
            {/* Temporarily using hardcoded for variable for Estimated End */}
            {!isFirstCall &&(
              <TableCell
                align="center"
                style={{ fontWeight: 'bolder', fontSize: '16px' }}
                width="100%"
              >
                Service Calls Remaining: {calls.length}
              </TableCell>
            )}
            {/* <TableCell
              align="left"
              style={{ fontWeight: 'bolder', fontSize: '16px' }}
              width="50%"
            >
              Estimated End of Day: {calls.length === 0 ? format(new Date(), 'h:mm a') : `N/A`}
            </TableCell> */}
          </TableRow>
        </TableBody>
      </Table>
      {loading && (
        <InfoTable data={makeFakeRows(7,3)} loading />
      )}
      {!loading && (
      <Table stickyHeader>
        <TableHead key="Header">
          <TableRow>
            <TableCell
              align="center"
              style={{ fontWeight: 'bolder', fontSize: '16px', width: '8%' }}
            >
              Map Id
            </TableCell>
            <TableCell
              align="center"
              style={{ fontWeight: 'bolder', fontSize: '16px', width: '13%' }}
            >
              Date/Time
            </TableCell>
            <TableCell
              align="center"
              style={{ fontWeight: 'bolder', fontSize: '16px', width: '14%' }}
            >
              City
            </TableCell>
            <TableCell
              align="center"
              style={{ fontWeight: 'bolder', fontSize: '16px', width: '15%' }}
            >
              Customer
            </TableCell>
            <TableCell
              align="center"
              style={{ fontWeight: 'bolder', fontSize: '16px', width: '30%' }}
            >
              Description
            </TableCell>
            <TableCell
              align="center"
              style={{ fontWeight: 'bolder', fontSize: '16px', width: '10%' }}
            >
              JobType/Subtype
            </TableCell>
            {showAssigned && (
              <TableCell
                align="center"
                style={{ fontWeight: 'bolder', fontSize: '16px', width: '10%' }}
              >
                Assigned
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        {calls.length === 0 && (
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} style={{textAlign: 'center', width: '15%'}}>
                No Entries Found!
              </TableCell>
            </TableRow>
          </TableBody>
        )}
        {calls.length > 0 && calls.map((call, index) => {
          const dateStarted = format(parseISO(`${call.getDateStarted()} 00:00:00`), 'M/d/yyyy');
          const timeStartArray = call.getTimeStarted().split(':');
          let startHour: number = Number(timeStartArray[0]),
            startMin: number = Number(timeStartArray[1]);
          const timeEndedArray = call.getTimeEnded().split(':');
          let endHour: number = Number(timeEndedArray[0]),
            endMin = Number(timeEndedArray[1]);
          let timeStarted = setMinutes(
            setHours(new Date(), startHour),
            startMin
          );
          let timeEnded = setMinutes(setHours(new Date(), endHour), endMin);
          let center: { lat: number; lng: number } = {
            lat: call.getGeolocationLat(),
            lng: call.getGeolocationLng(),
          };

          return (
            <Droppable
              droppableId={call.getId().toString()}
              key={call.getId() + call.getLogNotes()}
            >
              {(provided, snapshot) => (
                <TableBody
                  key={
                    call.getId() +
                    call.getLogNotes() +
                    call.getLogTechnicianAssigned()
                  }
                  ref={provided.innerRef}
                  style={{
                    backgroundColor: snapshot.isDraggingOver ? 'gray' : 'white',
                  }}
                  {...provided.droppableProps}
                >
                  <TableRow
                    hover={true}
                    onClick={() =>
                      props.handleMapRecenter(
                        center,
                        12,
                        call.getPropertyAddress(),
                      )
                    }
                    onDoubleClick={() => props.handleDblClick(call)}
                  >
                    <TableCell align="center">{index + 1 + startingIndex}</TableCell>
                    <TableCell align="center">
                      {`${dateStarted}`} <br></br> {`${format(timeStarted, 'h:mm aa')} - ${format(timeEnded, 'h:mm aa')}`}
                    </TableCell>
                    <TableCell align="center">
                      {call.getPropertyCity()}
                    </TableCell>
                    <TableCell align="center">{call.getUserBusinessname().length ? call.getUserBusinessname() : call.getCustName()}</TableCell>
                    <TableCell align="center">
                    <a 
                    target="_blank" 
                    rel="noreferrer"
                    href={`/index.cfm?action=admin:service.editServiceCall&id=${call.getId()}&property_id=${call.getPropertyId()}&user_id=${call.getUserId()}`}
                    >
                      {call.getDescription().length >= 200
                        ? call.getDescription().slice(0, 150).concat(' ...')
                        : call.getDescription()}
                    </a>
                    </TableCell>
                    <TableCell align="center">{`${call.getJobType()}/${call.getJobSubtype()}`}</TableCell>
                    {showAssigned && (
                      <TableCell align="center">
                        {call.getLogTechnicianAssigned() != '0' && call.getLogTechnicianAssigned() != ''
                          ? call.getAssigned()
                          : 'Unassigned'}
                      </TableCell>
                    )}
                  </TableRow>
                  {provided.placeholder && false}
                  {/* Come back and Fix Later */}
                </TableBody>
              )}
            </Droppable>
          );
        })}
      </Table>
      )}
    </TableContainer>
  );
};
