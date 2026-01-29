"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

function ErrorListenerContent() {
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "unauthorized_admin") {
      addToast("Unauthorized access. Admin privileges required.", "error");

      // Clean the URL (remove error param) without refreshing
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("error");
      router.replace(newUrl.pathname + newUrl.search);
    }
  }, [searchParams, addToast, router]);

  return null;
}

export default function AuthErrorListener() {
  return (
    <Suspense fallback={null}>
      <ErrorListenerContent />
    </Suspense>
  );
}