import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StaffPage() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);


  // Fetch balance on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resBalance = await axios.get("http://localhost:5000/admin/balance");
        setBalance(resBalance.data.currentBalance);

        const resHistory = await axios.get("http://localhost:5000/admin/transactions");
        setTransactions(resHistory.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const gotoInventory = () => {
    navigate("/inventory");
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
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
      </div>
    </div>
  );
}
export default StaffPage;
