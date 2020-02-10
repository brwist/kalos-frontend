import React from 'react';
import ReactPDF from '@react-pdf/renderer';

const styles = ReactPDF.StyleSheet.create({
  body: {
    padding: 15,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'stretch',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  halfRow: {
    display: 'flex',
    width: '48%',
    flexDirection: 'row',
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
});

interface props {
  date: string;
  name: string;
  vendor: string;
  jobNumber?: string | number;
  purpose: string;
  sigURL: string;
  amount: string | number;
}

export const ReceiptAffadavit = (props: props) => {
  return (
    <ReactPDF.Document>
      <ReactPDF.Page size={{ width: 792, height: 612 }} style={styles.body}>
        <ReactPDF.View style={styles.row}>
          <ReactPDF.Text style={{ textAlign: 'center', fontSize: 22 }}>
            KALOS MISSING RECEIPT AFFADAVIT
          </ReactPDF.Text>
        </ReactPDF.View>
        <ReactPDF.View style={styles.row}>
          <ReactPDF.View style={styles.halfRow}>
            <ReactPDF.Text style={[styles.underline, styles.marginRight10]}>
              PURCHASE DATE:
            </ReactPDF.Text>
            <ReactPDF.Text>{props.date}</ReactPDF.Text>
          </ReactPDF.View>
          <ReactPDF.View style={styles.halfRow}>
            <ReactPDF.Text style={[styles.underline, styles.marginRight10]}>
              EMPLOYEE NAME:
            </ReactPDF.Text>
            <ReactPDF.Text>{props.name}</ReactPDF.Text>
          </ReactPDF.View>
        </ReactPDF.View>

        <ReactPDF.View style={styles.row}>
          <ReactPDF.Text style={[styles.underline, styles.marginRight10]}>
            PURCHASED FROM (VENDOR):
          </ReactPDF.Text>
          <ReactPDF.Text>{props.vendor}</ReactPDF.Text>
        </ReactPDF.View>
        <ReactPDF.View style={styles.row}>
          <ReactPDF.View style={styles.halfRow}>
            <ReactPDF.Text style={[styles.underline, styles.marginRight10]}>
              AMOUNT:
            </ReactPDF.Text>
            <ReactPDF.Text>{props.amount}</ReactPDF.Text>
          </ReactPDF.View>
          {props.jobNumber && (
            <ReactPDF.View style={styles.halfRow}>
              <ReactPDF.Text style={[styles.underline, styles.marginRight10]}>
                JOB #:
              </ReactPDF.Text>
              <ReactPDF.Text>{props.jobNumber}</ReactPDF.Text>
            </ReactPDF.View>
          )}
        </ReactPDF.View>
        <ReactPDF.View style={styles.row}>
          <ReactPDF.Text style={[styles.underline, styles.marginRight10]}>
            PURPOSE OF TRANSACTION:
          </ReactPDF.Text>
          <ReactPDF.Text>{props.purpose}</ReactPDF.Text>
        </ReactPDF.View>
        <ReactPDF.View style={styles.row}>
          <ReactPDF.Text style={{ fontSize: 12 }}>
            By signing this document I attest that I made this purchase and this
            transaction is a legitimate business transaction for Kalos business
            as stated and was unintentionally and un‐retrievably lost. I
            understand that the business credit card is only for legitimate
            expenses incurred to accomplish the business of Kalos Services Inc.
          </ReactPDF.Text>
        </ReactPDF.View>
        <ReactPDF.View style={[styles.row, styles.underline]}>
          <ReactPDF.Text>SIGNATURE: </ReactPDF.Text>
          {props.sigURL.length > 0 && (
            <ReactPDF.Image style={styles.image} src={props.sigURL} />
          )}
        </ReactPDF.View>
      </ReactPDF.Page>
    </ReactPDF.Document>
  );
};
