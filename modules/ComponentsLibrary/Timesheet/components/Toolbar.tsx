import React, { FC, useCallback, useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import MuiToolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { WeekPicker } from '../../WeekPicker';
import { Button } from '../../Button';
import { Payroll } from '../reducer';
import { roundNumber } from '../../../../helpers';
import { useConfirm } from '../../ConfirmService';
import './toolbar.less';
import { Payroll as PayrollComponent } from '../../Payroll';
import { Modal } from '../../Modal';
import { SectionBar } from '../../SectionBar';
import { TripCalulator } from '../../TripCalulator';
type Props = {
  selectedDate: Date;
  handleDateChange: (value: Date) => void;
  userName: string;
  timesheetAdministration: boolean;
  payroll: Payroll;
  submitTimesheet: () => void;
  processTimesheet: () => void;
  rejectTimesheet: () => void;
  pendingEntries: boolean;
  isTimesheetOwner?: boolean;
  onClose?: () => void;
  role: string | undefined;
  userId: number;
};

const Toolbar: FC<Props> = ({
  selectedDate,
  handleDateChange,
  userName,
  timesheetAdministration,
  payroll,
  submitTimesheet,
  processTimesheet,
  rejectTimesheet,
  pendingEntries,
  isTimesheetOwner,
  onClose,
  role,
  userId: userID,
}): JSX.Element => {
  const confirm = useConfirm();
  const [openCalculator, setOpenCalculator] = useState<boolean>();
  const [payrollOpen, setPayrollOpen] = useState<boolean>();
  const handleSetPayrollOpen = useCallback(
    (open: boolean) => setPayrollOpen(open),
    [setPayrollOpen],
  );
  const handleSubmit = () => {
    if ((timesheetAdministration && !isTimesheetOwner) || role === 'Payroll') {
      submitTimesheet();
    } else {
      confirm({
        description:
          'By submitting my timecard, I affirm that i have not been injured on the job during this work week.',
      }).then(() => {
        submitTimesheet();
      });
    }
  };
  const handleProcess = () => {
    if (role === 'Payroll') {
      processTimesheet();
    }
  };
  const handleReject = () => {
    if (role === 'Payroll') {
      rejectTimesheet();
    }
  };
  const submitText = 'Submit Timesheet';
  let buttonLabel = 'Approve Timesheet';
  if (!timesheetAdministration) {
    buttonLabel = submitText;
  }
  if (isTimesheetOwner) {
    buttonLabel = submitText;
  }

  return (
    <MuiToolbar className="TimesheetToolbarBar">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <WeekPicker
          white
          label="Set a Period"
          inputVariant="outlined"
          size="small"
          value={selectedDate}
          onChange={handleDateChange}
          weekStartsOn={6}
        />
        <Typography className="TimesheetToolbarUserName" variant="subtitle1">
          {userName}
        </Typography>
        <Box className="TimesheetToolbarInfo">
          <Box className="TimesheetToolbarPayroll">
            {payroll.total !== null ? (
              <>
                <Typography variant="subtitle2">
                  Total: <strong>{roundNumber(payroll.total || 0)}</strong>
                </Typography>
                <Typography className="TimesheetToolbarDetails">
                  <span>
                    Bill: <strong>{roundNumber(payroll.billable || 0)}</strong>
                  </span>
                  <span>
                    Unbill:{' '}
                    <strong>{roundNumber(payroll.unbillable || 0)}</strong>
                  </span>
                </Typography>
              </>
            ) : (
              <>
                <Skeleton variant="text" width={75} height={16} />
                <Skeleton variant="text" width={150} height={16} />
              </>
            )}
          </Box>
          {(isTimesheetOwner || timesheetAdministration) && (
            <Button onClick={handleSubmit} label={buttonLabel} />
          )}
          {role === 'Payroll' && (
            <div>
              <Button onClick={handleProcess} label={'Process Payroll'} />
              <Button onClick={handleReject} label={'Reject Timesheet'} />
            </div>
          )}
          {(userID == 103896 || userID == 103285) && (
            <Button
              label="Trip Calculator"
              onClick={() => setOpenCalculator(true)}
            ></Button>
          )}
          {payrollOpen && (
            <Modal
              open={true}
              onClose={() => handleSetPayrollOpen(false)}
              fullScreen
            >
              <SectionBar
                title={'Process Payroll'}
                actions={[
                  {
                    label: 'Close',
                    onClick: () => handleSetPayrollOpen(false),
                  },
                ]}
                fixedActions
              />
              <PayrollComponent userID={userID}></PayrollComponent>
            </Modal>
          )}
          {openCalculator && (
            <Modal
              key="calculatorModal"
              open={openCalculator}
              onClose={() => setOpenCalculator(false)}
            >
              <TripCalulator
                loggedUserId={userID}
                onClose={() => setOpenCalculator(false)}
              />
            </Modal>
          )}
          {onClose && <Button label="Close" onClick={onClose} />}
        </Box>
      </MuiPickersUtilsProvider>
    </MuiToolbar>
  );
};

export default Toolbar;
