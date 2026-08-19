import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  title: { fontSize: 20, marginBottom: 10, textAlign: "center", fontWeight: "bold"},
  section: { marginBottom: 15 },
  Underline: { textDecoration: "underline", fontWeight: "bold" },
  highlightText: { backgroundColor: "yellow", fontWeight: "bold"},
  columnContainer: { flexDirection: "row", justifyContent: "space-between" },
  column: { width: "48%", padding: 10, border: "1pt solid #000" },
  summaryGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 20 },
  summaryCard: { width: "48%", margin: 5, padding: 10, border: "1pt solid #000", backgroundColor: "skyblue"},
  heading: { fontSize: 14, marginBottom: 5, fontWeight: "bold" }
});

const ReportPDF = ({ month, year, summary, groupedSell, groupedBuy, balance, totalDeposit, totalWithdrawal, totalInventory }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Monthly Report</Text>
      <Text style={styles.title}>{month}, {year}</Text>
      {/* Two Columns */}
      <View style={styles.columnContainer}>
        {/* Sell Transactions */}
        <View style={styles.column}>
          <Text style={styles.heading}>Sell Transactions</Text>
          {Object.entries(groupedSell).map(([date, txs]) => (
            <View key={date} style={styles.section}>
              <Text style={styles.Underline}>Date: {date}</Text>
              {txs.map((t, i) => (
                <Text key={i}>
                  {t.product} ({t.units}pcs) —— Tk. {t.totalRevenue}
                </Text>
              ))}
              <Text style={styles.highlightText}>
                Total: Tk. {txs.reduce((sum, t) => sum + (t.totalRevenue || 0), 0)} 
              </Text>
              <Text style={styles.highlightText}>
                Profit of the Day: Tk. {txs.reduce((sum, t) => sum + (t.totalRevenue - (t.units*t.wholesalePrice) || 0), 0)}
              </Text>
            </View>
          ))}
        </View>

        {/* Buy Transactions */}
        <View style={styles.column}>
          <Text style={styles.heading}>Buy Transactions</Text>
          {Object.entries(groupedBuy).map(([date, txs]) => (
            <View key={date} style={styles.section}>
              <Text style={styles.Underline}>Date: {date}</Text>
              {txs.map((t, i) => (
                <Text key={i}>
                  {t.product} ({t.units}pcs) —— Tk. {t.totalCost}
                </Text>
              ))}
              <Text style={styles.highlightText}>
                Total: Tk. {txs.reduce((sum, t) => sum + (t.totalCost || 0), 0)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.heading}>Total Sell</Text>
          <Text>Tk. {summary.totalSell}</Text>
          <Text style={styles.heading}>Total Profit For the Month</Text>
          <Text>Tk. {summary.totalprofit}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.heading}>Total Buy</Text>
          <Text>Tk. {summary.totalBuy}</Text>
          <Text style={styles.heading}>Current Total Inventory Cost</Text>
          <Text>Tk. {totalInventory}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.heading}>Deposit</Text>
          <Text>Tk. {totalDeposit}</Text>
          <Text style={styles.heading}>Withdrawal</Text>
          <Text>Tk. {totalWithdrawal}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.heading}>Balance</Text>
          <Text>Tk. {balance}</Text>
          <Text style={styles.heading}>Total Assets</Text>
          <Text>Tk. {balance+totalInventory}</Text>
        </View>
      </View>

      <footer>
        <Text>
            Printed on {`${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`} Automated Shop Management System
        </Text>
      </footer>
    </Page>
  </Document>
);

export default ReportPDF;
