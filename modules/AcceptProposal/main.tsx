import React, { ReactText } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Alert from '@material-ui/lab/Alert';
import ReactPDF from '@react-pdf/renderer';
import { Button } from '../ComponentsLibrary/Button';
import { QuoteLine, QuoteLineClient } from '@kalos-core/kalos-rpc/QuoteLine';
import { ENDPOINT } from '../../constants';
import { b64toBlob, timestamp } from '../../helpers';
import {
  Property,
  PropertyClient,
  getPropertyAddress,
} from '@kalos-core/kalos-rpc/Property';
import { User } from '@kalos-core/kalos-rpc/User';
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
import { SectionBar } from '../ComponentsLibrary/SectionBar';
import { InfoTable } from '../ComponentsLibrary/InfoTable';
import { Confirm } from '../ComponentsLibrary/Confirm';
import { Field } from '../ComponentsLibrary/Field';
import { Loader } from '../Loader/main';
import { UserClientService, usd } from '../../helpers';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

// add any prop types here
interface props extends PageWrapperProps {
  userID: number;
  jobNumber: number;
  propertyID: number;
  loggedUserId: number;
  useBusinessName?: boolean;
}

// map your state here
interface state {
  isOpen: boolean;
  sigURL: string;
  isLoading: boolean;
  total: number;
  docID: number;
  quoteLines: QuoteLine[];
  selected: number[];
  property: Property;
  customer: User;
  notes: string;
}

