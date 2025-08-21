import { useState } from 'react';

import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

import { useLoginMutation } from '../features/auth/authApi';
import { setCredentials } from '../store/authSlice';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ email, password });
      dispatch(setCredentials({ token: data.token }));
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-sm p-6 bg-white rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password with eye */}
        <div className="relative mb-4">
          <input
            type={showPwd ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 pr-10 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
            onClick={() => setShowPwd(!showPwd)}
          >
            {showPwd ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded disabled:opacity-50"
        >
          {isLoading ? "Logging in…" : "Login"}
        </button>
      </form>
    </div>
  );
}
