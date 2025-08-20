import "./App.css";

import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./features/dashboard/Dashboard";
import AssignmentsExpendituresPage from "./pages/AssignmentsExpendituresPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PurchasesPage from "./pages/PurchasesPage";
import RegisterPage from "./pages/RegisterPage";
import TransferPage from "./pages/TransferPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/purchases" element={<PurchasesPage />} />
        <Route path="/transfers" element={<TransferPage />} />
        <Route
          path="/assign-expend"
          element={<AssignmentsExpendituresPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
