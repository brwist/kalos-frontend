import {
  Transaction,
  TransactionList,
} from '@kalos-core/kalos-rpc/Transaction';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { TransactionClientService } from '../../../helpers';
import { SectionBar } from '../SectionBar';

export const TransactionAccountsPayable: FC = () => {
  const [transactions, setTransactions] = useState<TransactionList>();
  const [pageNumber, setPageNumber] = useState<number>(0);

  const handleChangePage = useCallback(
    (pageNumberToChangeTo: number) => {
      setPageNumber(pageNumberToChangeTo);
    },
    [setPageNumber],
  );

  const load = useCallback(async () => {
    let req = new Transaction();
    req.setPageNumber(pageNumber);
    setTransactions(await TransactionClientService.BatchGet(req));
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  return (
    <>
      <SectionBar
        title="Transactions"
        pagination={{
          count: transactions ? transactions!.getTotalCount() : 0,
          rowsPerPage: 25,
          page: pageNumber,
          onChangePage: handleChangePage,
        }}
      />
    </>
  );
};
