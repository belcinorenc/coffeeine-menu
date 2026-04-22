"use client";

import type { ReactNode } from "react";

interface ConfirmActionFormProps {
  action: (formData: FormData) => void | Promise<void>;
  children: ReactNode;
  message: string;
  className?: string;
}

export function ConfirmActionForm({
  action,
  children,
  message,
  className
}: ConfirmActionFormProps) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </form>
  );
}
