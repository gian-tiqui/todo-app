"use client";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { useForm, Controller } from "react-hook-form";
import { useCreateTodo } from "../hooks/useTodos";
import { Toast } from "primereact/toast";
import CustomToast from "./CustomToast";

interface CreateTodoFormData {
  title: string;
  userId: number;
  completed: boolean;
}

interface CreateTodoProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const CreateTodo: React.FC<CreateTodoProps> = ({ visible, setVisible }) => {
  const createTodoMutation = useCreateTodo();
  const toastRef = useRef<Toast>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateTodoFormData>({
    defaultValues: {
      title: "",
      userId: 1,
      completed: false,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: CreateTodoFormData) => {
    try {
      await createTodoMutation.mutateAsync(data);
      reset();
      toastRef.current?.show({
        severity: "success",
        summary: "Todo Added",
        detail: "Your new task was added successfully.",
        life: 3000,
        sticky: false,
        closable: true,
      });

      setVisible(false);
    } catch (error) {
      console.error("Failed to create todo:", error);
    }
  };

  const handleClose = () => {
    reset();
    setVisible(false);
  };

  const dialogFooter = (
    <div className="flex justify-end gap-2">
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        onClick={handleClose}
        disabled={createTodoMutation.isPending}
        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
      />
      <Button
        label="Create Todo"
        icon="pi pi-check"
        onClick={handleSubmit(onSubmit)}
        loading={createTodoMutation.isPending}
        disabled={!isValid}
        className="bg-gradient-to-r from-blue-500 to-purple-500 border-none text-white hover:from-blue-600 hover:to-purple-600"
      />
    </div>
  );

  return (
    <>
      <CustomToast ref={toastRef} />
      <Dialog
        header="Create New Todo"
        visible={visible}
        onHide={handleClose}
        unstyled
        footer={dialogFooter}
        style={{ width: "450px" }}
        modal
        closable={!createTodoMutation.isPending}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Title Field */}
          <div className="field">
            <label
              htmlFor="title"
              className="block mb-2 font-semibold text-white"
            >
              Title <span className="text-red-400">*</span>
            </label>
            <Controller
              name="title"
              control={control}
              rules={{
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters long",
                },
                maxLength: {
                  value: 100,
                  message: "Title must not exceed 100 characters",
                },
              }}
              render={({ field }) => (
                <InputText
                  {...field}
                  id="title"
                  placeholder="Enter todo title..."
                  className={`w-full bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:bg-white/20 ${
                    errors.title ? "border-red-400" : ""
                  }`}
                  disabled={createTodoMutation.isPending}
                />
              )}
            />
            {errors.title && (
              <small className="text-red-400 block mt-1">
                {errors.title.message}
              </small>
            )}
          </div>

          {/* Completed Field */}
          <div className="field">
            <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-lg">
              <Controller
                name="completed"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    inputId="completed"
                    checked={field.value}
                    disabled={createTodoMutation.isPending}
                    className="text-blue-400"
                  />
                )}
              />
              <label htmlFor="completed" className="font-semibold text-white">
                Mark as completed
              </label>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default CreateTodo;
