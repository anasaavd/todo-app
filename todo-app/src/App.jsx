import { useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          TO-DO App
        </h1>

        {/* Aquí irá el formulario */}
        {/* Aquí irá la lista */}
      </div>
    </div>
  );
}

export default App;
