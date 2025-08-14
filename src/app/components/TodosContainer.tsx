"use client";
import React, { useState } from "react";
import TodoList from "./TodoList";
import CreateTodo from "./CreateTodo";

const TodosContainer = () => {
  const [showCreateTodo, setShowCreateTodo] = useState<boolean>(false);

  return (
    <div className="text-white">
      <CreateTodo setVisible={setShowCreateTodo} visible={showCreateTodo} />
      <TodoList />
    </div>
  );
};

export default TodosContainer;
