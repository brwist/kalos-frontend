import React from 'react';
import Alert from '@material-ui/lab/Alert';
import { ENDPOINT } from '../../constants';
import { Button } from '../ComponentsLibrary/Button';
import { Link } from '../ComponentsLibrary/Link';
import { S3Client, URLObject } from '../../@kalos-core/kalos-rpc/S3File';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

// add any prop types here
interface props extends PageWrapperProps {
  userID: number;
  userName: string;
  jobNumber: number;
}

export function PostProposal({ userID, userName, jobNumber, ...props }: props) {
  const S3 = new S3Client(ENDPOINT);
  const req = new URLObject();
  req.setKey(`${jobNumber}_approved_proposal_${userID}.pdf`);
  req.setBucket('testbuckethelios');
  S3.GetDownloadURL(req);
  const downloadPDF = async () => {
    await fetchPDF(userID, jobNumber);
  };
  return (
    <PageWrapper {...props} userID={userID}>
      <Alert>
        <big>Thank you for reviewing your proposal {userName}!</big>
      </Alert>
      <Button
        label="Click to obtain a copy of the document for your records"
        onClick={downloadPDF}
        variant="outlined"
        style={{ marginRight: 8 }}
      />
      <Alert severity="info">
        <div>
          We appreciate your business. If you have any issues or concerns please
          contact us and as to speak with our parts coordinator.
        </div>
        <div>
          Call us at: <Link href="tel:3522437099">(352) 243-7099</Link>
        </div>
        <div>
          Email us at:{' '}
          <Link href="mailto:office@kalosflorida.com">
            office@kalosflorida.com
          </Link>
        </div>
      </Alert>
    </PageWrapper>
  );
}

async function fetchPDF(userID: number, jobNumber: number) {
  const S3 = new S3Client(ENDPOINT);
  const req = new URLObject();
  req.setKey(`${jobNumber}_approved_proposal_${userID}.pdf`);
  req.setBucket('testbuckethelios');
  const dlURL = await S3.GetDownloadURL(req);
  window.open(dlURL.url, '_blank');
}
