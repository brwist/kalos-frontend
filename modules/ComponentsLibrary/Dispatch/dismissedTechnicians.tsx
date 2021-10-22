import { DispatchableTech } from '@kalos-core/kalos-rpc/Dispatch';
import React, { FC, useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import format from 'date-fns/esm/format';
import parseISO from 'date-fns/esm/parseISO';

interface props {
  userID: number;
  dismissedTechs: DispatchableTech[];
  handleUndismissTech?: (tech: DispatchableTech) => {};
  isFirstCall?: boolean;
  alternateTitle?: string;
  processingDismissed?: boolean;
}

export const DismissedTechs: FC<props> = props => {
  const {
    userID,
    dismissedTechs,
    isFirstCall = false,
    alternateTitle = "",
    processingDismissed = false
  } = props

  const [techs, setTechs] = useState<DispatchableTech[]>([]);

  const sorted = (techs : DispatchableTech[]) => {
    return techs.sort((a,b) => (a.getTechname() > b.getTechname()) ? 1 : ((b.getTechname() > a.getTechname()) ? -1 : 0));
  }

  useEffect(() => {
    setTechs(sorted(dismissedTechs));
  }, [dismissedTechs]);

  return (
    <TableContainer>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{textAlign:'center', fontWeight:'bold', fontSize:'16px'}}>{!alternateTitle.length?'Name':alternateTitle}</TableCell>
            <TableCell style={{textAlign:'center', fontWeight:'bold', fontSize:'16px', display:isFirstCall?'none':''}}>Dismissed Time</TableCell>
            <TableCell style={{textAlign:'center', fontWeight:'bold', fontSize:'16px', display:isFirstCall?'none':''}}>Hours Worked</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {techs && 
            techs.map((tech) => {
              const hoursWorked = Math.floor(tech.getHoursWorked() / 3600);
              const minutesWorked = Math.floor((tech.getHoursWorked() - hoursWorked * 3600) / 60);
              return (
                <TableRow key={tech.getUserId()} hover onClick={props.handleUndismissTech && !processingDismissed ? ()=> props.handleUndismissTech!(tech) : () => {}}>
                  <TableCell style={{textAlign:'center'}}>{tech.getTechname()}</TableCell>
                  <TableCell style={{textAlign:'center', display:isFirstCall?'none':''}}>{!isFirstCall ? format(parseISO(tech.getActivityDate()), 'h:mm aa') : ''}</TableCell>
                  <TableCell style={{textAlign:'center', display:isFirstCall?'none':''}}>{hoursWorked >= 10 ? String(hoursWorked) : `0${hoursWorked}`}:{minutesWorked >= 10 ? String(minutesWorked) : `0${minutesWorked}`}</TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>

    </TableContainer>  
  )
}