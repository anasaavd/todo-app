import { useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !startDate || !time) {
      alert("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);

    try {
      let fileURL = null;
      let fileName = null;

      if (file) {
        const fileRef = ref(
          storage,
          `files/${Date.now()}_${file.name}`
        );

        await uploadBytes(fileRef, file);
        fileURL = await getDownloadURL(fileRef);
        fileName = file.name;
      }

      await onAdd({
        title,
        startDate,
        time,
        priority,
        note,
        fileURL,
        fileName,
        completed: false,
      });

      setTitle("");
      setStartDate("");
      setPriority("medium");
      setTime("");
      setNote("");
      setFile(null);
    } catch (error) {
      alert("Error al subir archivo o guardar tarea");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3">
      <input
        type="text"
        placeholder="Nueva tarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
      />

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="w-full p-3 border rounded-xl"
      />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full p-3 border rounded-xl"
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full p-3 border rounded-xl"
      >
        <option value="high">Alta ⭐⭐⭐</option>
        <option value="medium">Media ⭐⭐</option>
        <option value="low">Baja ⭐</option>
      </select>

      <textarea
        placeholder="Nota (opcional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-3 border rounded-xl"
        rows="3"
      />

      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full"
      />

      <button
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-md disabled:opacity-50"
      >
        {loading ? "Subiendo..." : "Agregar tarea"}
      </button>
    </form>
  );
}

export default TodoForm;
