type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

type CreateTodo = {
  title: string;
};

type EditTodo = { title?: string; completed?: boolean };

export type { Todo, CreateTodo, EditTodo };
