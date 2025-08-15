"use client";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { useForm, Controller } from "react-hook-form";
import { useCreateTodo } from "../hooks/useTodos";
import { Toast } from "primereact/toast";
import DOMPurify from "dompurify";
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

  // Sanitizer function
  const sanitizeInput = (input: string) => {
    const cleaned = DOMPurify.sanitize(input.trim());
    const sqlKeywords =
      /\b(SELECT|UPDATE|DELETE|INSERT|DROP|UNION|ALTER|CREATE|TRUNCATE|EXEC|--|;)\b/i;
    if (sqlKeywords.test(cleaned)) {
      throw new Error("Invalid input: contains disallowed keywords.");
    }
    return cleaned;
  };

  const onSubmit = async (data: CreateTodoFormData) => {
    try {
      const purifiedTodo = {
        ...data,
        title: sanitizeInput(data.title),
      };

      await createTodoMutation.mutateAsync(purifiedTodo);
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
    } catch (error: unknown) {
      let message = "Your input contains invalid patterns.";
      if (error instanceof Error) {
        message = error.message;
      }
      toastRef.current?.show({
        severity: "error",
        summary: "Invalid Input",
        detail: message,
        life: 3000,
        sticky: false,
        closable: true,
      });
      console.error("Failed to create todo:", error);
    }
  };

  const handleClose = () => {
    reset();
    setVisible(false);
  };

  const dialogFooter = (
    <div className="bg-white/10 backdrop-blur-lg border gap-2 border-white/20 rounded-b-lg text-white flex justify-between p-4 cursor-pointer hover:bg-white/20 hover:border-white/30 transition-all duration-300 group">
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
        footer={dialogFooter}
        className="w-80 md:w-[500px]"
        unstyled
        modal
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
        closable={!createTodoMutation.isPending}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
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
                validate: (value) => {
                  try {
                    sanitizeInput(value);
                    return true;
                  } catch (err: unknown) {
                    let message = "Your input contains invalid patterns.";
                    if (err instanceof Error) {
                      message = err.message;
                    }
                    toastRef.current?.show({
                      severity: "error",
                      summary: "Invalid Input",
                      detail: message,
                      life: 3000,
                    });
                    return message;
                  }
                },
              }}
              render={({ field }) => (
                <InputText
                  {...field}
                  id="title"
                  placeholder="Enter todo title..."
                  unstyled
                  className={`w-full bg-white/10 border border-white/20 rounded-lg text-white placeholder-text-white h-12 px-2 focus:border-blue-400 focus:bg-white/20 ${
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
