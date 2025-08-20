import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { logout } from "../store/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  // console.log("user in navbar", user);
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    navigate("/");
  };

  // Links by role
  const links = [];
  if (!token) return null; // hide navbar completely when not logged in

  // Common links
  links.push({ to: "/dashboard", label: "Dashboard" });

  if (user?.role === "Admin") {
    links.push(
      { to: "/purchases", label: "Purchases" },
      { to: "/transfers", label: "Transfers" },
      { to: "/assign-expend", label: "Assign/Expend" }
    );
  } else if (user?.role === "BaseCommander") {
    links.push(
      { to: "/transfers", label: "Transfers" },
      { to: "/assign-expend", label: "Assign/Expend" }
    );
  } else if (user?.role === "LogisticsOfficer") {
    links.push(
      { to: "/purchases", label: "Purchases" },
      { to: "/transfers", label: "Transfers" }
    );
  }

  return (
    <nav className="bg-slate-800 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold">
            MAMS
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex space-x-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 rounded-md hover:bg-slate-700 transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User section */}
          <div className="flex items-center space-x-4">
            <span className="text-sm hidden sm:block">
              👋 {user?.name} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm"
            >
              Logout
            </button>
          </div>

          {/* Mobile hamburger (optional) */}
          {/* You can add a drawer here later if needed */}
        </div>
      </div>
    </nav>
  );
}
