import { CheckCircle2, CircleAlert } from "lucide-react";

interface ActionFeedbackProps {
  status?: string;
  message?: string;
}

export function ActionFeedback({ status, message }: ActionFeedbackProps) {
  if (!status || !message) {
    return null;
  }

  const isSuccess = status === "success";

  return (
    <div
      className={
        isSuccess
          ? "flex items-start gap-3 rounded-[24px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800 shadow-sm"
          : "flex items-start gap-3 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-800 shadow-sm"
      }
    >
      <div className="mt-0.5">
        {isSuccess ? <CheckCircle2 className="h-5 w-5" /> : <CircleAlert className="h-5 w-5" />}
      </div>
      <p>{message}</p>
    </div>
  );
}
