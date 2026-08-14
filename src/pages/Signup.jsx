import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/signup", form);
      alert("Signup successful: You Can Now Login as Staff");
    } catch (err) {
      alert("Signup failed: " + err.response?.data?.error);
    }
  };

  return (
    <form onSubmit={handleSignup} style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Signup (Staff only)</h2>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <button type="submit">Signup</button>
    </form>
  );
}
