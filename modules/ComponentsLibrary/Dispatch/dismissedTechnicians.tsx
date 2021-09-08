import { DispatchableTech } from '@kalos-core/kalos-rpc/Dispatch';
import React, { FC, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import { format } from 'date-fns';

interface props {
  userID: number;
  dismissedTechs: DispatchableTech[];
  handleUndismissTech: (tech: DispatchableTech) => {};
}

export const DismissedTechs: FC<props> = props => {

  useEffect(() => {
    console.log('dismissedTech use effect');
  }, [props.dismissedTechs]);

  return (
    <TableContainer>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{textAlign:'center', fontWeight:'bold', fontSize:'16px'}}>Name</TableCell>
            <TableCell style={{textAlign:'center', fontWeight:'bold', fontSize:'16px'}}>Dismissed Time</TableCell>
            <TableCell style={{textAlign:'center', fontWeight:'bold', fontSize:'16px'}}>Hours Worked</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.dismissedTechs && 
            props.dismissedTechs.map((tech) => {
              const hoursWorked = Math.floor(tech.getHoursWorked() / 3600);
              const minutesWorked = Math.floor((tech.getHoursWorked() - hoursWorked * 3600) / 60);
              return (
                <TableRow key={tech.getUserId()} hover={true} onClick={()=> props.handleUndismissTech(tech)}>
                  <TableCell style={{textAlign:'center'}}>{tech.getTechname()}</TableCell>
                  <TableCell style={{textAlign:'center'}}>{format(new Date(tech.getActivityDate()), 'h:mm aa')}</TableCell>
                  <TableCell style={{textAlign:'center'}}>{hoursWorked >= 10 ? String(hoursWorked) : `0${hoursWorked}`}:{minutesWorked >= 10 ? String(minutesWorked) : `0${minutesWorked}`}</TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>

    </TableContainer>  
  )
}