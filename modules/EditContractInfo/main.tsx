/* 

  Design Specification: 

*/

import { Contract } from '@kalos-core/kalos-rpc/Contract';
import React, { useEffect, useCallback, FC } from 'react';
import { PageWrapper } from '../PageWrapper/main';
import { EditContractInfo as EditContract } from '../ComponentsLibrary/EditContractInfo/index';
// add any prop types here
interface props {
  userID: number;
  onSave: (savedContract: Contract) => any;
  onClose: () => any;
}

export const EditContractInfo: FC<props> = function NewContract({
  userID,
  onSave,
  onClose,
}) {
  const cleanup = useCallback(() => {}, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <PageWrapper userID={userID} withHeader>
      <EditContract userID={userID} onSave={onSave} onClose={onClose} />
    </PageWrapper>
  );
};
