import React from 'react';
import { PrintList } from './';

export default () => (
  <>
    <PrintList
      items={[
        'Consectetur adipiscing elit. Vivamus volutpat iaculis feugiat',
        <div>
          Donec et iaculis augue
          <br />
          quis posuere velit
        </div>,
        'In at ante sed mi mollis viverra quis sit amet orci',
        'Sed at efficitur velit, interdum porta mi',
        'Proin quis sapien orci',
        'Aliquam vulputate vitae ex interdum tincidunt',
        'Curabitur eu aliquet augue',
        'Mauris tincidunt non lacus eu dictum',
        'Maecenas sodales ligula in ultricies molestie',
        'Donec faucibus pellentesque tincidunt',
        'Vivamus in mollis felis',
      ]}
    />
  </>
);
