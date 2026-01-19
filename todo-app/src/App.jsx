import { useState, useEffect } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import ConfirmModal from "./components/ConfirmModal";
import Auth from "./components/Auth";

import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [filter, setFilter] = useState("all");


  const [notified, setNotified] = useState({});

  // 🔔 reloj interno (re-render cada minuto)
  const [tick, setTick] = useState(0);

  // ================= AUTH =================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // ================= LOAD TODOS =================
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "todos"),
      where("userId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setTodos(data);
    });

    return () => unsub();
  }, [user]);

  // ================= PERMISO NOTIFICACIONES =================
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // ================= RELOJ (cada minuto) =================
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // ================= NOTIFICACIONES =================

  useEffect(() => {
  if (Notification.permission !== "granted") return;

  const now = new Date();

  todos.forEach((todo) => {
    if (!todo.time || todo.completed) return;

    const taskTime = new Date(`${todo.startDate}T${todo.time}`);
    const diffMinutes = (taskTime - now) / 60000;

    const soonKey = `${todo.id}-soon`;
    const lateKey = `${todo.id}-late`;

    // 10 MINUTOS ANTES DE LA TAREA (una sola vez)
    if (
      diffMinutes <= 10 &&
      diffMinutes > 9 &&
      !notified[soonKey]
    ) {
      new Notification("⏰ Tarea próxima", {
        body: `Faltan 10 minutos para: ${todo.title}`,
      });

      setNotified((prev) => ({
        ...prev,
        [soonKey]: true,
      }));
    }

    // HORA DE LA TAREA (una sola vez)
    if (
      diffMinutes <= 0 &&
      diffMinutes > -1 &&
      !notified[lateKey]
    ) {
      new Notification("🔴 Es hora de la tarea ", {
        body: todo.title,
      });

      setNotified((prev) => ({
        ...prev,
        [lateKey]: true,
      }));
    }
  });
}, [todos, tick]);


  // ================= CONTADORES =================
  const totalCount = todos.length;
  const pendingCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  // ================= CRUD =================
  const addTodo = async (todo) => {
    await addDoc(collection(db, "todos"), {
      ...todo,
      userId: user.uid,
    });
    setFilter("all");
  };

  const toggleTodo = async (id, current) => {
    await updateDoc(doc(db, "todos", id), {
      completed: !current,
    });

    setNotified((prev) => {
      const copy = { ...prev };
      delete copy[`${id}-soon`];
      delete copy[`${id}-late`];
      return copy;
    });
  };

  const editTodo = async (id, title, startDate, time, note) => {
    await updateDoc(doc(db, "todos", id), {
      title,
      startDate,
      time,
      note,
    });
  };

  const askDeleteTodo = (id) => {
    setTodoToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    await deleteDoc(doc(db, "todos", todoToDelete));
    setShowModal(false);
    setTodoToDelete(null);
  };

  // ================= FILTRO =================
  const filteredTodos = todos.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  // ================= ORDEN =================
  const priorityOrder = { high: 1, medium: 2, low: 3 };

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    const dateA = new Date(`${a.startDate}T${a.time}`);
    const dateB = new Date(`${b.startDate}T${b.time}`);
    if (dateA - dateB !== 0) return dateA - dateB;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // ================= LOGIN =================
  if (!user) {
    return <Auth onLogin={() => setUser(auth.currentUser)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-indigo-700">
              TO-DO Cloud
            </h1>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          <button
            onClick={() => signOut(auth)}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-full hover:bg-red-200 transition"
          >
            Cerrar sesión
          </button>
        </div>

        <TodoForm onAdd={addTodo} />

        {/* FILTROS */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-6 shadow-inner">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
              filter === "all"
                ? "bg-white shadow text-indigo-600"
                : "text-gray-500"
            }`}
          >
            Todas ({totalCount})
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
              filter === "pending"
                ? "bg-white shadow text-yellow-600"
                : "text-gray-500"
            }`}
          >
            Pendientes ({pendingCount})
          </button>

          <button
            onClick={() => setFilter("completed")}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
              filter === "completed"
                ? "bg-white shadow text-green-600"
                : "text-gray-500"
            }`}
          >
            Realizadas ({completedCount})
          </button>
        </div>

        <TodoList
          todos={sortedTodos}
          onToggle={(id, c) => toggleTodo(id, c)}
          onAskDelete={askDeleteTodo}
          onEdit={editTodo}
        />
      </div>

      <ConfirmModal
        show={showModal}
        onConfirm={confirmDelete}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}

export default App;
