import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReportPDF from "../components/reportPDF";
import axios from "axios";

function MonthlyReport() {
  const [groupedSell, setGroupedSell] = useState({});
  const [groupedBuy, setGroupedBuy] = useState({});
  const [balance, setBalance] = useState(0);
  const [totalInventory, setTotalInventory] = useState(0);
  const [products, setProducts] = useState([]);
  const [adminTransactions, setAdminTransactions] = useState([]);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalWithdrawal, setTotalWithdrawal] = useState(0);
  const [summary, setSummary] = useState({
    totalSell: 0,
    totalprofit: 0,
    totalBuy: 0
  });

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  useEffect(() => {
    fetchTransactions();
    fetchAdminTransactions();
    fetchProducts();
    fetchBalance();
  }, [selectedMonth, selectedYear]);

  const fetchBalance = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/balance");
      setBalance(res.data.currentBalance);
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };
  const fetchAdminTransactions = async () => {
  try {
    const res = await axios.get("http://localhost:5000/admin/transactions");
    const fetchedTransactions = res.data.adminTransactions || res.data;

    setAdminTransactions(fetchedTransactions);

    // assume you already have selectedMonth and selectedYear in state
    const deposits = fetchedTransactions.filter((t) => {
      const d = new Date(t.date);
      return (
        t.type === "deposit" &&
        d.getMonth() === selectedMonth &&
        d.getFullYear() === selectedYear
      );
    });

    const withdrawals = fetchedTransactions.filter((t) => {
      const d = new Date(t.date);
      return (
        t.type === "withdrawal" &&
        d.getMonth() === selectedMonth &&
        d.getFullYear() === selectedYear
      );
    });

    // sum amounts
    let depositTotal = 0;
    deposits.forEach((t) => (depositTotal += t.amount || 0));

    let withdrawalTotal = 0;
    withdrawals.forEach((t) => (withdrawalTotal += t.amount || 0));

    setTotalDeposit(depositTotal);
    setTotalWithdrawal(withdrawalTotal);

  } catch (err) {
    console.error("Error fetching admin transactions:", err);
  }
};


  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/inventory");
      const fetchedProducts = res.data.products || res.data;
      setProducts(fetchedProducts);
      let totalInventory = 0;
      fetchedProducts.forEach((t) => (totalInventory += (t.wholesalePrice * t.quantity) || 0));
      setTotalInventory(totalInventory);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/Transactions");
      const allTransactions = res.data.Transactions || res.data;

      const startOfMonth = new Date(selectedYear, selectedMonth, 1);
      const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

      const monthlyTransactions = allTransactions.filter(t => {
        const txDate = new Date(t.date);
        return txDate >= startOfMonth && txDate <= endOfMonth;
      });

      const sells = monthlyTransactions.filter((t) => t.type === "sell");
      const buys = monthlyTransactions.filter((t) => t.type === "buy");

      let totalSell = 0, totalBuy = 0, totalprofit=0, totalDeposit = 0, totalWithdrawal = 0;
      sells.forEach((t) => (totalSell += t.totalRevenue || 0));
      sells.forEach((t) => (totalprofit += t.totalRevenue - (t.units * t.wholesalePrice) || 0));
      buys.forEach((t) => (totalBuy += t.totalCost || 0));

      monthlyTransactions.forEach((t) => {
        if (t.type === "deposit") totalDeposit += t.amount || 0;
        if (t.type === "withdrawal") totalWithdrawal += t.amount || 0;
      });

      const groupedSell = sells.reduce((acc, t) => {
        const dateKey = new Date(t.date).toLocaleDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(t);
        return acc;
      }, {});

      const groupedBuy = buys.reduce((acc, t) => {
        const dateKey = new Date(t.date).toLocaleDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(t);
        return acc;
      }, {});

      setGroupedSell(groupedSell);
      setGroupedBuy(groupedBuy);

      setSummary({
        totalSell,
        totalprofit,
        totalBuy
      });
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  return (
    <div className="px-6 py-8">
      <div id="report">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            📅 Monthly Report ({monthNames[selectedMonth]} {selectedYear})
          </h1>

          {/* Month/Year Selector */}
          <div className="flex gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="border p-2 rounded bg-gray-800"
            >
              {monthNames.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border p-2 rounded bg-gray-800"
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
          </div>
        </div>

        {/* Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Sell Transactions */}
          <div className="bg-gray-800 text-white p-3 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">🟥 Sell Transactions</h2>
            {Object.entries(groupedSell).map(([date, txs]) => (
              <div key={date} className="border p-6 rounded-xl mb-3">
                <h3 className="text-2xl font-bold mb-2">Date: {date}</h3>
                <ul className="space-y-2">
                  {txs.map((t, i) => (
                    <li key={i} className="border-b border-gray-600 pb-2">
                      <p>{t.product} ({t.units}pcs) —— ৳{t.totalRevenue}</p>
                    </li>
                  ))}
                </ul>
                <h3 className="text-2xl font-bold mb-2">
                  Total Sell: ৳{txs.reduce((sum, t) => sum + (t.totalRevenue || 0), 0)} <br />
                  Profit of the Day: ৳{txs.reduce((sum, t) => sum + (t.totalRevenue - (t.units*t.wholesalePrice) || 0), 0)}
                </h3>
              </div>
            ))}
          </div>

          {/* Buy Transactions */}
          <div className="bg-gray-800 text-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">🟩 Buy Transactions</h2>
            {Object.entries(groupedBuy).map(([date, txs]) => (
              <div key={date} className="border p-6 rounded-xl mb-3">
                <h3 className="text-2xl font-bold mb-2">Date: {date}</h3>
                <ul className="space-y-2">
                  {txs.map((t, i) => (
                    <li key={i} className="border-b border-gray-600 pb-2">
                      <p>{t.product} ({t.units}pcs) —— ৳{t.totalCost}</p>
                    </li>
                  ))}
                </ul>
                <h3 className="text-2xl font-bold mb-2">
                  Total Cost: ৳{txs.reduce((sum, t) => sum + (t.totalCost || 0), 0)}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-red-600 text-white p-4 rounded-lg">
            <h2 className="text-lg font-bold">Total Sell</h2>
            <p className="text-3xl font-bold">৳{summary.totalSell}</p>
            <h2 className="text-lg font-bold">Total Profit for the Month:</h2>
            <p className="text-3xl font-bold">৳{summary.totalprofit}</p>
          </div>
          <div className="bg-green-600 text-white p-4 rounded-lg">
            <h2 className="text-lg font-bold">Total Buy</h2>
            <p className="text-3xl font-bold">৳{summary.totalBuy}</p>
            <h2 className="text-lg font-bold">Current Total Inventory Cost</h2>
            <p className="text-3xl font-bold">৳{totalInventory}</p>
          </div>
          <div className="bg-yellow-600 text-white p-4 rounded-lg">
            <h2 className="text-lg font-bold">Deposit</h2>
            <p className="text-3xl font-bold">৳{totalDeposit}</p>
            <h2 className="text-lg font-bold">Withdrawal</h2>
            <p className="text-3xl font-bold">৳{totalWithdrawal}</p>
          </div>
          <div className="bg-blue-600 text-white p-4 rounded-lg">
            <h2 className="text-lg font-bold">Balance:</h2>
            <p className="text-3xl font-bold">৳{balance}</p>
            <h2 className="text-lg font-bold">Total Assets:</h2>
            <p className="text-3xl font-bold">৳ {balance+totalInventory}</p>
          </div>
        </div>
      </div>

      {/* Download PDF */}
      <div className="text-center p-7">
        <PDFDownloadLink
          document={
            <ReportPDF
              month={monthNames[selectedMonth]}
              year={selectedYear}
              summary={summary}
              totalDeposit={totalDeposit}
              totalWithdrawal={totalWithdrawal}
              groupedSell={groupedSell}
              groupedBuy={groupedBuy}
              totalInventory={totalInventory}
              balance={balance}
            />
          }
          fileName="MonthlyReport.pdf"
          className="border rounded-xl p-2 font-semibold hover:bg-gray-500 transition"
        >
          {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
        </PDFDownloadLink>
      </div>
      
      {/* Top Down buttons */} 
      <div> 
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} > 
          <i className="fa-regular fa-circle-up fixed bottom-6 left-6 text-blue-900 text-5xl px-4 py-2 hover:text-blue-800 transition"></i> 
        </button> 
      </div> 
      <div> 
        <button onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: "smooth" })} > 
          <i className="fa-regular fa-circle-down fixed bottom-6 right-6 text-blue-900 text-5xl px-4 py-2 hover:text-blue-800 transition"></i> 
        </button>
      </div> 

    </div>
  );
}

export default MonthlyReport;
