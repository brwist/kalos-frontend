// this files ts-ignore lines have been checked
import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import { QuoteLine } from '../../../@kalos-core/kalos-rpc/QuoteLine';
import { User } from '../../../@kalos-core/kalos-rpc/User';
import { Property } from '../../../@kalos-core/kalos-rpc/Property';
//@ts-ignore
import logo from '../../EmployeeDirectory/kalos-logo-2019.png';
import { timestamp } from '../../../helpers';

const styles = ReactPDF.StyleSheet.create({
  body: {
    padding: 15,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    justifyContent: 'space-between',
  },
  table: {
    //@ts-ignore
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: 'white',
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
    borderRightWidth: 1,
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
  },
  tableColHeader: {
    width: '25%',
    height: 20,
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 1,
  },
  tableCellHeader: {
    margin: 'auto',
    fontSize: 12,
    fontWeight: 500,
  },
  infoLine: {
    fontSize: 10,
    fontWeight: 400,
  },
  tableCell: {
    margin: 'auto',
    fontSize: 10,
    //fontFamily: 'Open-Sans-SemiBold',
  },
  logo: {
    height: 'auto',
    width: '50%',
  },
  image: {
    height: 'auto',
    width: '50%',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

interface props {
  sigURL: string;
  quoteLines: QuoteLine[];
  property: Property;
  name: string;
  jobNumber: number;
  total: number;
  notes: string;
}

export const ApprovedProposal = ({
  quoteLines,
  sigURL,
  property,
  jobNumber,
  name,
  total,
  notes,
}: props) => {
  return (
    <ReactPDF.Document>
      <ReactPDF.Page size="LETTER" style={styles.body}>
        <ReactPDF.View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <ReactPDF.View style={{ display: 'flex', flexDirection: 'column' }}>
            <ReactPDF.Text style={styles.infoLine}>
              Kalos Services
            </ReactPDF.Text>
            <ReactPDF.Text style={styles.infoLine}>
              236 Hatteras Ave
            </ReactPDF.Text>
            <ReactPDF.Text style={styles.infoLine}>
              Clermont, FL 34711
            </ReactPDF.Text>
            <ReactPDF.Text style={styles.infoLine}>
              office@kalosforida.com
            </ReactPDF.Text>
            <ReactPDF.Text style={styles.infoLine}>
              Phone: (352)-243-7099
            </ReactPDF.Text>
            <ReactPDF.Text style={styles.infoLine}>
              Fax: (352)-404-6907
            </ReactPDF.Text>
          </ReactPDF.View>
          <ReactPDF.Image style={styles.image} src={logo} />
          <ReactPDF.View style={{ display: 'flex', flexDirection: 'column' }}>
            <ReactPDF.Text style={styles.infoLine}>
              Date: {timestamp(true)}
            </ReactPDF.Text>
            <ReactPDF.Text style={styles.infoLine}>
              Job Number: {jobNumber}
            </ReactPDF.Text>
            <ReactPDF.Text style={styles.infoLine}>For: {name}</ReactPDF.Text>
            <ReactPDF.Text style={styles.infoLine}>
              {property.getAddress()}, {property.getCity()},{' '}
              {property.getState() || 'FL'}
            </ReactPDF.Text>
          </ReactPDF.View>
        </ReactPDF.View>
        {notes.length > 0 && (
          <ReactPDF.View style={styles.table}>
            <ReactPDF.View style={styles.tableRow}>
              <ReactPDF.View style={[styles.tableColHeader, { width: '100%' }]}>
                <ReactPDF.Text style={styles.tableCellHeader}>
                  Notes
                </ReactPDF.Text>
              </ReactPDF.View>
            </ReactPDF.View>
            <ReactPDF.View style={styles.tableRow}>
              <ReactPDF.View style={[styles.tableCol, { width: '100%' }]}>
                <ReactPDF.Text style={styles.tableCell}>{notes}</ReactPDF.Text>
              </ReactPDF.View>
            </ReactPDF.View>
          </ReactPDF.View>
        )}
        <ReactPDF.View style={styles.table}>
          <ReactPDF.View style={styles.tableRow}>
            <ReactPDF.View style={[styles.tableColHeader, { width: '80%' }]}>
              <ReactPDF.Text style={styles.tableCellHeader}>
                Description
              </ReactPDF.Text>
            </ReactPDF.View>
            <ReactPDF.View style={[styles.tableColHeader, { width: '20%' }]}>
              <ReactPDF.Text style={styles.tableCellHeader}>
                Price
              </ReactPDF.Text>
            </ReactPDF.View>
          </ReactPDF.View>
          {quoteLines.map(ql => (
            <ReactPDF.View
              style={styles.tableRow}
              key={`quote_line_pdf_row_${ql.getId()}`}
            >
              <ReactPDF.View style={[styles.tableCol, { width: '80%' }]}>
                <ReactPDF.Text style={styles.tableCell}>
                  {ql.getDescription()}
                </ReactPDF.Text>
              </ReactPDF.View>
              <ReactPDF.View style={[styles.tableCol, { width: '20%' }]}>
                <ReactPDF.Text style={styles.tableCell}>
                  ${ql.getAdjustment()}
                </ReactPDF.Text>
              </ReactPDF.View>
            </ReactPDF.View>
          ))}
        </ReactPDF.View>
        <ReactPDF.View
          style={[styles.row, { alignItems: 'flex-end', borderBottom: 2 }]}
        >
          <ReactPDF.Text>Your Signature: </ReactPDF.Text>
          {sigURL.length > 0 && (
            <ReactPDF.Image style={styles.image} src={sigURL} />
          )}
          <ReactPDF.Text>Total: ${total}</ReactPDF.Text>
        </ReactPDF.View>
        <ReactPDF.View style={styles.row}>
          <ReactPDF.Text style={{ fontSize: 10, fontWeight: 800, margin: 20 }}>
            By signing this document, you certify that you have the authority to
            approve these repairs and that you are able to furnish payment for
            the work to be completed. You are also agreeing that you have read
            these terms and agree to not hold Kalos Services, inc. responsible
            for warranties offered by the equipment manufacturer. Kalos
            Services, inc. offers a 1year labor warranty on all repairs. All
            additional warranties are offered by the respective equipment
            manufacturer.
          </ReactPDF.Text>
        </ReactPDF.View>
      </ReactPDF.Page>
    </ReactPDF.Document>
  );
};
