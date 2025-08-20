import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white p-6">
      <h1 className="text-5xl font-extrabold mb-4 text-center">
        Military Asset Management System
      </h1>
      <p className="text-lg mb-8 max-w-xl text-center">
        Streamline logistics, track assets, and ensure accountability across all
        bases.
      </p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
