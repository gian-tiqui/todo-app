import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Todo, CreateTodoData, UpdateTodoData } from "../types/todo";
import { apiClient } from "../utils/http-common";

export const API_BASE = String(process.env.NEXT_PUBLIC_API_URI);

export const useTodos = (
  offset: number = 0,
  limit: number = 10,
  search: string = ""
) => {
  return useQuery({
    queryKey: ["todos", offset, limit, "desc", search],
    queryFn: async (): Promise<Todo[]> => {
      const response = await apiClient.get<Todo[]>(
        `/?_start=${offset}&_limit=${limit}&q=${search}`
      );
      return response.data;
    },
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTodoData): Promise<Todo> => {
      const response = await apiClient.post<Todo>("/", data);
      const responseData = response.data;

      return {
        ...responseData,
        id: Date.now() + Math.random(),
      };
    },
    onSuccess: (newTodo) => {
      // Update the first page cache (start=0, limit=10, desc, no search)
      queryClient.setQueryData<Todo[]>(["todos", 0, 10, "desc", ""], (old) => {
        console.log("Updating cache with new todo:", newTodo);
        console.log("Previous todos:", old);
        return old ? [newTodo, ...old] : [newTodo];
      });

      // Invalidate all todos queries to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ["todos"],
        refetchType: "none", // Don't refetch, just mark as stale
      });
    },
    onError: (error) => {
      console.error("❌ Error creating todo:", error);
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateTodoData;
    }): Promise<Todo> => {
      return { id, ...data } as Todo;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousQueries: Array<{
        queryKey: readonly unknown[];
        data: Todo[];
      }> = [];

      queryClient
        .getQueryCache()
        .findAll({ queryKey: ["todos"] })
        .forEach((query) => {
          const oldData = query.state.data;
          if (oldData) {
            previousQueries.push({
              queryKey: query.queryKey,
              data: (oldData as Todo[]) ?? [],
            });

            queryClient.setQueryData<Todo[]>(
              query.queryKey,
              (old) =>
                old?.map((todo) =>
                  todo.id === id ? { ...todo, ...data } : todo
                ) || []
            );
          }
        });

      return { previousQueries };
    },
    onError: (error, variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation<
    number,
    unknown,
    number,
    { previousQueries: Array<{ queryKey: readonly unknown[]; data: Todo[] }> }
  >({
    mutationFn: async (id: number): Promise<number> => {
      return Promise.resolve(id);
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousQueries: Array<{
        queryKey: readonly unknown[];
        data: Todo[];
      }> = [];

      queryClient
        .getQueryCache()
        .findAll({ queryKey: ["todos"] })
        .forEach((query) => {
          const oldData = query.state.data;
          if (oldData) {
            previousQueries.push({
              queryKey: query.queryKey,
              data: oldData as Todo[],
            });

            queryClient.setQueryData<Todo[]>(
              query.queryKey,
              (old) => old?.filter((todo) => todo.id !== id) || []
            );
          }
        });

      return { previousQueries };
    },
    onError: (error, variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
  });
};
