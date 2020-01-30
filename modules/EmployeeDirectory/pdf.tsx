import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import { User } from '@kalos-core/kalos-rpc/User';
//@ts-ignore
import logo from './kalos-logo-2019.png';
/*
const semiBold = require('./OpenSans-SemiBold.ttf');
const bold = require('./OpenSans-Bold.ttf');
const logo = require('./kalos-logo-2019.png');
Font.register({
  family: 'Open-Sans-SemiBold',
  src: semiBold,
});
Font.register({
  family: 'OpenSans-Bold',
  src: bold,
});*/
// Create styles
const styles = ReactPDF.StyleSheet.create({
  body: {
    padding: 15,
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
    //fontFamily: 'OpenSans-Bold',
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
    height: 25,
    width: '25%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  tableCellHeader: {
    margin: 'auto',
    fontSize: 12,
    fontWeight: 500,
  },
  tableCell: {
    margin: 'auto',
    fontSize: 10,
    //fontFamily: 'Open-Sans-SemiBold',
  },
  logo: {
    height: 'auto',
    width: '60%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
interface props {
  users: User.AsObject[];
}
// Create Document Component
const EmployeePDF = ({ users }: props) => {
  const pages = [];
  const pageCount = Math.ceil((users.length - 25) / 29) + 1; //ciel rounds up
  while (pages.length !== pageCount) {
    let offset = pages.length === 0 ? 25 : 29;
    let start = pages.length * offset;
    let end = (pages.length + 1) * offset;
    let page = users.slice(start, end);
    pages[pages.length] = page;
  }
  return (
    <ReactPDF.Document>
      {pages.map((page, i) => (
        <ReactPDF.Page size="LETTER" style={styles.body}>
          {i === 0 && <ReactPDF.Image style={styles.logo} src={logo} />}

          <ReactPDF.View style={styles.table}>
            <ReactPDF.View style={styles.tableRow}>
              <ReactPDF.View style={[styles.tableColHeader, { width: '20%' }]}>
                <ReactPDF.Text style={styles.tableCellHeader}>
                  Name
                </ReactPDF.Text>
              </ReactPDF.View>
              <ReactPDF.View style={[styles.tableColHeader, { width: '35%' }]}>
                <ReactPDF.Text style={styles.tableCellHeader}>
                  Title
                </ReactPDF.Text>
              </ReactPDF.View>
              <ReactPDF.View style={styles.tableColHeader}>
                <ReactPDF.Text style={styles.tableCellHeader}>
                  Email
                </ReactPDF.Text>
              </ReactPDF.View>
              <ReactPDF.View style={[styles.tableColHeader, { width: '15%' }]}>
                <ReactPDF.Text style={styles.tableCellHeader}>
                  Phone #
                </ReactPDF.Text>
              </ReactPDF.View>
              <ReactPDF.View style={[styles.tableColHeader, { width: '5%' }]}>
                <ReactPDF.Text style={styles.tableCellHeader}>
                  Ext
                </ReactPDF.Text>
              </ReactPDF.View>
            </ReactPDF.View>
            {page.map(user => (
              <ReactPDF.View style={styles.tableRow}>
                <ReactPDF.View style={[styles.tableCol, { width: '20%' }]}>
                  <ReactPDF.Text style={styles.tableCell}>
                    {user.firstname} {user.lastname}
                  </ReactPDF.Text>
                </ReactPDF.View>
                <ReactPDF.View style={[styles.tableCol, { width: '35%' }]}>
                  <ReactPDF.Text style={styles.tableCell}>
                    {user.empTitle}
                  </ReactPDF.Text>
                </ReactPDF.View>
                <ReactPDF.View style={styles.tableCol}>
                  <ReactPDF.Text style={styles.tableCell}>
                    {user.email}
                  </ReactPDF.Text>
                </ReactPDF.View>
                <ReactPDF.View style={[styles.tableCol, { width: '15%' }]}>
                  <ReactPDF.Text style={styles.tableCell}>
                    {user.phone}
                  </ReactPDF.Text>
                </ReactPDF.View>
                <ReactPDF.View style={[styles.tableCol, { width: '5%' }]}>
                  <ReactPDF.Text style={styles.tableCell}>
                    {user.ext}
                  </ReactPDF.Text>
                </ReactPDF.View>
              </ReactPDF.View>
            ))}
          </ReactPDF.View>
        </ReactPDF.Page>
      ))}
    </ReactPDF.Document>
  );
};

export { EmployeePDF };
