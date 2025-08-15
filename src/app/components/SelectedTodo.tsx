import { Dialog } from "primereact/dialog";
import React, { useRef, useState, useEffect } from "react";
import { useTodoStore } from "../store/todoStore";
import { useDeleteTodo, useUpdateTodo } from "../hooks/useTodos";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import CustomToast from "./CustomToast";

const SelectedTodo = () => {
  const toastRef = useRef<Toast>(null);
  const {
    isModalOpen,
    selectedTodo,
    closeModal,
    setSelectedTodo,
    updateTodoInAccumulated,
    removeTodoFromAccumulated,
  } = useTodoStore();
  const deleteTodoMutation = useDeleteTodo();
  const updateTodoMutation = useUpdateTodo();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (selectedTodo) {
      setEditTitle(selectedTodo.title);
      setOriginalTitle(selectedTodo.title);
      setIsEditingTitle(false);
    }
  }, [selectedTodo]);

  useEffect(() => {
    if (!isModalOpen) {
      setIsEditingTitle(false);
      setShowDeleteConfirm(false);
    }
  }, [isModalOpen]);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedTodo) {
      try {
        await deleteTodoMutation.mutateAsync(selectedTodo.id);

        // Remove from accumulated todos
        removeTodoFromAccumulated(selectedTodo.id);

        toastRef.current?.show({
          severity: "success",
          summary: "Todo Deleted",
          detail: "Your task was deleted successfully.",
          life: 3000,
          sticky: false,
          closable: true,
        });
        setShowDeleteConfirm(false);
        closeModal();
      } catch (error) {
        console.error("Failed to delete todo:", error);
        toastRef.current?.show({
          severity: "error",
          summary: "Delete Failed",
          detail: "Failed to delete todo. Please try again.",
          life: 3000,
          sticky: false,
          closable: true,
        });
        setShowDeleteConfirm(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const handleToggleComplete = async () => {
    if (selectedTodo) {
      try {
        const updated = await updateTodoMutation.mutateAsync({
          id: selectedTodo.id,
          data: {
            completed: !selectedTodo.completed,
            title: selectedTodo.title,
            userId: selectedTodo.userId,
          },
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

        // Update both selected todo and accumulated todos
        setSelectedTodo(updated);
        updateTodoInAccumulated(updated);
      } catch (error) {
        console.error("Failed to update todo:", error);
      }
    }
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleTitleSave = async () => {
    if (selectedTodo && editTitle.trim() && editTitle !== originalTitle) {
      try {
        const updated = await updateTodoMutation.mutateAsync({
          id: selectedTodo.id,
          data: {
            title: editTitle.trim(),
            completed: selectedTodo.completed,
            userId: selectedTodo.userId,
          },
        });

        toastRef.current?.show({
          severity: "success",
          summary: "Title Updated",
          detail: "Todo title has been updated successfully.",
          life: 3000,
          sticky: false,
          closable: true,
        });

        // Update both selected todo and accumulated todos
        setSelectedTodo(updated);
        updateTodoInAccumulated(updated);
        setOriginalTitle(editTitle.trim());
        setIsEditingTitle(false);
      } catch (error) {
        console.error("Failed to update todo title:", error);
        toastRef.current?.show({
          severity: "error",
          summary: "Update Failed",
          detail: "Failed to update todo title. Please try again.",
          life: 3000,
          sticky: false,
          closable: true,
        });
      }
    } else {
      setIsEditingTitle(false);
      setEditTitle(originalTitle);
    }
  };

  const handleTitleCancel = () => {
    setEditTitle(originalTitle);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSave();
    } else if (e.key === "Escape") {
      handleTitleCancel();
    }
  };

  const handleModalClose = () => {
    setIsEditingTitle(false);
    setShowDeleteConfirm(false);
    closeModal();
  };

  const LoadingSpinner = () => (
    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
  );

  return (
    <>
      <CustomToast ref={toastRef} />

      {/* Delete Confirmation Dialog */}
      <Dialog
        visible={showDeleteConfirm}
        onHide={handleDeleteCancel}
        modal
        className="w-80 md:w-96"
        unstyled
        pt={{
          header: {
            className:
              "bg-white/10 backdrop-blur-lg border border-white/20 rounded-t-lg text-white flex justify-between p-4",
          },
          content: {
            className:
              "bg-white/10 backdrop-blur-lg border border-white/20 rounded-b-lg text-white p-6",
          },
        }}
        header="Confirm Delete"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-red-400 text-xl">⚠️</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Delete Todo</h3>
              <p className="text-white/70 text-sm">
                This action cannot be undone
              </p>
            </div>
          </div>

          <p className="text-white/80 mb-6">
            Are you sure you want to delete &quot;{selectedTodo?.title}&quot;?
            This will permanently remove the todo from your list.
          </p>

          <div className="flex gap-3 justify-end">
            <Button
              onClick={handleDeleteCancel}
              disabled={deleteTodoMutation.isPending}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 text-gray-400 disabled:bg-gray-500/10 disabled:text-gray-400/50 disabled:cursor-not-allowed"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={deleteTodoMutation.isPending}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 disabled:bg-red-500/10 disabled:text-red-400/50 ${
                deleteTodoMutation.isPending
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              {deleteTodoMutation.isPending && <LoadingSpinner />}
              {deleteTodoMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Main Todo Details Dialog */}
      <Dialog
        modal
        visible={isModalOpen}
        onHide={handleModalClose}
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
                {isEditingTitle ? (
                  <div className="flex gap-2">
                    <InputText
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={handleTitleKeyDown}
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-0 outline-none"
                      placeholder="Enter todo title..."
                      autoFocus
                      disabled={updateTodoMutation.isPending}
                    />
                    <Button
                      onClick={handleTitleSave}
                      disabled={
                        updateTodoMutation.isPending || !editTitle.trim()
                      }
                      className="flex items-center justify-center px-3 py-2 rounded-lg font-medium transition-all duration-200 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 disabled:bg-green-500/10 disabled:text-green-400/50 disabled:cursor-not-allowed"
                    >
                      {updateTodoMutation.isPending ? <LoadingSpinner /> : "✓"}
                    </Button>
                    <Button
                      onClick={handleTitleCancel}
                      disabled={updateTodoMutation.isPending}
                      className="flex items-center justify-center px-3 py-2 rounded-lg font-medium transition-all duration-200 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 text-gray-400 disabled:bg-gray-500/10 disabled:text-gray-400/50 disabled:cursor-not-allowed"
                    >
                      ✕
                    </Button>
                  </div>
                ) : (
                  <div
                    className="bg-white/10 border border-white/20 rounded-lg p-3 text-white cursor-pointer hover:bg-white/15 transition-colors duration-200 group flex items-center justify-between"
                    onClick={handleTitleEdit}
                  >
                    <span>{selectedTodo.title}</span>
                    <span className="text-white/40 group-hover:text-white/60 text-sm">
                      ✏️ Click to edit
                    </span>
                  </div>
                )}
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
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                  selectedTodo.completed
                    ? "bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400 disabled:bg-yellow-500/10 disabled:text-yellow-400/50"
                    : "bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 disabled:bg-green-500/10 disabled:text-green-400/50"
                } ${
                  updateTodoMutation.isPending
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {updateTodoMutation.isPending && <LoadingSpinner />}
                {updateTodoMutation.isPending
                  ? selectedTodo.completed
                    ? "Setting to Pending..."
                    : "Completing..."
                  : selectedTodo.completed
                  ? "Mark as Pending"
                  : "Mark as Complete"}
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteClick();
                }}
                disabled={deleteTodoMutation.isPending}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 disabled:bg-red-500/10 disabled:text-red-400/50 ${
                  deleteTodoMutation.isPending
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
};

export default SelectedTodo;
