"use client";
import React, { useEffect, useState, useRef } from "react";
import { useTodos } from "../hooks/useTodos";
import { Todo } from "../types/todo";
import SelectedTodo from "./SelectedTodo";
import { Query } from "../types/query";
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
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Store accumulated todos
  const [accumulatedTodos, setAccumulatedTodos] = useState<Todo[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  // Ref to track previous scroll position
  const previousScrollPosition = useRef<number>(0);
  const isInfiniteLoading = useRef<boolean>(false);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      // Reset accumulated todos when searching
      setAccumulatedTodos([]);
      setIsInitialLoad(true);
      setQuery((prev) => ({
        ...prev,
        search: searchTerm,
        start: 0,
        limit: 10,
      }));
    }, 2000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      // Show/hide back to top button
      setShowBackToTop(scrollTop > 300);

      // Check if near bottom for infinite scroll
      if (
        scrollTop + clientHeight >= scrollHeight - 100 &&
        !isLoadingMore &&
        !isInitialLoad
      ) {
        // Store current scroll position before loading more
        previousScrollPosition.current = scrollTop;
        isInfiniteLoading.current = true;
        handleLowerViewPortHit();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoadingMore, isInitialLoad]);

  const handleLowerViewPortHit = () => {
    setIsLoadingMore(true);
    setQuery((prev) => ({
      ...prev,
      start: accumulatedTodos.length, // Use current length as start point
      limit: 10, // Load 10 more items
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const {
    data: todos,
    isLoading: isLoadingTodos,
    isError: isErrorTodos,
  } = useTodos(query.start, query.limit, query.search);

  // Handle todo accumulation
  useEffect(() => {
    if (todos && Array.isArray(todos)) {
      if (isInitialLoad) {
        // First load or search - replace all todos
        setAccumulatedTodos(todos);
        setIsInitialLoad(false);
      } else if (isLoadingMore) {
        // Infinite loading - append new todos
        setAccumulatedTodos((prevTodos) => {
          // Filter out duplicates by id to prevent duplicates
          const existingIds = new Set(prevTodos.map((todo) => todo.id));
          const newTodos = todos.filter((todo) => !existingIds.has(todo.id));
          return [...prevTodos, ...newTodos];
        });

        setIsLoadingMore(false);

        // Restore scroll position after infinite loading
        if (isInfiniteLoading.current) {
          setTimeout(() => {
            const currentScrollHeight = document.documentElement.scrollHeight;
            const currentClientHeight = document.documentElement.clientHeight;

            const targetScrollPosition = Math.min(
              previousScrollPosition.current + 100,
              currentScrollHeight - currentClientHeight
            );

            window.scrollTo({
              top: targetScrollPosition,
              behavior: "auto",
            });

            isInfiniteLoading.current = false;
          }, 0);
        }
      }
    }
  }, [todos, isInitialLoad, isLoadingMore]);

  // Show loading only on initial load
  if (isLoadingTodos && isInitialLoad) {
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
  }

  if (isErrorTodos) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500/10 backdrop-blur-lg border border-red-400/30 rounded-lg p-8 text-white max-w-md text-center">
          <div className="text-red-400 mb-2">❌ Error</div>
          There was a problem in loading your todos. Please try again later
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 relative">
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
          {accumulatedTodos.length > 0 ? (
            accumulatedTodos.map((todo: Todo) => (
              <TodoItem todo={todo} key={todo.id} />
            ))
          ) : (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-8 text-center text-white/70">
              {isInitialLoad && isLoadingTodos
                ? "Loading..."
                : "No todos found"}
            </div>
          )}
        </div>

        {/* Loading More Indicator */}
        {isLoadingMore && accumulatedTodos.length > 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-blue-400 rounded-full animate-spin"></div>
                Loading more todos...
              </div>
            </div>
          </div>
        )}

        <SelectedTodo />
        <CreateTodo setVisible={setShowCreateTodo} visible={showCreateTodo} />
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-3 rounded-full shadow-lg backdrop-blur-lg border border-white/20 transition-all duration-300 hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default TodoList;
