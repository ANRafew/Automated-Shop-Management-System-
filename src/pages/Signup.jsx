import { useState } from "react";
import axios from "axios";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/signup", form);
      alert("Signup successful: Provide the credintial to your staff");
    } catch (err) {
      alert("Signup failed: " + err.response?.data?.error);
    }
  };

  return (
    <div className="justify-items-center py-45
                    bg-cover bg-center bg-[url('/shopBG.jpg')] bg-black/40 bg-blend-overlay">
    <form 
    onSubmit={handleSignup} 
    className="border text-center md:w-100 w-80 rounded-xl bg-gray-800/95"
    >
      <h2 className="text-5xl font-bold text-center mt-5 mb-9">Staff Signup</h2>
      <div className="text-2xl text-center mb-4">
        <input 
            name="name" 
            placeholder="Name" 
            onChange={handleChange}
            className="border rounded-lg md:px-3" 
        />
      </div>
      <div className="text-2xl text-center mb-4">
        <input 
          name="email" 
          placeholder="Email" 
          onChange={handleChange}
          className="border rounded-lg md:px-3" 
        />
        
      </div>
      <div className="text-2xl text-center mb-4">
        <h2>
          <input 
            type="password"
            name="password" 
            placeholder="Password" 
            onChange={handleChange}
            className="border rounded-lg md:px-3" 
          />
        </h2>
      </div>
      <button
        type="submit"
        className="mb-6 p-2 text-2xl border rounded-xl bg-blue-600 hover:bg-blue-900 transition"
      >
        Add Staff
      </button>
    </form>
  </div>
  );
}
export default Signup;