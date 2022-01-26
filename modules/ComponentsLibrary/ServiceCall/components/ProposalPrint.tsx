import React, { FC } from 'react';
import compact from 'lodash/compact';
import { PrintPage } from '../../PrintPage';
import { PrintParagraph } from '../../PrintParagraph';
import { PrintTable } from '../../PrintTable';
import { usd, formatDate } from '../../../../helpers';
import { Property } from '@kalos-core/kalos-rpc/Property';

interface Props {
  displayName: string;
  notes?: string;
  entries: {
    diagnosis?: string;
    description: string;
    price: number;
  }[];
  logJobNumber: string;
  property: Property;
  withDiagnosis?: boolean;
  onFileCreated?: (file: Uint8Array) => void;
  downloadPDdfFileName: string;
  uploadBucket?: string;
}

export const ProposalPrint: FC<Props> = ({
  displayName,
  notes,
  logJobNumber,
  entries,
  property,
  withDiagnosis = false,
  uploadBucket,
  onFileCreated,
  downloadPDdfFileName,
}) => (
  <PrintPage
    headerProps={{
      withKalosAddress: true,
      withKalosContact: true,
      bigLogo: true,
    }}
    buttonProps={{ label: 'Print Preview' }}
    downloadPdfFilename={downloadPDdfFileName}
    downloadLabel="Download PDF Preview"
    onFileCreated={onFileCreated}
    uploadBucket={uploadBucket}
  >
    <PrintParagraph>
      Date: {formatDate(new Date().toISOString())}
      <br />
      Job Number: {logJobNumber}
    </PrintParagraph>
    <PrintParagraph tag="h2">
      {displayName}
      <br />
      {property.getAddress()}
      <br />
      {compact([
        property.getCity(),
        property.getState(),
        property.getZip(),
      ]).join(', ')}
    </PrintParagraph>
    <PrintParagraph tag="h1" align="center">
      Proposed Services
    </PrintParagraph>
    {notes && (
      <PrintTable
        columns={['Notes']}
        data={notes
          .split('\n')
          .filter(n => !!n)
          .map(n => [n])}
      />
    )}
    <PrintTable
      columns={[
        ...(withDiagnosis ? ['Diagnosis'] : []),
        'Description of Repair',
        { title: 'Price', align: 'right' },
      ]}
      data={entries.map(({ diagnosis, description, price }) => [
        ...(withDiagnosis ? [diagnosis] : []),
        description,
        usd(price),
      ])}
      nowraps={[false, true]}
    />
  </PrintPage>
);