export class AcceptProposal extends React.PureComponent<props, state> {
  QLClient: QuoteLineClient;
  QDClient: QuoteDocumentClient;
  DocClient: DocumentClient;
  LogClient: ActivityLogClient;
  PropertyClient: PropertyClient;
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
      property: new Property(),
      customer: new User(),
      docID: 0,
    };

    this.QLClient = new QuoteLineClient(ENDPOINT);
    this.PropertyClient = new PropertyClient(ENDPOINT);
    this.S3Client = new S3Client(ENDPOINT);
    this.QDClient = new QuoteDocumentClient(ENDPOINT);
    this.LogClient = new ActivityLogClient(ENDPOINT);
    this.DocClient = new DocumentClient(ENDPOINT);
    this.SigPad = React.createRef();
  }

  addQuoteLine = (ql: QuoteLine) => {
    ql.setDescription(
      ql
        .getDescription()
        .replace(/---\w{11}---/g, '"')
        .replace(/-\w{11}-/g, "'")
        .replace(/-percent-/g, '%')
        .replace(/-and-/g, '&'),
    );
    this.setState(prevState => ({
      quoteLines: prevState.quoteLines.concat(ql),
    }));
  };

  approveQuoteLine = (id: number) => {
    const ql = new QuoteLine();
    ql.setQuoteStatus(1);
    ql.setId(id);
    ql.setFieldMaskList(['QuoteStatus']);
    return this.QLClient.Update(ql);
  };

  sign = (url: ReactText) => {
    const dUrl = url.toString();
    if (dUrl === '') {
      this.setState({ sigURL: '' });
      return;
    }
    const sUrl = URL.createObjectURL(
      b64toBlob(dUrl.replace('data:image/png;base64,', ''), 'sig.png'),
    );
    this.setState({ sigURL: sUrl });
  };

  handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.currentTarget.value);
    this.setState(prevState => {
      if (prevState.selected.includes(val)) {
        return {
          selected: prevState.selected.filter(v => v !== val),
        };
      } else
        return {
          selected: prevState.selected.concat(val),
        };
    });
  };

  getTotal = () => {
    const qls = this.state.quoteLines.filter(ql =>
      this.state.selected.includes(ql.getId()),
    );
    return qls.reduce((acc: number, curr: QuoteLine) => {
      return acc + parseInt(curr.getAdjustment());
    }, 0);
  };

  toggleLoading = () => {
    return new Promise<void>(resolve => {
      this.setState(
        prevState => ({
          isLoading: !prevState.isLoading,
        }),
        () => resolve,
      );
    });
  };

  toggleModal = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  };

  getDocumentID = async () => {
    try {
      const req = new Document();
      req.setFilename(
        `${this.props.jobNumber}_pending_proposal_${this.props.userID}%`,
      );
      const doc = await this.DocClient.Get(req);
      this.setState({
        docID: doc.getId(),
      });
    } catch (err) {
      console.log(err);
    }
  };

  updateDocument = async () => {
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
  };

  getQuoteLines = async () => {
    const ql = new QuoteLine();
    ql.setJobNumber(`${this.props.jobNumber}`);
    ql.setIsActive(1);
    await this.QLClient.List(ql, this.addQuoteLine);
  };

  getCustomerData = async () => {
    const p = new Property();
    p.setId(this.props.propertyID);
    const theProperty = await this.PropertyClient.Get(p);
    const u = new User();
    u.setId(this.props.userID);
    const theCustomer = await UserClientService.Get(u);
    this.setState({
      customer: theCustomer,
      property: theProperty,
    });
  };

  approveProposal = async () => {
    const promises = this.state.selected.map(this.approveQuoteLine);
    await Promise.all(promises);
  };

  saveAsPDF = async () => {
    const blob = await ReactPDF.pdf(
      <ApprovedProposal
        sigURL={this.state.sigURL}
        quoteLines={this.state.quoteLines.filter(ql =>
          this.state.selected.includes(ql.getId()),
        )}
        jobNumber={this.props.jobNumber}
        property={this.state.property}
        name={
          this.props.useBusinessName
            ? this.state.customer.getBusinessname()
            : `${this.state.customer.getFirstname()} ${this.state.customer.getLastname()}`
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
  };

  uploadPDF = async () => {
    const fd = await ReactPDF.pdf(
      <ApprovedProposal
        sigURL={this.state.sigURL}
        quoteLines={this.state.quoteLines.filter(ql =>
          this.state.selected.includes(ql.getId()),
        )}
        jobNumber={this.props.jobNumber}
        property={this.state.property}
        name={
          this.props.useBusinessName
            ? this.state.customer.getBusinessname()
            : `${this.state.customer.getFirstname()} ${this.state.customer.getLastname()}`
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
    const uploadRes = await fetch(urlRes.getUrl(), {
      body: fd,
      method: 'PUT',
    });
    if (uploadRes.status === 200) {
      console.log('ok');
    }
  };

  createLog = async () => {
    const req = new ActivityLog();
    req.setUserId(this.props.userID);
    req.setPropertyId(this.props.propertyID);
    req.setActivityName(
      `Customer Approved Proposal: Job ${this.props.jobNumber}`,
    );
    await this.LogClient.Create(req);
  };

  deleteOldPDF = async () => {
    const req = new FileObject();
    req.setBucket('testbuckethelios2');
    req.setKey(
      `${this.props.jobNumber}_pending_proposal_${this.props.userID}.pdf`,
    );
    await this.S3Client.Delete(req);
  };

  getJobNotes = async () => {
    const qd = new QuoteDocument();
    qd.setDocumentId(this.state.docID);
    const res = await this.QDClient.Get(qd);
    const notes = res
      .getJobNotes()
      .replace(/---\w{11}---/g, '"')
      .replace(/-\w{11}-/g, "'")
      .replace(/-percent-/g, '%')
      .replace(/-and-/g, '&');
    this.setState({ notes });
  };

  pingSlack = async () => {
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
              ? this.state.customer.getBusinessname()
              : `${this.state.customer.getFirstname()} ${this.state.customer.getLastname()}`,
          },
          {
            title: 'Job Number',
            value: this.props.jobNumber,
          },
          {
            title: 'Address',
            value: `${this.state.property.getAddress()}, ${this.state.property.getCity()}, ${
              this.state.property.getState() || 'FL'
            }`,
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
  };

  finalize = async () => {
    try {
      //await this.toggleLoading();
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
        this.props.useBusinessName &&
        this.state.customer.getBusinessname() != ''
          ? this.state.customer.getBusinessname()
          : `${this.state.customer.getFirstname()}`;
      window.location.href = `https://app.kalosflorida.com/index.cfm?action=customer:service.post_proposal&user_id=${this.props.userID}&username=${name}&jobNumber=${this.props.jobNumber}`;
    } catch (err) {
      alert(
        'Something went wrong, please refresh and try again. If you continue to experience issues, please contact office@kalosflorida.com',
      );
      //await this.toggleLoading();
    }
  };

  async componentDidMount() {
    await this.PropertyClient.GetToken('test', 'test');
    //await this.toggleLoading();
    await this.getCustomerData();
    await this.getQuoteLines();
    await this.getDocumentID();
    await this.getJobNotes();
    //await this.toggleLoading();
  }

  render() {
    return (
      <PageWrapper {...this.props} userID={this.props.loggedUserId}>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <>
            <SectionBar
              title={`Proposal for ${UserClientService.getCustomerName(
                this.state.customer,
              )}`}
              subtitle={`Address: ${getPropertyAddress(this.state.property)}`}
              footer={
                this.state.notes.length > 0 ? `Notes: ${this.state.notes}` : ''
              }
              fixedActions
            />
            <InfoTable
              columns={[
                { name: 'Repair', width: -1 },
                { name: 'Price', width: 150, align: 'right' },
                { name: 'Confirm', width: 80, align: 'center' },
              ]}
              data={[
                ...this.state.quoteLines.map(quote => [
                  { value: quote.getDescription() },
                  { value: usd(+quote.getAdjustment()) },
                  {
                    value: (
                      <Checkbox
                        checked={this.state.selected.includes(quote.getId())}
                        value={quote.getId()}
                        onChange={this.handleSelect}
                      />
                    ),
                  },
                ]),
                [
                  {
                    value: (
                      <div style={{ textAlign: 'right' }}>
                        Your total reflects your currently selected services
                      </div>
                    ),
                  },
                  { value: <strong>Total: {usd(this.getTotal())}</strong> },
                  { value: '' },
                ],
              ]}
              skipPreLine
            />
            <Alert severity="warning">
              By signing this document, you certify that you have the authority
              to approve these repairs and that you are willing and able to
              furnish payment for the work to be completed upon completion of
              the work. You are also agreeing that you have read these terms and
              agree to hold Kalos Services, inc. harmless for warranties offered
              by the equipment manufacturer. Kalos Services, inc. offers a 1year
              labor warranty on workmanship but this does not include consumable
              items such as filters and bulbs. All additional warranties are
              offered by the respective equipment or parts manufacturers and
              subject to their terms. There is no warranty on refrigerant or
              refrigerant recharge.
            </Alert>
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'left',
                  margin: 16,
                }}
              >
                <Field
                  name="signature"
                  value=""
                  label="Sign Below"
                  type="signature"
                  onChange={this.sign}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'left',
                  margin: 16,
                }}
              >
                <Button
                  label={'Approve Proposal'}
                  onClick={this.toggleModal}
                  disabled={
                    !(
                      this.state.sigURL.length > 0 &&
                      this.state.selected.length > 0
                    )
                  }
                ></Button>
              </div>
            </div>
          </>
        )}
        <Confirm
          title="Approving Kalos Services"
          open={this.state.isOpen}
          onConfirm={this.finalize}
          onClose={this.toggleModal}
          submitDisabled={this.state.isLoading}
          maxWidth={800}
        >
          <Alert severity="info" style={{ marginBottom: 16 }}>
            You are approving Kalos Services to perform the following services
            for displayed total:
          </Alert>
          <InfoTable
            columns={[
              { name: 'Repair', width: -1 },
              { name: 'Price', width: 150, align: 'right' },
            ]}
            data={[
              ...this.state.quoteLines
                .filter(ql => this.state.selected.includes(ql.getId()))
                .map(quote => [
                  { value: quote.getDescription() },
                  { value: usd(+quote.getAdjustment()) },
                ]),
              [
                {
                  value: (
                    <>
                      <div>Signature:</div>
                      <img
                        src={this.state.sigURL}
                        alt="Signature"
                        style={{ width: 150 }}
                      />
                    </>
                  ),
                },
                { value: <strong>Total: {usd(this.getTotal())}</strong> },
              ],
            ]}
            skipPreLine
          />
        </Confirm>
      </PageWrapper>
    );
  }
}
