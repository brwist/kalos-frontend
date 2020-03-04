import React from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ENDPOINT } from '../../constants';
import { S3Client, URLObject } from '@kalos-core/kalos-rpc/S3File';

// add any prop types here
interface props {
  userID: number;
  userName: string;
  jobNumber: number;
}

export function PostProposal({ userID, userName, jobNumber }: props) {
  const S3 = new S3Client(ENDPOINT);
  const req = new URLObject();
  req.setKey(`${jobNumber}_approved_proposal_${userID}.pdf`);
  req.setBucket('testbuckethelios');
  S3.GetDownloadURL(req);

  const downloadPDF = async () => {
    await fetchPDF(userID, jobNumber);
  };

  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      <Grid
        container
        direction="column"
        justify="space-around"
        alignItems="center"
        style={{ padding: 20, height: '100%' }}
      >
        <Typography
          variant="h4"
          component="span"
          align="center"
          style={{ marginBottom: 10 }}
        >
          Thank you for reviewing your proposal {userName}!
        </Typography>
        <Button
          onClick={downloadPDF}
          variant="outlined"
          style={{ marginBottom: 10 }}
        >
          Click to obtain a copy of the document for your records
        </Button>
        <Typography
          variant="body1"
          component="span"
          align="center"
          style={{ marginBottom: 10 }}
        >
          We appreciate your business. If you have any issues or concerns please
          contact us and as to speak with our parts coordinator.
        </Typography>
        <Typography
          variant="h5"
          component="a"
          align="center"
          href="tel:3522437099"
          style={{ marginBottom: 10 }}
        >
          Call us at: (352) 243-7099
        </Typography>
        <Typography
          variant="h5"
          component="a"
          align="center"
          href="mailto:office@kalosflorida.com"
          style={{ marginBottom: 10 }}
        >
          Email us at: office@kalosflorida.com
        </Typography>
      </Grid>
    </ThemeProvider>
  );
}

async function fetchPDF(userID: number, jobNumber: number) {
  const S3 = new S3Client(ENDPOINT);
  const req = new URLObject();
  req.setKey(`${jobNumber}_approved_proposal_${userID}.pdf`);
  req.setBucket('testbuckethelios');
  const dlURL = await S3.GetDownloadURL(req);
  window.location.assign(dlURL.url);
}
