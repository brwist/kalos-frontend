import React from 'react';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import GoToCallIcon from '@material-ui/icons/ExitToApp';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../ComponentsLibrary/InfoTable';
import { Tooltip } from '../../ComponentsLibrary/Tooltip';
import { makeFakeRows, formatDate, UserClientService } from '../../../helpers';
import { getPropertyAddress } from '../../../@kalos-core/kalos-rpc/Property';
import { parseISO } from 'date-fns';
import { Event } from '../../../@kalos-core/kalos-rpc/Event';

interface AssignmentProps {
  events: Event[];
  isLoading: boolean;
}

export const Assignments = ({ events, isLoading }: AssignmentProps) => {
  return (
    <>
      <Paper
        elevation={7}
        style={{
          width: '90%',
          maxHeight: 400,
          overflowY: 'scroll',
          marginBottom: 20,
        }}
      >
        <SectionBar title="Recent Service Calls" />
        <InfoTable
          columns={[
            { name: 'No.' },
            { name: 'Date' },
            { name: 'Time' },
            { name: 'Customer Name' },
            { name: 'Address' },
            { name: 'Type' },
            { name: 'Subtype' },
            { name: 'Status' },
          ]}
          data={
            isLoading
              ? makeFakeRows(8, 5)
              : events
                  .sort((a, b) => {
                    const dateA = parseISO(a.getDateStarted().split(' ')[0]);
                    const dateB = parseISO(b.getDateStarted().split(' ')[0]);
                    return dateB.valueOf() - dateA.valueOf();
                  })
                  .map(e => {
                    /*
                    const {
                      id,
                      dateStarted,
                      timeStarted,
                      timeEnded,
                      customer,
                      property,
                      jobType,
                      jobSubtype,
                      logJobStatus,
                    } = e;
                    */
                    const id = e.getId();
                    const dateStarted = e.getDateStarted();
                    const timeStarted = e.getTimeStarted();
                    const timeEnded = e.getTimeEnded();
                    const customer = e.getCustomer();
                    const property = e.getProperty();
                    const jobType = e.getJobType();
                    const jobSubtype = e.getJobSubtype();
                    const logJobStatus = e.getLogJobStatus();
                    return [
                      {
                        value: id,
                        onClick: openServiceCall(e),
                      },
                      {
                        value: formatDate(dateStarted),
                        onClick: openServiceCall(e),
                      },
                      {
                        value: `${timeStarted} - ${timeEnded}`,
                        onClick: openServiceCall(e),
                      },
                      {
                        value: UserClientService.getCustomerName(customer!),
                        onClick: openServiceCall(e),
                      },
                      {
                        value: getPropertyAddress(property),
                        onClick: openServiceCall(e),
                      },
                      {
                        value: jobType,
                        onClick: openServiceCall(e),
                      },
                      {
                        value: jobSubtype,
                        onClick: openServiceCall(e),
                      },
                      {
                        value: logJobStatus,
                        onClick: openServiceCall(e),
                        actions: [
                          <Tooltip
                            key="event"
                            placement="bottom"
                            content="Go to Service Call"
                          >
                            <IconButton
                              size="small"
                              onClick={openServiceCall(e)}
                            >
                              <GoToCallIcon />
                            </IconButton>
                          </Tooltip>,
                        ],
                      },
                    ];
                  })
          }
          loading={isLoading}
        />
      </Paper>
    </>
  );
};

function openServiceCall(e: Event) {
  return () => {
    const url = `https://app.kalosflorida.com/index.cfm?action=admin:service.editServiceCall&id=${e.getId()}&user_id=${
      e.getCustomer() ? e.getCustomer()!.getId() : 0
    }&property_id=${e.getPropertyId()}`;
    window.location.href = url;
  };
}
