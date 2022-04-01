import { TransactionAccountList } from '../../../@kalos-core/kalos-rpc/TransactionAccount';
import React from 'react';
import { UploadPhotoTransactionCreditCard } from '.';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>default</ExampleTitle>
    <UploadPhotoTransactionCreditCard
      loggedUserId={101253}
      bucket="testbuckethelios"
      onClose={console.log}
      costCenters={new TransactionAccountList()}
    />
    <ExampleTitle>title, no close, with defaultSubjectTag</ExampleTitle>
    <UploadPhotoTransactionCreditCard
      loggedUserId={101253}
      bucket="testbuckethelios"
      onClose={null}
      title="Lorem ipsum"
      defaultTag="Data Tag"
      costCenters={new TransactionAccountList()}
    />
  </>
);
