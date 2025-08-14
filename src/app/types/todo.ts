export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed?: boolean;
}

export interface CreateTodoData {
  userId: number;
  title: string;
  completed?: boolean;
}

export interface UpdateTodoData {
  title?: string;
  completed?: boolean;
  userId?: number;
}
