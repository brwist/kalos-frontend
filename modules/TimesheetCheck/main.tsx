import React from 'react';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { TransactionClient } from '@kalos-core/kalos-rpc/Transaction';
import customTheme from '../Theme/main';
import Paper from '@material-ui/core/Paper';
const { COLORS } = require('../../constants');

interface props {
  userID: number;
}

interface state {
  hasReceiptsIssue: boolean;
  receiptsIssueStr: string;
}

const overlay: React.CSSProperties = {
  backgroundColor: 'grey',
  position: 'absolute',
  opacity: 0.2,
  zIndex: 100,
  height: window.innerHeight,
  width: window.innerWidth,
};

const modal: React.CSSProperties = {
  position: 'absolute',
  zIndex: 300,
  height: 200,
  width: 200,
  top: '50%',
  left: '50%',
  marginLeft: -100,
  marginTop: -100,
  borderRadius: 4,
  //background: COLORS.dark2,
  //color: COLORS.light2,
  //boxShadow: '0px 8px 16px #00000052',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-evenly',
};

export class TimesheetCheck extends React.PureComponent<props, state> {
  TxnClient: TransactionClient;
  constructor(props: props) {
    super(props);
    this.state = {
      hasReceiptsIssue: false,
      receiptsIssueStr: '',
    };
    const endpoint = 'https://core-dev.kalosflorida.com:8443';
    this.TxnClient = new TransactionClient(endpoint);
    this.handleCheck = this.handleCheck.bind(this);
  }

  async handleCheck() {
    const [hasIssue, issueStr] = await this.TxnClient.timesheetCheck(
      this.props.userID,
    );
    this.setState({
      hasReceiptsIssue: hasIssue,
      receiptsIssueStr: issueStr,
    });
  }

  componentDidUpdate() {
    if (this.state.hasReceiptsIssue) {
      document.body.style.overflow = 'hidden';
    }
  }

  async componentDidMount() {
    await this.TxnClient.GetToken('test', 'test');
    await this.handleCheck();
  }

  render() {
    return (
      <ThemeProvider theme={customTheme}>
        <div style={this.state.hasReceiptsIssue ? overlay : {}} />
        {this.state.receiptsIssueStr && (
          <Paper style={modal} elevation={20}>
            <Typography align="center">
              {this.state.receiptsIssueStr}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href="https://app.kalosflorida.com/index.cfm?action=admin:reports.transactions"
            >
              Go To Receipts
            </Button>
          </Paper>
        )}
      </ThemeProvider>
    );
  }
}
