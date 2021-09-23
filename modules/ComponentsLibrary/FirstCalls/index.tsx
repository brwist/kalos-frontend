import React, { useReducer, useCallback, useEffect } from 'react';
import { PageWrapper } from '../../PageWrapper/main';
import { SectionBar } from '../SectionBar';
import Grid from '@material-ui/core/Grid';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { DispatchTechs } from '../Dispatch/dispatchTechnicians';
import { TextField } from '@material-ui/core';
import { DismissedTechs } from '../Dispatch/dismissedTechnicians';

export interface Props {
  loggedUserId: number;
  testUserId?: number;
  disableSlack?: boolean;
}

export const FirstCallDashboard: React.FC<Props> = function FirstCallDashboard({
  loggedUserId,
  testUserId=0,
  disableSlack=false,
})
{
  return (
    <PageWrapper userID={loggedUserId}>
      <SectionBar title="First Calls" styles={{backgroundColor: "#711313", color: "white"}} />
      <Grid container spacing={3} style={{paddingTop:'20px'}}>
        <DragDropContext onDragEnd={async (callback) => {
        }}>
          {/* <Grid item xs={12}> */}
            <Grid item xs={6}>
              <Droppable droppableId="onCallDroppable">
                {(provided, snapshot) => {
                  return (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps} 
                      style={{borderStyle:'solid', textAlign:'center', width:'90%', height:'40px', margin:'auto', fontWeight:'bold', fontSize:'20px', display:'flex'}}
                    >
                      <div style={{margin:'auto'}}>
                        {`On Call Technician / Coordinator: `}
                      </div>
                      <div style={{ display: 'none' }}>{provided.placeholder}</div>
                    </div>
                  )
                }}
              </Droppable>
              <div style={{margin:'auto', paddingTop:'15px', width:'90%'}}>
                <Typography>
                  First Call Notes:
                </Typography>
                <TextareaAutosize
                  minRows={5}
                  style={{width:'99%', fontSize:'17px', fontStyle:'inherit'}}
                  placeholder="Please Enter Any First Call Notes Here."
                />
              </div>
              <div style={{margin:'auto', width:'90%'}}>
                <DispatchTechs
                  userID={loggedUserId}
                  dismissedTechs={[]}
                  techs={[]}
                  loading={false}
                  isFirstCall={true}
                />
                
                <DismissedTechs
                  userID={loggedUserId}
                  dismissedTechs={[]}
                  isFirstCall={true}
                />
              </div>
            </Grid>
            <Grid item xs={6}>
              Hi
            </Grid>
          {/* </Grid> */}
        </DragDropContext>
      </Grid>
    </PageWrapper>
  )
}