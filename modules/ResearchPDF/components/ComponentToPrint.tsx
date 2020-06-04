import React, { forwardRef } from 'react';

const styles = {
  body: {
    padding: 15,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    width: 792,
    height: 612,
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
  },
  halfRow: {
    display: 'flex',
    width: '48%',
  },
  underline: {
    borderBottom: 3,
  },
  image: {
    height: 200,
    width: 400,
  },
  marginRight10: {
    marginRight: 10,
  },
};

type TextProps = {
  children: string | number;
  underlined?: boolean,
  style?: any,
};

const Text = ({ children, underlined, style }: TextProps) => (
  <span style={underlined ? { ...styles.underline, ...styles.marginRight10 } : style}>
    {children}
  </span>
);

type Props = {
  date: string,
  name: string,
  vendor: string,
  amount: number,
  jobNumber: number,
  purpose: string,
  sigURL: string,
};

const ComponentToPrint = forwardRef(({
  date = '2020-01-12',
  name = 'PDF Report Name',
  vendor = 'Vendor name',
  amount = 1002.99,
  jobNumber = 666,
  purpose = 'Purpose',
  sigURL = 'http://signature-film.com/assets/img/x2/logo_sign.png'
}: Props, ref) => {
  return (
    <div style={styles.body} ref={ref}>
      <div style={styles.row}>
        <div style={{ textAlign: 'center', fontSize: 22 }}>
          KALOS MISSING RECEIPT AFFADAVIT
        </div>
      </div>
      <div style={styles.row}>
        <div style={styles.halfRow}>
          <Text underlined>
            PURCHASE DATE:
          </Text>
          <Text>{date}</Text>
        </div>
        <div style={styles.halfRow}>
          <Text underlined>
            EMPLOYEE NAME:
          </Text>
          <Text>{name}</Text>
        </div>
      </div>

      <div style={styles.row}>
        <Text underlined>
          PURCHASED FROM (VENDOR):
        </Text>
        <Text>{vendor}</Text>
      </div>
      <div style={styles.row}>
        <div style={styles.halfRow}>
          <Text underlined>
            AMOUNT:
          </Text>
          <Text>{amount}</Text>
        </div>
        {jobNumber && (
          <div style={styles.halfRow}>
            <Text underlined>
              JOB #:
            </Text>
            <Text>{jobNumber}</Text>
          </div>
        )}
      </div>
      <div style={styles.row}>
        <Text underlined>
          PURPOSE OF TRANSACTION:
        </Text>
        <Text>{purpose}</Text>
      </div>
      <div style={styles.row}>
        <Text style={{ fontSize: 12 }}>
          By signing this document I attest that I made this purchase and this
          transaction is a legitimate business transaction for Kalos business
          as stated and was unintentionally and un‐retrievably lost. I
          understand that the business credit card is only for legitimate
          expenses incurred to accomplish the business of Kalos Services Inc.
        </Text>
      </div>
      <div style={{ ...styles.row, ...styles.underline }}>
        <Text>SIGNATURE: </Text>
        {sigURL.length > 0 && (
          <img style={styles.image} src={sigURL} />
        )}
      </div>
    </div>
  );
});

export default ComponentToPrint;