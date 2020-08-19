import React from 'react';
import Button from '@material-ui/core/Button';
import ReactPDF from '@react-pdf/renderer';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import Input from '@material-ui/core/Input';
//@ts-ignore
import SignaturePad from 'react-signature-pad-wrapper';
import { ReceiptAffadavit } from './components/ReceiptAffadavit';
import { RetrievableAffadavit } from './components/RetrievableAffadavit';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import { b64toBlob } from '../../helpers';
import Typography from '@material-ui/core/Typography';

// add any prop types here
interface props {
  dateStr: string;
  name: string;
  title: string;
  amount: string | number;
  vendor?: string;
  icon?: React.ReactNode;
  jobNumber?: string;
  onCreate?(file: Uint8Array): void;
  confirmText?: string;
  pdfType: PDFList;
}

// map your state here
interface state {
  isOpen: boolean;
  sigURL: string;
  vendor: string;
  purpose: string;
  jobNumber: string;
}

type PDFList =
  | 'Missing Receipt'
  | 'Retrievable Receipt'
  | 'Approved Proposal'
  | 'Pending Proposal';

export class PDFMaker extends React.PureComponent<props, state> {
  SigPad: React.RefObject<HTMLCanvasElement>;
  constructor(props: props) {
    super(props);
    this.state = {
      isOpen: false,
      sigURL: '',
      vendor: props.vendor || '',
      purpose: '',
      jobNumber: props.jobNumber || '',
    };
    this.SigPad = React.createRef();
    this.sign = this.sign.bind(this);
    this.saveAsPDF = this.saveAsPDF.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.updatePurpose = this.updatePurpose.bind(this);
    this.updateVendor = this.updateVendor.bind(this);
    this.clear = this.clear.bind(this);
  }

  sign() {
    console.log(this.SigPad);
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

  async saveAsPDF() {
    let confirmation = true;
    if (this.state.sigURL.length === 0) {
      confirmation = confirm(
        'Your PDF will be created without a signature, which will most likely lead to it being rejected. Continue?',
      );
    }

    if (confirmation) {
      const ThePDF =
        this.props.pdfType === 'Missing Receipt'
          ? ReceiptAffadavit
          : RetrievableAffadavit;
      const blob = await await ReactPDF.pdf(
        <ThePDF
          date={this.props.dateStr}
          vendor={this.state.vendor}
          name={this.props.name}
          purpose={this.state.purpose}
          sigURL={this.state.sigURL}
          amount={this.props.amount}
          jobNumber={this.state.jobNumber}
        />,
      ).toBlob();
      const fr = new FileReader();
      fr.onload = () => {
        if (this.props.onCreate) {
          this.props.onCreate(new Uint8Array(fr.result as ArrayBuffer));
          this.toggleModal();
        } else {
          const el = document.createElement('a');
          el.download = 'affadavit.pdf';
          el.href = URL.createObjectURL(blob);
          el.target = '_blank';
          el.click();
          el.remove();
        }
      };
      fr.readAsArrayBuffer(blob);
    }
  }

  toggleModal() {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
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

  updateVendor(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    this.setState(() => ({ vendor: value }));
  }

  updatePurpose(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    this.setState(() => ({ purpose: value }));
  }

  render() {
    return (
      <>
        <Button
          onClick={this.toggleModal}
          size="large"
          fullWidth
          style={{ height: 44, marginBottom: 10 }}
          startIcon={this.props.icon}
        >
          {this.props.title}
        </Button>
        <Dialog open={this.state.isOpen} onClose={this.toggleModal} fullScreen>
          <Paper style={{ height: '100%', width: '100%', padding: 15 }}>
            <Grid container direction="column" alignItems="stretch">
              <Grid
                container
                direction="row"
                style={{ marginBottom: 10 }}
                justify="center"
                alignItems="center"
              >
                <Grid item style={{ marginRight: 5 }}>
                  <InputLabel htmlFor="vendor-input">Vendor</InputLabel>
                  <Input
                    defaultValue={this.state.vendor}
                    inputProps={{ id: 'vendor-input' }}
                    onChange={this.updateVendor}
                  />
                </Grid>
                <Grid item style={{ marginLeft: 5, marginRight: 5 }}>
                  <InputLabel htmlFor="purchase-reason-input">
                    Purpose of Transaction
                  </InputLabel>
                  <Input
                    inputProps={{ id: 'purchase-reason-input' }}
                    onChange={this.updatePurpose}
                  />
                </Grid>
              </Grid>
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
                  {this.state.sigURL.length > 0 && (
                    <Button
                      onClick={this.clear}
                      variant="outlined"
                      style={{ marginBottom: 10, marginTop: 10 }}
                    >
                      Reset Signature
                    </Button>
                  )}
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                style={{ marginTop: 10 }}
              >
                <Button onClick={this.toggleModal} style={{ marginRight: 5 }}>
                  Cancel
                </Button>
                <Button onClick={this.saveAsPDF} style={{ marginLeft: 5 }}>
                  {this.props.confirmText || 'Create PDF'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Dialog>
      </>
    );
  }
}
