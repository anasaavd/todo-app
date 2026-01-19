function ConfirmModal({ show, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-lg font-semibold mb-4 text-center">
          ¿Eliminar tarea?
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6">
          ¿Estás segura de que deseas eliminar esta tarea?
        </p>

        <div className="flex justify-between gap-4">
          <button
            onClick={onCancel}
            className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
          >
            No
          </button>

          <button
            onClick={onConfirm}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Sí
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
