export default function MetricCard({ title, value, onClick }) {
  return (
    <div
      className={`bg-white p-4 rounded-xl shadow hover:shadow-lg cursor-pointer transition ${
        onClick ? "" : "cursor-default"
      }`}
      onClick={onClick}
    >
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">{value ?? "—"}</p>
    </div>
  );
}
