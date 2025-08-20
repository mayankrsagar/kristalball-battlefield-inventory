export default function DetailModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Net Movement Details</h2>
          <button onClick={onClose} className="text-2xl">
            &times;
          </button>
        </div>
        <p className="text-sm text-gray-600">Details coming soon…</p>
      </div>
    </div>
  );
}
