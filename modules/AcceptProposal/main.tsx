import React from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ReactPDF from '@react-pdf/renderer';
//@ts-ignore
import SignaturePad from 'react-signature-pad-wrapper';
import { QuoteLine, QuoteLineClient } from '@kalos-core/kalos-rpc/QuoteLine';
import { ENDPOINT } from '../../constants';
import { b64toBlob, timestamp } from '../../helpers';
import { Property, PropertyClient } from '@kalos-core/kalos-rpc/Property';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import { QuoteLineRow } from './components/QLRow';
import { ApprovedProposal } from './components/ApprovedProposal';
import { S3Client, FileObject, URLObject } from '@kalos-core/kalos-rpc/S3File';
import { Document, DocumentClient } from '@kalos-core/kalos-rpc/Document';
import {
  QuoteDocument,
  QuoteDocumentClient,
} from '@kalos-core/kalos-rpc/QuoteDocument';
import {
  ActivityLog,
  ActivityLogClient,
} from '@kalos-core/kalos-rpc/ActivityLog';

// add any prop types here
interface props {
  userID: number;
  jobNumber: number;
  propertyID: number;
  useBusinessName?: boolean;
}

// map your state here
interface state {
  isOpen: boolean;
  sigURL: string;
  isLoading: boolean;
  total: number;
  docID: number;
  quoteLines: QuoteLine.AsObject[];
  selected: number[];
  property: Property.AsObject;
  customer: User.AsObject;
  notes: string;
}

export class AcceptProposal extends React.PureComponent<props, state> {
  QLClient: QuoteLineClient;
  QDClient: QuoteDocumentClient;
  DocClient: DocumentClient;
  LogClient: ActivityLogClient;
  PropertyClient: PropertyClient;
  UserClient: UserClient;
  SigPad: React.RefObject<HTMLCanvasElement>;
  S3Client: S3Client;

  constructor(props: props) {
    super(props);
    this.state = {
      isOpen: false,
      isLoading: false,
      sigURL: '',
      notes: '',
      total: 0,
      quoteLines: [],
      selected: [],
      property: new Property().toObject(),
      customer: new User().toObject(),
      docID: 0,
    };

    this.QLClient = new QuoteLineClient(ENDPOINT);
    this.PropertyClient = new PropertyClient(ENDPOINT);
    this.UserClient = new UserClient(ENDPOINT);
    this.S3Client = new S3Client(ENDPOINT);
    this.QDClient = new QuoteDocumentClient(ENDPOINT);
    this.LogClient = new ActivityLogClient(ENDPOINT);
    this.DocClient = new DocumentClient(ENDPOINT);

    this.SigPad = React.createRef();

    this.addQuoteLine = this.addQuoteLine.bind(this);
    this.getQuoteLines = this.getQuoteLines.bind(this);
    this.approveQuoteLine = this.approveQuoteLine.bind(this);
    this.approveProposal = this.approveProposal.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.sign = this.sign.bind(this);
    this.clear = this.clear.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.saveAsPDF = this.saveAsPDF.bind(this);
    this.finalize = this.finalize.bind(this);
    this.uploadPDF = this.uploadPDF.bind(this);
    this.getDocumentID = this.getDocumentID.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
  }

  addQuoteLine(ql: QuoteLine.AsObject) {
    ql.description = ql.description
      .replace(/---\w{11}---/g, '"')
      .replace(/-\w{11}-/g, "'")
      .replace(/-percent-/g, '%')
      .replace(/-and-/g, '&');
    this.setState((prevState) => ({
      quoteLines: prevState.quoteLines.concat(ql),
    }));
  }

  approveQuoteLine(id: number) {
    const ql = new QuoteLine();
    ql.setQuoteStatus(1);
    ql.setId(id);
    ql.setFieldMaskList(['QuoteStatus']);
    return this.QLClient.Update(ql);
  }

  sign() {
    if (this.SigPad.current) {
      const dUrl = this.SigPad.current.toDataURL();
      const sUrl = URL.createObjectURL(
        b64toBlob(dUrl.replace('data:image/png;base64,', ''), 'sig.png'),
      );
      this.setState({
        sigURL: sUrl,
      });
    }
  }

