"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const SamplePage = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [taskIds, setTaskIds] = useState<number[]>([]);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!title.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setTitle("");
  }

  const deleteTodo = (ids: number[]) => {
    setTodos((prev) => prev.filter((todo) => !ids.includes(todo.id)));
    setTaskIds((prev) => prev.filter((id) => !ids.includes(id)));
  }

  const toggleTodo = (id: number) => {
    setTodos((prev) => {
        const newTodos = prev.map((todo) => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        const toggled = newTodos.find((t) => t.id === id);
        setTaskIds((prevIds) =>
            toggled?.completed ? (prevIds.includes(id) ? prevIds : [...prevIds, id]) : prevIds.filter((tid) => tid !== id)
        );
        return newTodos;
    });
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Todoアプリ</h1>
      <div style={{ marginBottom: 20 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Todoを入力"
        />
        <button onClick={addTodo} style={{ marginLeft: 10 }}>
          追加
        </button>

        <button onClick={() => deleteTodo(taskIds)} style={{ marginLeft: 10 }}>選択分削除</button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{ marginBottom: 10 }}>
            <label style={{ marginRight: 10 }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span
                style={{
                  marginLeft: 8,
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.title}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default SamplePage;
