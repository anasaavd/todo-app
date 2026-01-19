import TodoItem from "./TodoItem";

function TodoList({ todos = [], onToggle, onAskDelete, onEdit }) {
  if (!Array.isArray(todos)) {
    console.error(":", todos);
    return null;
  }

  if (todos.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No hay tareas para mostrar
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onAskDelete={onAskDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

export default TodoList;
