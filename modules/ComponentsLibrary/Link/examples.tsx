import React, { FC, useState, useCallback } from 'react';
import { Link } from './';

export default () => (
  <>
    <Link href="xyz">Link</Link>
    <br />
    <Link href="xyz" blank>
      Link into new tab
    </Link>
    <br />
    <Link onClick={() => alert('Clicked')}>Link with onClick</Link>
  </>
);
