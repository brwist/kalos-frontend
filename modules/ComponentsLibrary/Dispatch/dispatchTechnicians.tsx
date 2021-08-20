import { DispatchableTech } from '@kalos-core/kalos-rpc/Dispatch';
import React, { FC, useEffect, useState, useCallback } from 'react';
import { InfoTable } from '../InfoTable';
import { DragDropContext } from 'react-beautiful-dnd';

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
      <DragDropContext onDragEnd = {() => {

      }}
        >

        <InfoTable
          columns={[
            { name: 'Name' },
            { name: 'Status' },
            { name: 'Location' },
            // { name: 'Time On Status' },
            // { name: 'Hours Worked' },
          ]}
          data={
            props.techs
            ? props.techs.map(tech => {
              return [
                {
                  value: tech.getTechname(),
                },
                {
                  value: tech.getActivity() != "Standby" ? ( 
                    <a
                    target='_blank' 
                    href={`/index.cfm?action=admin:service.editServiceCall&id=${tech.getEventId()}&user_id=${tech.getPropertyUserId()}&property_id=${tech.getPropertyId()}`} rel="noreferrer">
                      {tech.getActivity()}
                    </a> ) : (
                      tech.getActivity()
                      )
                },
                {
                  value: tech.getPropertyCity() === '0' ? 'Not Known' : tech.getPropertyCity()
                },
                // {
                  //   value: `${hours}:${minutes}`
                // },
                // {
                  //   value: `${tech.getHoursWorked().h}:${tech.getHoursWorked().m}`
                // },
              ];
            })
            : []
          }
        />
      </DragDropContext>
    </div>
  )
}