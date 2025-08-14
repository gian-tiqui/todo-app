"use client";
import React from "react";
import { Todo } from "../types/todo";
import { useTodoStore } from "../store/todoStore";

interface Props {
  todo: Todo;
}

const TodoItem: React.FC<Props> = ({ todo }) => {
  const { openModal } = useTodoStore();

  return (
    <div
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 cursor-pointer hover:bg-white/20 hover:border-white/30 transition-all duration-300 group"
      onClick={() => openModal(todo)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3
            className={`text-white font-medium ${
              todo.completed ? "line-through text-white/60" : ""
            }`}
          >
            {todo.title}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              todo.completed
                ? "bg-green-500/20 text-green-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {todo.completed ? "Done" : "Pending"}
          </span>
          <div className="text-white/40 group-hover:text-white/60 transition-colors">
            →
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
