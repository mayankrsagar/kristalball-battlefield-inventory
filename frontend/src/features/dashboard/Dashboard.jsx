import { useState } from "react";

import DetailModal from "../../components/DetailModal";
import MetricCard from "../../components/MetricCard";
import { useGetDashboardQuery } from "./dashboardApi";

export default function Dashboard() {
  const [filters, setFilters] = useState({
    baseId: "",
    type: "",
    start: "",
    end: "",
  });
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading, isError } = useGetDashboardQuery(filters);
  const metrics = data || {};

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  if (isLoading) return <p className="p-6">Loading…</p>;
  if (isError)
    return <p className="p-6 text-red-600">Error loading dashboard</p>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Asset Dashboard</h1>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input
          name="start"
          type="date"
          className="border p-2 rounded"
          onChange={handleChange}
        />
        <input
          name="end"
          type="date"
          className="border p-2 rounded"
          onChange={handleChange}
        />
        <select
          name="baseId"
          className="border p-2 rounded"
          onChange={handleChange}
        >
          <option value="">All Bases</option>
        </select>
        <select
          name="type"
          className="border p-2 rounded"
          onChange={handleChange}
        >
          <option value="">All Types</option>
          <option>Weapon</option>
          <option>Vehicle</option>
          <option>Ammunition</option>
        </select>
      </div>

      {/* KPIs */}
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Opening Balance"
          value={metrics.openingBalance ?? 0}
        />
        <MetricCard
          title="Closing Balance"
          value={metrics.closingBalance ?? 0}
        />
        <MetricCard
          title="Net Movement"
          value={metrics.netMovement ?? 0}
          onClick={() => setShowModal(true)}
        />
        <MetricCard title="Assigned" value={metrics.assigned ?? 0} />
        <MetricCard title="Expended" value={metrics.expended ?? 0} />
      </div>

      {showModal && <DetailModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
