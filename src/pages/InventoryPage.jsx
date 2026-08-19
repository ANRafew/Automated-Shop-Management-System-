import { useEffect, useState } from "react";
import axios from "axios";

function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", image: "", wholesalePrice: "", mrp: "", quantity: "" });
  const [balance, setBalance] = useState(0);

  const [showPopup, setShowPopup] = useState(false);
  const [action, setAction] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [units, setUnits] = useState("");
  const [newWholesalePrice, setNewWholesalePrice] = useState("");
  const [newMrp, setNewMrp] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchBalance();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/inventory");
      setProducts(res.data.products || res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/balance");
      setBalance(res.data.currentBalance);
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  const addProduct = async () => {
    try {
      const res = await axios.post("http://localhost:5000/inventory/add", {
        ...form,
        wholesalePrice: Number(form.wholesalePrice),
        mrp: Number(form.mrp),
        quantity: Number(form.quantity),
      });
      alert(res.data.message);
      setForm({ name: "", image: "", wholesalePrice: "", mrp: "", quantity: "" });
      await fetchProducts();
      await fetchBalance();
    } catch (err) {
      if (err.response?.data?.error) {
        alert(err.response.data.error);
      }
    }
  };

  const openPopup = (type, product) => {
    setAction(type);
    setSelectedProduct(product);
    setUnits("");
    setNewWholesalePrice("");
    setNewMrp("");
    setShowPopup(true);
  };

  const handleConfirm = async () => {
    try {
      let res;
      if (action === "buy") {
        res = await axios.post("http://localhost:5000/inventory/buy", {
          productId: selectedProduct._id,
          units: Number(units),
        });
      } else if (action === "sell") {
        res = await axios.post("http://localhost:5000/inventory/sell", {
          productId: selectedProduct._id,
          units: Number(units),
        });
      } else if (action === "update") {
        res = await axios.post("http://localhost:5000/inventory/updatePrice", {
          productId: selectedProduct._id,
          newWholesalePrice: Number(newWholesalePrice),
          newMrp: Number(newMrp),
        });
      }

      alert(res.data.message);
      await fetchProducts();
      await fetchBalance();
      setShowPopup(false);
    } catch (err) {
      if (err.response?.data?.error) {
        alert(err.response.data.error);
      }
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-2 md:px-10 py-2">
      <h1 className="text-5xl text-center font-bold mb-6">Inventory</h1>

      <div className="grid grid-cols-2 gap-4 px-2 md:grid-cols-4 md:gap-8 md:px-10">
        {/* Product List */}
        <div className="grid md:grid-cols-3 md:col-span-3 md:gap-6 gap-3">
          {filteredProducts.map((p, i) => (
            <div key={i} className="bg-black rounded-lg shadow p-4 text-white">
              <img src={p.image} alt={p.name} className="h-40 w-full object-contain mb-4" />
              <h2 className="text-xl font-bold">{p.name}</h2>
              <p>💲 MRP: ৳{p.mrp} / unit</p>
              <p>📦 Quantity: {p.quantity}</p>

              <div className="grid grid-cols-3 gap-1 md:gap-2 mt-4">
                <button
                  onClick={() => openPopup("buy", p)}
                  className="bg-green-600 hover:bg-green-800 transition text-white px-3 py-1 rounded"
                >
                  Buy
                </button>
                <button
                  onClick={() => openPopup("sell", p)}
                  className="bg-red-600 hover:bg-red-800 transition text-white px-3 py-1 rounded"
                >
                  Sell
                </button>
                <button
                  onClick={() => openPopup("update", p)}
                  className="bg-blue-600 hover:bg-blue-800 transition text-white px-3 py-1 rounded"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Balance + Add Product */}
        <div className="col-span-1 sticky top-6 self-start">
          {/* Search Bar */}
          <div className="mb-3 p-4 bg-gray-600 rounded-lg text-white">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Balance */}
          <div className="mb-3 p-4 bg-gray-600 rounded-lg text-white">
            <h2 className="text-3xl font-bold">Current Balance</h2>
            <p className="text-2xl font-semibold">৳{balance}</p>
          </div>

          {/* Add Product */}
          <div className="mb-6 p-4 bg-gray-600 rounded-lg text-white">
            <h2 className="text-2xl font-bold mb-2">➕ Add Product (Buy)</h2>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="integer"
                placeholder="Price"
                value={form.wholesalePrice}
                onChange={(e) => setForm({ ...form, wholesalePrice: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="intger"
                placeholder="MRP"
                value={form.mrp}
                onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="integer"
                placeholder="Quantity"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="border p-2 rounded"
              />
              <button
                onClick={addProduct}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Add Product
              </button>
            </div>
          </div>
          <div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <i className="fa-regular fa-circle-up 
                fixed bottom-6 right-6 text-blue-900 text-5xl px-4 py-2 shadow-lg hover:text-blue-800 transition"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4">
              {action === "buy" && `Buy ${selectedProduct.name}`}
              {action === "sell" && `Sell ${selectedProduct.name}`}
              {action === "update" && `Update Prices for ${selectedProduct.name}`}
            </h2>
            <div className="mb-4 text-left text-2xl">
              <p className="font-semibold">💰 Current Balance: ৳{balance}</p>
              <p className="font-semibold">💲 Wholesale: ৳{selectedProduct.wholesalePrice}</p>
              <p className="font-semibold">💲 MRP: ৳{selectedProduct.mrp}</p>
            </div>

            {action === "update" ? (
              <>
                <input
                  type="integer"
                  placeholder="New Wholesale Price"
                  value={newWholesalePrice}
                  onChange={(e) => setNewWholesalePrice(e.target.value)}
                  className="border p-2 rounded w-full mb-4"
                />
                <input
                  type="integer"
                  placeholder="New MRP"
                  value={newMrp}
                  onChange={(e) => setNewMrp(e.target.value)}
                  className="border p-2 rounded w-full mb-4"
                />
              </>
            ) : (
              <input
                type="integer"
                placeholder="Units"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                className="border p-2 rounded w-full mb-4"
              />
            )}

            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-400 hover:bg-gray-500 transition text-white px-4 py-2 rounded"
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

export default InventoryPage;

