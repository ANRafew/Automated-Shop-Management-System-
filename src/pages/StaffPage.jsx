import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StaffPage() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [totalInventory, setTotalInventory] = useState(0);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Fetch balance on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resBalance = await axios.get("http://localhost:5000/admin/balance");
        setBalance(resBalance.data.currentBalance);

        const resHistory = await axios.get("http://localhost:5000/admin/transactions");
        setTransactions(resHistory.data);

        const res = await axios.get("http://localhost:5000/inventory");
        const fetchedProducts = res.data.products || res.data;
        setProducts(fetchedProducts);
        let totalInventory = 0;
        fetchedProducts.forEach((t) => (totalInventory += (t.wholesalePrice * t.quantity) || 0));
        setTotalInventory(totalInventory);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const gotoInventory = () => {
    navigate("/inventory");
  }
  const gotoReport = () => {
    navigate("/report");
  }

  return (
    <div className="text-center min-h-155 py-5
                    bg-cover bg-center bg-[url('/shopBG01.jpg')] bg-black/40 bg-blend-overlay">
      <h1 className="text-5xl">Automated Shop Management System</h1>
      <p className="text-3xl py-3">Staff Dashboard</p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8 px-20 py-7">
        
        <button
          onClick={gotoInventory}
          className="py-10 bg-orange-600 rounded-3xl text-4xl text-white font-bold hover:bg-orange-900 transition"
        >
          Inventory
        </button>
        
        {/* Balance Section */}
        <div className="py-10  bg-gray-600 rounded-3xl inline-block hover:bg-gray-700 transition">
          <h2 className="text-2xl font-bold">🪙 Current Balance</h2>
          <p className="text-4xl font-semibold">৳{balance}</p>
        </div> 
        {/* Monthly report */}
        <button
          onClick={gotoReport}
          className="py-10 bg-sky-600 rounded-3xl text-4xl text-white font-bold hover:bg-sky-900 transition"
        >
          Monthly Report
        </button> 
        {/* assets */}
        <div className="py-10  bg-green-600 rounded-3xl inline-block hover:bg-green-700 transition">
          <h2 className="text-2xl font-bold">Total Assets</h2>
          <p className="text-4xl font-semibold">৳{balance+totalInventory}</p>
        </div>
      </div>
    </div>
  );
}
export default StaffPage;
