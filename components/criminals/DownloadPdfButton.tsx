"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function DownloadPdfButton({
  criminalId,
  pid,
  size = "sm",
  variant = "outline",
}: {
  criminalId: string;
  pid: string;
  size?: "sm" | "md";
  variant?: "outline" | "primary";
}) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch(`/api/criminals/${criminalId}/pdf`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to generate PDF");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `criminal-${pid}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Download failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      disabled={loading}
      onClick={handleDownload}
    >
      {loading ? "Generating…" : "Download PDF"}
    </Button>
  );
}
