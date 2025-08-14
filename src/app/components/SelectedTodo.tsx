import { Dialog } from "primereact/dialog";
import React, { useRef } from "react";
import { useTodoStore } from "../store/todoStore";
import { useDeleteTodo, useUpdateTodo } from "../hooks/useTodos";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import CustomToast from "./CustomToast";

const SelectedTodo = () => {
  const toastRef = useRef<Toast>(null);
  const { isModalOpen, selectedTodo, closeModal, setSelectedTodo } =
    useTodoStore();
  const deleteTodoMutation = useDeleteTodo();
  const updateTodoMutation = useUpdateTodo();

  const handleDelete = async () => {
    if (selectedTodo) {
      try {
        await deleteTodoMutation.mutateAsync(selectedTodo.id);

        toastRef.current?.show({
          severity: "success",
          summary: "Todo Deleted",
          detail: "Your new task was deleted successfully.",
          life: 3000,
          sticky: false,
          closable: true,
        });
        closeModal();
      } catch (error) {
        console.error("Failed to delete todo:", error);
      }
    }
  };

  const handleToggleComplete = async () => {
    if (selectedTodo) {
      try {
        const updated = await updateTodoMutation.mutateAsync({
          id: selectedTodo.id,
          data: { completed: !selectedTodo.completed },
        });

        const isDone = updated.completed;

        toastRef.current?.show({
          severity: isDone ? "success" : "warn",
          summary: isDone ? "Todo Completed" : "Todo Pending",
          detail: isDone
            ? "Great job! You've marked this task as done."
            : "This task has been set back to pending.",
          sticky: false,
          closable: true,
        });

        setSelectedTodo(updated);
      } catch (error) {
        console.error("Failed to update todo:", error);
      }
    }
  };

  return (
    <>
      <CustomToast ref={toastRef} />
      <Dialog
        modal
        visible={isModalOpen}
        onHide={() => closeModal()}
        className="w-80 md:w-[500px]"
        unstyled
        pt={{
          header: {
            className:
              "bg-white/10 backdrop-blur-lg border border-white/20 rounded-t-lg text-white flex justify-between p-4 cursor-pointer hover:bg-white/20 hover:border-white/30 transition-all duration-300 group",
          },
          content: {
            className:
              "bg-white/10 backdrop-blur-lg border border-white/20 text-white flex justify-between p-4 cursor-pointer hover:bg-white/20 hover:border-white/30 transition-all duration-300 group",
          },
        }}
        header="Todo Details"
      >
        {selectedTodo && (
          <div className="space-y-6 w-full">
            {/* Todo Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">
                  Title
                </label>
                <div className="bg-white/10 border border-white/20 rounded-lg p-3 text-white">
                  {selectedTodo.title}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">
                  Status
                </label>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    selectedTodo.completed
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  }`}
                >
                  {selectedTodo.completed ? "✅ Completed" : "⏳ Pending"}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleToggleComplete}
                disabled={updateTodoMutation.isPending}
                className={`flex-1 ${
                  selectedTodo.completed
                    ? "bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400"
                    : "bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400"
                }`}
              >
                {selectedTodo.completed
                  ? "Mark as Pending"
                  : "Mark as Complete"}
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleteTodoMutation.isPending}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400"
              >
                {deleteTodoMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
};

export default SelectedTodo;
