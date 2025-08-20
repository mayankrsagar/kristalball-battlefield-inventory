import { useState } from "react";

import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import { useRegisterMutation } from "../features/auth/authApi";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Admin",
    baseId: "",
  });
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success("Account created!");
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-sm p-6 bg-white rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
        <input
          name="name"
          placeholder="Full Name"
          className="w-full mb-3 p-3 border rounded"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 border rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-3 border rounded"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          className="w-full mb-3 p-3 border rounded"
          value={form.role}
          onChange={handleChange}
        >
          <option value="Admin">Admin</option>
          <option value="BaseCommander">Base Commander</option>
          <option value="LogisticsOfficer">Logistics Officer</option>
        </select>
        <input
          name="baseId"
          placeholder="Base ID (if not Admin)"
          className="w-full mb-4 p-3 border rounded"
          value={form.baseId}
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-3 rounded disabled:opacity-50"
        >
          {isLoading ? "Creating…" : "Register"}
        </button>
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
