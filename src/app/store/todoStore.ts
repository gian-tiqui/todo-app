import { create } from "zustand";
import { Todo } from "../types/todo";

interface TodoState {
  selectedTodo: Todo | null;
  isModalOpen: boolean;
  setSelectedTodo: (todo: Todo | null) => void;
  openModal: (todo: Todo) => void;
  closeModal: () => void;
  accumulatedTodos: Todo[];
  setAccumulatedTodos: (todo: Todo[]) => void;
  updateTodoInAccumulated: (updatedTodo: Todo) => void;
  removeTodoFromAccumulated: (todoId: number) => void;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  selectedTodo: null,
  isModalOpen: false,
  setSelectedTodo: (todo) => set({ selectedTodo: todo }),
  openModal: (todo) => set({ selectedTodo: todo, isModalOpen: true }),
  closeModal: () => set({ selectedTodo: null, isModalOpen: false }),
  accumulatedTodos: [],
  setAccumulatedTodos: (todos: Todo[]) => set({ accumulatedTodos: todos }),
  updateTodoInAccumulated: (updatedTodo: Todo) => {
    const { accumulatedTodos } = get();
    const updatedTodos = accumulatedTodos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    set({ accumulatedTodos: updatedTodos });
  },
  removeTodoFromAccumulated: (todoId: number) => {
    const { accumulatedTodos } = get();
    const filteredTodos = accumulatedTodos.filter((todo) => todo.id !== todoId);
    set({ accumulatedTodos: filteredTodos });
  },
}));