  clear() {
    if (this.SigPad.current) {
      //@ts-ignore
      this.SigPad.current.clear();
    }
    this.setState({
      sigURL: '',
    });
  }

  handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseInt(e.currentTarget.value);
    this.setState((prevState) => {
      if (prevState.selected.includes(val)) {
        return {
          selected: prevState.selected.filter((v) => v !== val),
        };
      } else
        return {
          selected: prevState.selected.concat(val),
        };
    });
  }

  getTotal() {
    const qls = this.state.quoteLines.filter((ql) =>
      this.state.selected.includes(ql.id),
    );
    return qls.reduce((acc: number, curr: QuoteLine.AsObject) => {
      return acc + parseInt(curr.adjustment);
    }, 0);
  }

  toggleLoading() {
    return new Promise((resolve) => {
      this.setState(
        (prevState) => ({
          isLoading: !prevState.isLoading,
        }),
        resolve,
      );
    });
  }

  toggleModal() {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  }

  async getDocumentID() {
    try {
      const req = new Document();
      req.setFilename(
        `${this.props.jobNumber}_pending_proposal_${this.props.userID}%`,
      );
      const doc = await this.DocClient.Get(req);
      this.setState({
        docID: doc.id,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async updateDocument() {
    try {
      const req = new Document();
      req.setDateCreated(timestamp());
      req.setFilename(
        `${this.props.jobNumber}_approved_proposal_${this.props.userID}.pdf`,
      );
      req.setDescription(
        `${this.props.jobNumber}_approved_proposal_${this.props.userID}.pdf`,
      );
      req.setId(this.state.docID);
      req.setFieldMaskList(['DateCreated', 'Filename', 'Description']);
      await this.DocClient.Update(req);
    } catch (err) {
      console.log(err);
    }
  }

  async getQuoteLines() {
    const ql = new QuoteLine();
    ql.setJobNumber(`${this.props.jobNumber}`);
    ql.setIsActive(1);
    await this.QLClient.List(ql, this.addQuoteLine);
  }

  async getCustomerData() {
    const p = new Property();
    p.setId(this.props.propertyID);
    const theProperty = await this.PropertyClient.Get(p);
    const u = new User();
    u.setId(this.props.userID);
    const theCustomer = await this.UserClient.Get(u);

    this.setState({
      customer: theCustomer,
      property: theProperty,
    });
  }

  async approveProposal() {
    const promises = this.state.selected.map(this.approveQuoteLine);
    await Promise.all(promises);
  }

  async saveAsPDF() {
    const blob = await ReactPDF.pdf(
      <ApprovedProposal
        sigURL={this.state.sigURL}
        quoteLines={this.state.quoteLines.filter((ql) =>
          this.state.selected.includes(ql.id),
        )}
        jobNumber={this.props.jobNumber}
        property={this.state.property}
        name={
          this.props.useBusinessName
            ? this.state.customer.businessname
            : `${this.state.customer.firstname} ${this.state.customer.lastname}`
        }
        total={this.getTotal()}
        notes={this.state.notes}
      />,
    ).toBlob();

    const el = document.createElement('a');
    el.style.display = 'none';
    el.download = `reviewed_proposal_${timestamp(true)}.pdf`;
    const theURL = URL.createObjectURL(blob);
    el.href = theURL;
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
    el.remove();

    return true;
  }

  async uploadPDF() {
    const fd = await ReactPDF.pdf(
      <ApprovedProposal
        sigURL={this.state.sigURL}
        quoteLines={this.state.quoteLines.filter((ql) =>
          this.state.selected.includes(ql.id),
        )}
        jobNumber={this.props.jobNumber}
        property={this.state.property}
        name={
          this.props.useBusinessName
            ? this.state.customer.businessname
            : `${this.state.customer.firstname} ${this.state.customer.lastname}`
        }
        total={this.getTotal()}
        notes={this.state.notes}
      />,
    ).toBlob();
    const urlObj = new URLObject();
    urlObj.setBucket('testbuckethelios');
    urlObj.setKey(
      `${this.props.jobNumber}_approved_proposal_${this.props.userID}.pdf`,
    );
    urlObj.setContentType('pdf');
    const urlRes = await this.S3Client.GetUploadURL(urlObj);
    const uploadRes = await fetch(urlRes.url, {
      body: fd,
      method: 'PUT',
    });
    if (uploadRes.status === 200) {
      console.log('ok');
    }
  }

  async createLog() {
    const req = new ActivityLog();
    req.setUserId(this.props.userID);
    req.setPropertyId(this.props.propertyID);
    req.setActivityName(
      `Customer Approved Proposal: Job ${this.props.jobNumber}`,
    );
    await this.LogClient.Create(req);
  }

  async deleteOldPDF() {
    const req = new FileObject();
    req.setBucket('testbuckethelios2');
    req.setKey(
      `${this.props.jobNumber}_pending_proposal_${this.props.userID}.pdf`,
    );
    await this.S3Client.Delete(req);
  }

  async getJobNotes() {
    const qd = new QuoteDocument();
    qd.setDocumentId(this.state.docID);
    const res = await this.QDClient.Get(qd);
    const notes = res.jobNotes
      .replace(/---\w{11}---/g, '"')
      .replace(/-\w{11}-/g, "'")
      .replace(/-percent-/g, '%')
      .replace(/-and-/g, '&');
    this.setState({ notes });
  }

  async pingSlack() {
    const key =
      'xoxp-11208000564-192623057299-291949462161-5d0e9acdefe3167cee18172908134b9a';
    const channel = 'C0HMJ00P2';
    const proposalUrl = `app.kalosflorida.com/index.cfm?action=admin:service.editServiceCall&id=${this.props.jobNumber}&user_id=${this.props.userID}&property_id=${this.props.propertyID}`;
    const post = [
      {
        fallback: `A proposal has been approved: ${proposalUrl}`,
        fields: [
          {
            title: 'Customer',
            value: this.props.useBusinessName
              ? this.state.customer.businessname
              : `${this.state.customer.firstname} ${this.state.customer.lastname}`,
          },
          {
            title: 'Job Number',
            value: this.props.jobNumber,
          },
          {
            title: 'Address',
            value: `${this.state.property.address}, ${
              this.state.property.city
            }, ${this.state.property.state || 'FL'}`,
          },
          {
            title: 'Link to Call',
            value: proposalUrl,
          },
        ],
      },
    ];
    const slackUrl = `https://slack.com/api/chat.postMessage?token=${key}&text=<!here>, A proposal has been approved&channel=${channel}&icon_emoji=:white_check_mark:&as_user=false&username=Proposal&attachments=${encodeURIComponent(
      JSON.stringify(post),
    )}`;
    await fetch(slackUrl, { method: 'POST' });
  }

  async finalize() {
    try {
      await this.toggleLoading();
      await this.approveProposal();
      await this.uploadPDF();
      try {
        await this.deleteOldPDF();
      } catch (err) {
        console.log('Failed to deleted pending document', err);
      }
      await this.updateDocument();
      await this.createLog();
      await this.pingSlack();
      const name =
        this.props.useBusinessName && this.state.customer.businessname != ''
          ? this.state.customer.businessname
          : `${this.state.customer.firstname}`;
      window.location.href = `https://app.kalosflorida.com/index.cfm?action=customer:service.post_proposal&user_id=${this.props.userID}&username=${name}&jobNumber=${this.props.jobNumber}`;
    } catch (err) {
      alert(
        'Something went wrong, please refresh and try again. If you continue to experience issues, please contact office@kalosflorida.com',
      );
      await this.toggleLoading();
    }
  }

  async componentDidMount() {
    await this.PropertyClient.GetToken('test', 'test');
    await this.getCustomerData();
    await this.getQuoteLines();
    await this.getDocumentID();
    await this.getJobNotes();
  }

  render() {
    return (
      <ThemeProvider theme={customTheme.lightTheme}>
        <Grid container direction="column" alignItems="flex-start">
          <Typography variant="body1" component="span">
            Proposal For:{' '}
            {`${this.state.customer.firstname} ${this.state.customer.lastname}`}
          </Typography>
          <Typography variant="body1" component="span">
            Address:{' '}
            {`${this.state.property.address}, ${this.state.property.city}, ${
              this.state.property.state || 'FL'
            }`}
          </Typography>
          {this.state.notes.length > 0 && (
            <Typography variant="body1" component="span">
              Notes: {this.state.notes}
            </Typography>
          )}
          <Paper
            elevation={10}
            style={{
              maxHeight: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              padding: 10,
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <Table style={{ maxHeight: '100%' }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Repair</TableCell>
                  <TableCell align="center">Price</TableCell>
                  <TableCell align="center">Confirm</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.quoteLines.map((ql) => (
                  <QuoteLineRow
                    ql={ql}
                    key={`quote_line_row_${ql.id}`}
                    isSelected={this.state.selected.includes(ql.id)}
                    onSelect={this.handleSelect}
                  />
                ))}
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell>Total: ${this.getTotal()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Typography
              variant="subtitle1"
              component="span"
              style={{ alignSelf: 'flex-end' }}
            >
              Your total reflects your currently selected services
            </Typography>
          </Paper>
          <Typography variant="subtitle2" component="span">
            By signing this document, you certify that you have the authority to
            approve these repairs and that you are willing and able to furnish
            payment for the work to be completed upon completion of the work.
            You are also agreeing that you have read these terms and agree to
            hold Kalos Services, inc. harmless for warranties offered by the
            equipment manufacturer. Kalos Services, inc. offers a 1year labor
            warranty on workmanship but this does not include consumable items
            such as filters and bulbs. All additional warranties are offered by
            the respective equipment or parts manufacturers and subject to their
            terms. There is no warranty on refrigerant or refrigerant recharge.
          </Typography>
          <Paper
            elevation={10}
            style={{
              maxHeight: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              alignSelf: 'center',
              justifyContent: 'flex-start',
              padding: 10,
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid
                container
                item
                direction="column"
                alignItems="center"
                justify="center"
              >
                <Typography variant="body1">Sign Below</Typography>
                <div
                  style={{
                    height: 200,
                    width: 300,
                    border: '3px solid black',
                  }}
                >
                  <SignaturePad
                    ref={this.SigPad}
                    options={{
                      onEnd: this.sign,
                    }}
                  />
                </div>
                {/*this.state.sigURL.length > 0 && (
                  <Button
                    onClick={this.clear}
                    variant="outlined"
                    style={{ marginBottom: 10, marginTop: 10 }}
                  >
                    Reset Signature
                  </Button>
                )*/}
                {this.state.sigURL.length > 0 &&
                  this.state.selected.length > 0 && (
                    <Button
                      onClick={this.toggleModal}
                      variant="outlined"
                      style={{ marginBottom: 10, marginTop: 10 }}
                    >
                      Submit
                    </Button>
                  )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Dialog open={this.state.isOpen} onClose={this.toggleModal} fullScreen>
          <Paper style={{ height: '100%', padding: 15 }}>
            <Grid container direction="column" alignItems="stretch">
              <Grid
                container
                direction="row"
                style={{ marginBottom: 10 }}
                justify="center"
                alignItems="center"
              >
                <Typography>
                  You are approving Kalos Services to perform the following
                  services for displayed total:{' '}
                </Typography>
                <Table style={{ maxHeight: '100%' }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Repair</TableCell>
                      <TableCell align="center">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.quoteLines
                      .filter((ql) => this.state.selected.includes(ql.id))
                      .map((ql) => (
                        <TableRow key={`quote_line_confirm_${ql.id}`}>
                          <TableCell>{ql.description}</TableCell>
                          <TableCell>${ql.adjustment}</TableCell>
                        </TableRow>
                      ))}
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Total: ${this.getTotal()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              <Button
                onClick={this.toggleModal}
                variant="outlined"
                style={{ marginBottom: 10, marginTop: 10 }}
              >
                Cancel
              </Button>
              <Button
                onClick={this.finalize}
                disabled={this.state.isLoading}
                variant="outlined"
                style={{ marginBottom: 10, marginTop: 10 }}
              >
                Confirm
              </Button>
            </Grid>
          </Paper>
        </Dialog>
      </ThemeProvider>
    );
  }
}
