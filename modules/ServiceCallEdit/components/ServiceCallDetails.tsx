import React, { FC } from 'React';
import { Tabs } from '../../ComponentsLibrary/Tabs';
import { Request } from './Request';
import { Equipment } from './Equipment';
import { Services } from './Services';
import { Invoice } from './Invoice';
import { Proposal } from './Proposal';

interface Props {}

export const ServiceCallDetails: FC<Props> = () => (
  <div>
    {/* <div>ServiceCallDetails</div> */}
    <Tabs
      tabs={[
        {
          label: 'Request',
          content: <Request />,
        },
        {
          label: 'Equipment',
          content: <Equipment />,
        },
        {
          label: 'Services',
          content: <Services />,
        },
        {
          label: 'Invoice',
          content: <Invoice />,
        },
        {
          label: 'Proposal',
          content: <Proposal />,
        },
      ]}
    />
  </div>
);
