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

  // Ref to track previous scroll position
  const previousScrollPosition = useRef<number>(0);
  const isInfiniteLoading = useRef<boolean>(false);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setQuery((prev) => ({ ...prev, search: searchTerm, limit: 10 })); // Reset limit when searching
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
      if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoadingMore) {
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
  }, [isLoadingMore]);

  const handleLowerViewPortHit = () => {
    setIsLoadingMore(true);
    setQuery((prev) => ({
      ...prev,
      limit: prev.limit + 10,
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

  // Reset loading more state when data is received and maintain scroll position
  useEffect(() => {
    if (todos && isLoadingMore) {
      setIsLoadingMore(false);

      // Restore scroll position after infinite loading
      if (isInfiniteLoading.current) {
        // Use setTimeout to ensure DOM has updated
        setTimeout(() => {
          // Calculate new scroll position to maintain relative position
          const currentScrollHeight = document.documentElement.scrollHeight;
          const currentClientHeight = document.documentElement.clientHeight;

          // Scroll to a position that maintains the user's view
          // We add a small offset to account for the new content
          const targetScrollPosition = Math.min(
            previousScrollPosition.current + 100, // Small offset to show some new content
            currentScrollHeight - currentClientHeight
          );

          window.scrollTo({
            top: targetScrollPosition,
            behavior: "auto", // Use "auto" to avoid smooth scrolling during infinite load
          });

          isInfiniteLoading.current = false;
        }, 0);
      }
    }
  }, [todos, isLoadingMore]);

  // Alternative approach: Prevent scroll reset on component re-render
  useEffect(() => {
    // Only run this effect if we're in the middle of infinite loading
    if (isInfiniteLoading.current && !isLoadingMore) {
      const restoreScrollPosition = () => {
        if (previousScrollPosition.current > 0) {
          window.scrollTo({
            top: previousScrollPosition.current + 50, // Small offset to show new content
            behavior: "auto",
          });
        }
      };

      // Use requestAnimationFrame to ensure DOM is fully rendered
      requestAnimationFrame(restoreScrollPosition);
    }
  });

  if (isLoadingTodos && query.limit === 10)
    // Only show full loading on initial load
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

  // Ensure todos is always an array before mapping
  const todoList = Array.isArray(todos) ? todos : [];

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
          {todoList.length > 0 ? (
            todoList.map((todo: Todo) => <TodoItem todo={todo} key={todo.id} />)
          ) : (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-8 text-center text-white/70">
              {todos === undefined ? "Loading..." : "No todos found"}
            </div>
          )}
        </div>

        {/* Loading More Indicator */}
        {isLoadingMore && todoList.length > 0 && (
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
