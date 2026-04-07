"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [taskIds, setTaskIds] = useState<number[]>([]);
  const [allTaskIds, setAllTaskIds] = useState<number[]>([]);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!title.trim()) return;
    const newTodo: Todo = { id: Date.now(), title, completed: false };
    setTodos((prev) => [...prev, newTodo]);
    setAllTaskIds((prev) => [...prev, newTodo.id]);
    setTitle("");
  };

  const deleteTodo = (ids: number[]) => {
    setTodos((prev) => prev.filter((todo) => !ids.includes(todo.id)));
    setTaskIds((prev) => prev.filter((id) => !ids.includes(id)));
  };

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
    <main className="min-h-screen bg-gray-50 dark:bg-[#071023] flex items-center justify-center p-6">
      <section className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/5 p-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Todo
            </h1>
            {/* <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">シンプルで気持ち良いUXにリデザインしました</p> */}
          </div>
          <div className="text-right text-sm text-gray-500 dark:text-gray-400">
            {todos.length} items
          </div>
        </header>

        <div className="mt-6 flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <label className="sr-only">新しいタスク</label>
            <input
              className="w-full min-w-0 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-base md:text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // IME の確定（composition）中は無視する
                  if (isComposing) return;
                  e.preventDefault();
                  addTodo();
                }
              }}
              placeholder="何をする？（例: 買い物）"
              aria-label="新しいタスク"
            />
          </div>

          <div className="mt-3 flex w-full gap-3 md:mt-0 md:w-auto">
            <button
              type="button"
              onClick={addTodo}
              className="flex-1 md:flex-initial rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            >
              追加
            </button>
            <button
              type="button"
              onClick={() => deleteTodo(taskIds)}
              className="flex-1 md:flex-initial rounded-xl bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            >
              選択分削除
            </button>
            <button
              type="button"
              onClick={() => deleteTodo(allTaskIds)}
              className="flex-1 md:flex-initial rounded-xl bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            >
              全て削除
            </button>
          </div>
        </div>

        <div className="mt-6">
          {todos.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 dark:border-slate-700 p-6 text-center text-gray-500 dark:text-gray-400">
              タスクがありません。追加してみましょう。
            </div>
          ) : (
            <ul className="mt-2 space-y-3">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between gap-4 bg-gray-50 dark:bg-slate-800 border border-transparent hover:border-gray-100 dark:hover:border-slate-700 rounded-lg px-4 py-3 transition"
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="h-5 w-5 rounded-md text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                      aria-label={`完了: ${todo.title}`}
                    />
                    <span
                      className={`text-sm ${todo.completed ? "text-gray-400 line-through" : "text-gray-900 dark:text-gray-100"}`}
                    >
                      {todo.title}
                    </span>
                  </label>
                  <div className="text-sm text-gray-400">
                    {new Date(todo.id).toLocaleTimeString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
