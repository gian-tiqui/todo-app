"use client";
import React, { useEffect, useState } from "react";
import { useTodos } from "../hooks/useTodos";
import { Todo } from "../types/todo";
import SelectedTodo from "./SelectedTodo";
import { Query } from "../types/query";
import { Button } from "primereact/button";
import TodoItem from "./TodoItem";
import CreateTodo from "./CreateTodo";

const TodoList = () => {
  const [query, setQuery] = useState<Query>({
    start: 0,
    limit: 10,
    search: "",
  });
  const [showCreateTodo, setShowCreateTodo] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setQuery((prev) => ({ ...prev, search: searchTerm }));
    }, 2000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [searchTerm]);

  const handlePrevClicked = () => {
    setQuery((prev) => ({
      ...prev,
      start: prev.start - 10,
    }));
  };

  const handleNextClicked = () => {
    setQuery((prev) => ({
      ...prev,
      start: prev.start + 10,
    }));
  };

  const {
    data: todos,
    isLoading: isLoadingTodos,
    isError: isErrorTodos,
  } = useTodos(query.start, query.limit, query.search);

  if (isLoadingTodos)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-8 text-white">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-white/30 border-t-blue-400 rounded-full animate-spin"></div>
            Loading todos...
          </div>
        </div>
      </div>
    );

  if (isErrorTodos)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500/10 backdrop-blur-lg border border-red-400/30 rounded-lg p-8 text-white max-w-md text-center">
          <div className="text-red-400 mb-2">❌ Error</div>
          There was a problem in loading your todos. Please try again later
        </div>
      </div>
    );

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Todo App
          </h1>
          <button
            onClick={() => setShowCreateTodo(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 backdrop-blur-lg"
          >
            + Create Todo
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search todos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:bg-white/20 transition-all duration-300"
          />
        </div>

        {/* Todo List */}
        <div className="space-y-3 mb-8">
          {todos && todos.length > 0 ? (
            todos.map((todo: Todo) => <TodoItem todo={todo} key={todo.id} />)
          ) : (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-8 text-center text-white/70">
              No todos found
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevClicked}
            disabled={query.start === 0}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-lg"
          >
            ← Previous
          </Button>
          <span className="text-white/70">
            Page {Math.floor(query.start / query.limit) + 1}
          </span>
          <Button
            onClick={handleNextClicked}
            disabled={!todos || todos.length < query.limit}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-lg"
          >
            Next →
          </Button>
        </div>

        <SelectedTodo />
        <CreateTodo setVisible={setShowCreateTodo} visible={showCreateTodo} />
      </div>
    </div>
  );
};

export default TodoList;
