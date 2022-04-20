import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { Spiff } from '../../../@kalos-core/kalos-rpc/Task';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../ComponentsLibrary/InfoTable';
import { Tooltip } from '../../ComponentsLibrary/Tooltip';
import { makeFakeRows, formatDate, usd } from '../../../helpers';
import { parseISO } from 'date-fns';
import { Button } from '../../ComponentsLibrary/Button';
import { SpiffTool } from '../../SpiffToolLogs/components/SpiffTool';
import { Modal } from '../../ComponentsLibrary/Modal';
import '../../SpiffToolLogs/components/SpiffTool.module.less';

interface SpiffProps {
  spiffs: Spiff[];
  isLoading: boolean;
  loggedUserId: number;
}

export const Spiffs = ({ spiffs, isLoading, loggedUserId }: SpiffProps) => {
  const [openLog, setOpenLog] = useState<boolean>(false);
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
        <Button
          label={'Open New Spiff Log'}
          onClick={() => setOpenLog(true)}
        ></Button>
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
                    const dateA = parseISO(a.getTimeCreated().split(' ')[0]);
                    const dateB = parseISO(b.getTimeCreated().split(' ')[0]);
                    return dateB.valueOf() - dateA.valueOf();
                  })
                  .map(s => [
                    { value: formatDate(s.getTimeCreated()) },
                    { value: s.getBriefDescription() },
                    { value: usd(s.getSpiffAmount()) },
                    { value: s.getSpiffType() },
                    { value: s.getSpiffJobnumber() },
                    {
                      value:
                        status === 'Rejected' ? (
                          <Tooltip placement="bottom" content={s.getReason()}>
                            <span>{status}</span>
                          </Tooltip>
                        ) : status === 'New' ? (
                          'Pending'
                        ) : (
                          status
                        ),
                    },
                    { value: s.getReviewedBy() },
                  ])
          }
          loading={isLoading}
        />

        <Modal
          onClose={() => setOpenLog(false)}
          open={openLog}
          fullScreen={true}
        >
          <SpiffTool
            type="Spiff"
            loggedUserId={loggedUserId}
            ownerId={loggedUserId}
            needsManagerAction={false}
            needsPayrollAction={false}
            needsAuditAction={false}
            onClose={() => setOpenLog(false)}
          />
        </Modal>
      </Paper>
    </>
  );
};
