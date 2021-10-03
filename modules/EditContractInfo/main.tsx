/* 

  Design Specification: converting this to React from Coldfusion
  https://app.kalosflorida.com/index.cfm?action=admin:contracts.edit&contract_id=3365&p=1
  
*/

import React, { useEffect, useCallback, FC } from 'react';
import { PageWrapper } from '../PageWrapper/main';
import { EditContractInfo as EditContract, Output } from '../ComponentsLibrary/EditContractInfo/index';
// add any prop types here
interface props {
  userID: number;
  onSave: (savedContract: Output) => any;
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
