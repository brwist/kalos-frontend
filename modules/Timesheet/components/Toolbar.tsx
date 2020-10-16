import React, { FC } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import MuiToolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { WeekPicker } from '../../ComponentsLibrary/WeekPicker';
import { Button } from '../../ComponentsLibrary/Button';
import { Payroll } from '../reducer';
import { roundNumber } from '../../../helpers';
import { useConfirm } from '../../ComponentsLibrary/ConfirmService';
import './toolbar.less';

type Props = {
  selectedDate: Date;
  handleDateChange: (value: Date) => void;
  userName: string;
  timesheetAdministration: boolean;
  payroll: Payroll;
  submitTimesheet: () => void;
  pendingEntries: boolean;
};

const Toolbar: FC<Props> = ({
  selectedDate,
  handleDateChange,
  userName,
  timesheetAdministration,
  payroll,
  submitTimesheet,
  pendingEntries,
}): JSX.Element => {
  const confirm = useConfirm();

  const handleSubmit = () => {
    if (timesheetAdministration) {
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
          weekStartsOn={1}
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
          <Button
            onClick={handleSubmit}
            label={
              timesheetAdministration ? 'Approve Timesheet' : 'Submit Timesheet'
            }
            disabled={timesheetAdministration && pendingEntries}
          />
        </Box>
      </MuiPickersUtilsProvider>
    </MuiToolbar>
  );
};

export default Toolbar;
