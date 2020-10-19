import React from 'react';
import Paper from '@material-ui/core/Paper';
import { Spiff } from '@kalos-core/kalos-rpc/Task';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../ComponentsLibrary/InfoTable';
import { Tooltip } from '../../ComponentsLibrary/Tooltip';
import { makeFakeRows, formatDate, usd } from '../../../helpers';
import { parseISO } from 'date-fns';

interface SpiffProps {
  spiffs: Spiff.AsObject[];
  isLoading: boolean;
}

export const Spiffs = ({ spiffs, isLoading }: SpiffProps) => {
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
        <SectionBar title="Spiffs" />
        <InfoTable
          columns={[
            { name: 'Claim Date' },
            { name: 'Description' },
            { name: 'Amount' },
            { name: 'Spiff Type' },
            { name: 'Job ID' },
            { name: 'Status' },
            { name: 'Reviewed By' },
          ]}
          data={
            isLoading
              ? makeFakeRows(7, 5)
              : spiffs
                  .sort((a, b) => {
                    const dateA = parseISO(a.timeCreated.split(' ')[0]);
                    const dateB = parseISO(b.timeCreated.split(' ')[0]);
                    return dateB.valueOf() - dateA.valueOf();
                  })
                  .map(
                    ({
                      timeCreated,
                      briefDescription,
                      spiffAmount,
                      spiffType,
                      spiffJobnumber,
                      status,
                      reason,
                      reviewedBy,
                    }) => [
                      { value: formatDate(timeCreated) },
                      { value: briefDescription },
                      { value: usd(spiffAmount) },
                      { value: spiffType },
                      { value: spiffJobnumber },
                      {
                        value:
                          status === 'Rejected' ? (
                            <Tooltip placement="bottom" content={reason}>
                              <span>{status}</span>
                            </Tooltip>
                          ) : status === 'New' ? (
                            'Pending'
                          ) : (
                            status
                          ),
                      },
                      { value: reviewedBy },
                    ],
                  )
          }
          loading={isLoading}
        />
      </Paper>
    </>
  );
};
