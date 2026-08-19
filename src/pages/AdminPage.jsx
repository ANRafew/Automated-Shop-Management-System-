import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminPage() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [totalInventory, setTotalInventory] = useState(0);
  const [products, setProducts] = useState([]);

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

  // Update balance (positive or negative)
  const updateBalance = async () => {
    try {
      const res = await axios.post("http://localhost:5000/admin/balance/update", {
        amount: Number(amount),
      });
      setBalance(res.data.currentBalance);
      setAmount("");
    } catch (err) {
      console.error("Error updating balance:", err);
    }
  };

  // ADD STAFF
  const addStaff = () => {
    navigate("/signup");
  };
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
      <p className="text-3xl py-3">Admin Dashboard</p>

    <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8 px-10 py-7">
      
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
      {/* update balance */}
      <div className="p-4 bg-gray-600 rounded-3xl inline-block hover:bg-gray-700 transition">
        <div className="my-4 flex justify-center gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount (+/-)"
            className="border p-2 rounded w-full"
          />
        </div>
        <button
            onClick={() => setShowConfirm(true)} // open popup instead of direct update
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Update Balance
        </button>
        <p className="px-1 text-xs">
          *Enter positive value to add and negative value to withdraw  
        </p>       
      </div>
      {/* Add Staff */}
      <button
        onClick={addStaff}
        className="py-10 bg-purple-600 rounded-3xl text-4xl text-white font-bold hover:bg-purple-900 transition"
      >
        New Staff
      </button>
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

{/* Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Confirm Transaction</h2>
            <p className="text-2xl">
              Are you sure you want to{" "}
              {Number(amount) >= 0 ? "deposit" : "withdraw"} ৳{Math.abs(amount)}?
            </p>
            <div className="mt-4 flex text-2xl justify-center gap-4">
              <button
                onClick={() => {
                  updateBalance();
                  setShowConfirm(false);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
export default AdminPage;