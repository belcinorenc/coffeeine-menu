"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, CircleAlert, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ActionFeedbackProps {
  status?: string;
  message?: string;
}

export function ActionFeedback({ status, message }: ActionFeedbackProps) {
  const [feedback, setFeedback] = useState<ActionFeedbackProps>(
    status && message ? { status, message } : {}
  );
  const [visible, setVisible] = useState(Boolean(status && message));
  const lastToastKeyRef = useRef<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const cleanedUrl = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("status");
    params.delete("message");

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!status || !message) {
      return;
    }

    const toastKey = `${status}:${message}`;

    if (lastToastKeyRef.current === toastKey) {
      return;
    }

    lastToastKeyRef.current = toastKey;
    setFeedback({ status, message });
    setVisible(true);
    router.replace(cleanedUrl, { scroll: false });

    const timeoutId = window.setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [cleanedUrl, message, router, status]);

  useEffect(() => {
    if (!visible) {
      setFeedback({});
      lastToastKeyRef.current = null;
    }
  }, [visible]);

  if (!feedback.status || !feedback.message || !visible) {
    return null;
  }

  const isSuccess = feedback.status === "success";

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 w-full max-w-sm sm:bottom-6 sm:right-6">
      <div
        className={
          isSuccess
            ? "pointer-events-auto flex items-start gap-3 rounded-[24px] border border-emerald-200 bg-white/95 px-4 py-4 text-sm font-medium text-emerald-800 shadow-lg shadow-emerald-100/70 backdrop-blur transition-all"
            : "pointer-events-auto flex items-start gap-3 rounded-[24px] border border-red-200 bg-white/95 px-4 py-4 text-sm font-medium text-red-800 shadow-lg shadow-red-100/70 backdrop-blur transition-all"
        }
        role="status"
        aria-live="polite"
      >
        <div className="mt-0.5 shrink-0">
          {isSuccess ? <CheckCircle2 className="h-5 w-5" /> : <CircleAlert className="h-5 w-5" />}
        </div>

        <p className="flex-1 pr-2 leading-6">{feedback.message}</p>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={() => setVisible(false)}
          aria-label="Mesajı kapat"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
