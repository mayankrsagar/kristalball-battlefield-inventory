import { useState } from "react";

import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

import Modal from "../components/Modal";
import {
  useCreatePurchaseMutation,
  useGetAssetsQuery,
  useGetBasesQuery,
  useGetPurchasesQuery,
} from "../features/purchases/purchaseApi";

export default function PurchasesPage() {
  const user = useSelector((s) => s.auth.user);
  const canCreate = ["Admin", "LogisticsOfficer"].includes(user?.role);

  // Filters
  const [filters, setFilters] = useState({
    baseId: "",
    type: "",
    start: "",
    end: "",
  });

  // RTK Query
  const { data: purchases = [], isLoading } = useGetPurchasesQuery(filters);
  const [createPurchase, { isLoading: isCreating }] =
    useCreatePurchaseMutation();
  const { data: bases = [] } = useGetBasesQuery();
  const { data: assets = [] } = useGetAssetsQuery();

  // Modal state
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = Object.fromEntries(form.entries());
    payload.quantity = Number(payload.quantity);
    payload.purchaseDate = new Date(payload.purchaseDate).toISOString();
    payload.addedBy = user.id;

    try {
      await createPurchase(payload);
      toast.success("Purchase recorded!");
      setShowModal(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create purchase");
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Purchases</h1>
        {canCreate && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            New Purchase
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
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
          {bases.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
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

      {/* Table */}
      {isLoading ? (
        <p>Loading…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Asset</th>
                <th className="p-2 text-left">Base</th>
                <th className="p-2 text-left">Qty</th>
                <th className="p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="p-2">{p.assetId?.name}</td>
                  <td className="p-2">{p.baseId?.name}</td>
                  <td className="p-2">{p.quantity}</td>
                  <td className="p-2">
                    {new Date(p.purchaseDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2 className="text-xl font-bold mb-4">New Purchase</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              name="assetId"
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Select Asset</option>
              {assets.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </select>
            <select
              name="baseId"
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Select Base</option>
              {bases.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
            <input
              name="quantity"
              type="number"
              min="1"
              placeholder="Quantity"
              required
              className="w-full border p-2 rounded"
            />
            <input
              name="purchaseDate"
              type="date"
              required
              defaultValue={new Date().toISOString().slice(0, 10)}
              className="w-full border p-2 rounded"
            />
            <button
              type="submit"
              disabled={isCreating}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              {isCreating ? "Saving…" : "Save"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
