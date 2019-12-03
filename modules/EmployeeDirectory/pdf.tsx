import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font
} from "@react-pdf/renderer";
import { User } from "@kalos-core/kalos-rpc/User";

const semiBold = require("./OpenSans-SemiBold.ttf");
const bold = require("./OpenSans-Bold.ttf");

const logo = require("./kalos-logo-2019.png");
Font.register({
  family: "Open-Sans-SemiBold",
  src: semiBold
});
Font.register({
  family: "OpenSans-Bold",
  src: bold
});
// Create styles
const styles = StyleSheet.create({
  body: {
    padding: 15
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: "white"
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    borderRightWidth: 1,
    borderStyle: "solid",
    borderColor: "#bfbfbf"
  },
  tableColHeader: {
    fontFamily: "OpenSans-Bold",
    width: "25%",
    height: 20,
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCol: {
    height: 25,
    width: "25%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0
  },
  tableCellHeader: {
    margin: "auto",
    fontSize: 12,
    fontWeight: 500
  },
  tableCell: {
    margin: "auto",
    fontSize: 10,
    fontFamily: "Open-Sans-SemiBold"
  },
  logo: {
    height: "auto",
    width: "60%",
    marginLeft: "auto",
    marginRight: "auto"
  }
});
interface props {
  users: User.AsObject[];
}
// Create Document Component
export const EmployeePDF = ({ users }: props) => {
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
    <Document>
      {pages.map((page, i) => (
        <Page size="LETTER" style={styles.body}>
          {i === 0 && <Image style={styles.logo} src={logo} />}

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, { width: "20%" }]}>
                <Text style={styles.tableCellHeader}>Name</Text>
              </View>
              <View style={[styles.tableColHeader, { width: "35%" }]}>
                <Text style={styles.tableCellHeader}>Title</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Email</Text>
              </View>
              <View style={[styles.tableColHeader, { width: "15%" }]}>
                <Text style={styles.tableCellHeader}>Phone #</Text>
              </View>
              <View style={[styles.tableColHeader, { width: "5%" }]}>
                <Text style={styles.tableCellHeader}>Ext</Text>
              </View>
            </View>
            {page.map(user => (
              <View style={styles.tableRow}>
                <View style={[styles.tableCol, { width: "20%" }]}>
                  <Text style={styles.tableCell}>
                    {user.firstname} {user.lastname}
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: "35%" }]}>
                  <Text style={styles.tableCell}>{user.empTitle}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{user.email}</Text>
                </View>
                <View style={[styles.tableCol, { width: "15%" }]}>
                  <Text style={styles.tableCell}>{user.phone}</Text>
                </View>
                <View style={[styles.tableCol, { width: "5%" }]}>
                  <Text style={styles.tableCell}>{user.ext}</Text>
                </View>
              </View>
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};
