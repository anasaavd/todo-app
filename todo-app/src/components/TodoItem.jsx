import { useState } from "react";

function TodoItem({ todo, onToggle, onAskDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [startDate, setStartDate] = useState(todo.startDate);
  const [time, setTime] = useState(todo.time);
  const [note, setNote] = useState(todo.note || "");

  // 🟡🔴 CÁLCULO DE ESTADO DE TIEMPO
  const getTimeStatus = () => {
    if (todo.completed) return "normal";
    if (!todo.startDate || !todo.time) return "normal";

    const now = new Date();
    const taskDate = new Date(`${todo.startDate}T${todo.time}`);
    const diffMinutes = (taskDate - now) / 60000;

    if (diffMinutes <= 0) return "late";
    if (diffMinutes <= 10) return "soon";
    return "normal";
  };

  const timeStatus = getTimeStatus();

  const handleSave = () => {
    if (!title || !startDate || !time) {
      alert("Campos obligatorios");
      return;
    }
    onEdit(todo.id, title, startDate, time, note);
    setIsEditing(false);
  };

  const priorityStars =
    todo.priority === "high"
      ? "⭐⭐⭐"
      : todo.priority === "medium"
      ? "⭐⭐"
      : "⭐";

  return (
    <div className="relative group">
      <div
        className={`rounded-2xl p-5 shadow-md border transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
          ${
            timeStatus === "soon"
              ? "bg-yellow-50 border-yellow-400"
              : timeStatus === "late"
              ? "bg-red-50 border-red-500 animate-pulse"
              : "bg-white/70 border-white/40"
          }
          ${todo.completed ? "opacity-60" : ""}
        `}
      >
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h3
              className={`text-lg font-semibold ${
                todo.completed ? "line-through text-gray-400" : ""
              }`}
            >
              {todo.title}
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              📅 {todo.startDate} ⏰ {todo.time}
            </p>
          </div>

          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id, todo.completed)}
            className="h-5 w-5 accent-indigo-600"
          />
        </div>

        {/* NOTE */}
        {todo.note && (
          <p className="text-sm text-gray-600 mt-2 italic">
            📝 {todo.note}
          </p>
        )}

        {/* FILE */}
        {todo.fileURL && (
          <div
            onClick={() => window.open(todo.fileURL)}
            className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full mt-3 cursor-pointer hover:bg-indigo-200 transition"
          >
            📎 {todo.fileName}
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-yellow-500">{priorityStars}</span>

          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={() => setIsEditing(true)}
              className="text-indigo-600 hover:scale-110 transition"
            >
              ✏️
            </button>
            <button
              onClick={() => onAskDelete(todo.id)}
              className="text-red-500 hover:scale-110 transition"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="absolute inset-0 bg-white rounded-2xl p-4 shadow-xl z-10">
          <div className="space-y-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2 border rounded"
              rows="3"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-indigo-600 text-white rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoItem;
