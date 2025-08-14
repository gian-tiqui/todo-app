import { create } from "zustand";
import { Todo } from "../types/todo";

interface TodoState {
  selectedTodo: Todo | null;
  isModalOpen: boolean;
  setSelectedTodo: (todo: Todo | null) => void;
  openModal: (todo: Todo) => void;
  closeModal: () => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  selectedTodo: null,
  isModalOpen: false,
  setSelectedTodo: (todo) => set({ selectedTodo: todo }),
  openModal: (todo) => set({ selectedTodo: todo, isModalOpen: true }),
  closeModal: () => set({ selectedTodo: null, isModalOpen: false }),
}));
