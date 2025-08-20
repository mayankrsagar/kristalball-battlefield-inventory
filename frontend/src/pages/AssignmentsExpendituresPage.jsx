import { useState } from "react";

import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

import Modal from "../components/Modal";
import {
  useCreateAssignmentMutation,
  useCreateExpenditureMutation,
  useGetAssetsQuery,
  useGetAssignmentsQuery,
  useGetBasesQuery,
  useGetExpendituresQuery,
} from "../features/assignExp/assignExpApi";

export default function AssignmentsExpendituresPage() {
  const user = useSelector((s) => s.auth.user);
  const canCreate = ["Admin", "BaseCommander"].includes(user?.role);

  const [activeTab, setActiveTab] = useState("assign"); // 'assign' | 'expend'
  const [filters, setFilters] = useState({ baseId: "", start: "", end: "" });
  const [showModal, setShowModal] = useState(false);

  // RTK Query hooks
  const { data: assignments = [], isLoading: loadingA } =
    useGetAssignmentsQuery(filters);
  const { data: expenditures = [], isLoading: loadingE } =
    useGetExpendituresQuery(filters);
  const [createAssign, { isLoading: creatingA }] =
    useCreateAssignmentMutation();
  const [createExpend, { isLoading: creatingE }] =
    useCreateExpenditureMutation();
  const { data: bases = [] } = useGetBasesQuery();
  const { data: assets = [] } = useGetAssetsQuery();

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = Object.fromEntries(form.entries());
    payload.quantity = Number(payload.quantity);
    payload.date = new Date(payload.date).toISOString();
    payload.baseId = payload.baseId || user.baseId;
    payload.assignedTo =
      activeTab === "assign" ? payload.assignedTo : undefined;

    try {
      if (activeTab === "assign") await createAssign(payload);
      else await createExpend(payload);
      toast.success(
        `${activeTab === "assign" ? "Assignment" : "Expenditure"} recorded!`
      );
      setShowModal(false);
      e.target.reset();
    } catch (err) {
      toast.error(err?.data?.message || "Failed");
    }
  };

  const data = activeTab === "assign" ? assignments : expenditures;
  const isLoading = activeTab === "assign" ? loadingA : loadingE;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {activeTab === "assign" ? "Assignments" : "Expenditures"}
        </h1>
        {canCreate && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            New {activeTab === "assign" ? "Assignment" : "Expenditure"}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <button
          onClick={() => setActiveTab("assign")}
          className={`px-4 py-2 rounded-l ${
            activeTab === "assign" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Assignments
        </button>
        <button
          onClick={() => setActiveTab("expend")}
          className={`px-4 py-2 rounded-r ${
            activeTab === "expend" ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
        >
          Expenditures
        </button>
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
                {activeTab === "assign" && (
                  <th className="p-2 text-left">Assigned&nbsp;To</th>
                )}
                {activeTab === "expend" && (
                  <th className="p-2 text-left">Reason</th>
                )}
                <th className="p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row._id} className="border-b">
                  <td className="p-2">{row.assetId?.name}</td>
                  <td className="p-2">{row.baseId?.name}</td>
                  <td className="p-2">{row.quantity}</td>
                  {activeTab === "assign" && (
                    <td className="p-2">{row.assignedTo}</td>
                  )}
                  {activeTab === "expend" && (
                    <td className="p-2">{row.reason}</td>
                  )}
                  <td className="p-2">
                    {new Date(
                      row.assignmentDate || row.dateExpended
                    ).toLocaleDateString()}
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
          <h2 className="text-xl font-bold mb-4">
            New {activeTab === "assign" ? "Assignment" : "Expenditure"}
          </h2>
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
            {activeTab === "assign" && (
              <input
                name="assignedTo"
                placeholder="Personnel / Unit"
                required
                className="w-full border p-2 rounded"
              />
            )}
            {activeTab === "expend" && (
              <select
                name="reason"
                required
                className="w-full border p-2 rounded"
              >
                <option value="">Select Reason</option>
                <option>Used</option>
                <option>Damaged</option>
                <option>Expired</option>
              </select>
            )}
            <input
              name="date"
              type="date"
              required
              defaultValue={new Date().toISOString().slice(0, 10)}
              className="w-full border p-2 rounded"
            />
            <button
              type="submit"
              disabled={activeTab === "assign" ? creatingA : creatingE}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              {activeTab === "assign"
                ? creatingA
                  ? "Saving…"
                  : "Assign"
                : creatingE
                ? "Saving…"
                : "Record"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
