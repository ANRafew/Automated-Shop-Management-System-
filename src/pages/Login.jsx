import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/login", form);
      const { role, uid } = res.data;

      // Saving user info in localStorage
      localStorage.setItem("user", JSON.stringify({ email: form.email, role, uid }));

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/staff");
      }
    } catch (err) {
      alert("Login failed: " + err.response?.data?.error);
    }
  };

  return (
    <div className="justify-items-center md:py-45 py-50
                    bg-cover bg-center bg-[url('/shopBG.jpg')] bg-black/40 bg-blend-overlay">
      <form 
      onSubmit={handleLogin} 
      className="border text-center md:w-100 w-80 rounded-xl bg-gray-800/95"
      >
        <h2 className="text-5xl font-bold text-center mt-5 mb-9">Login</h2>
        <div className="text-2xl text-center mb-3">
          <h2>  
            <input 
              name="email" 
              placeholder="Email" 
              onChange={handleChange}
              className="border rounded-xl px-3" 
            />
          </h2>
        </div>
        <div className="text-2xl text-center mb-3">
          <h2>
            <input 
              type="password"
              name="password" 
              placeholder="Password" 
              onChange={handleChange}
              className="border rounded-xl px-3" 
            />
          </h2>
        </div>
        <button
          type="submit"
          className="mb-6 p-2 text-2xl border rounded-xl bg-blue-600 hover:bg-blue-900 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
export default Login;