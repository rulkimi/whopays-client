"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ViewMode = "simple" | "detailed";

export default function SplitViewToggle({
  initialMode = "detailed",
  onChange,
}: {
  initialMode?: ViewMode;
  onChange?: (mode: ViewMode) => void;
}) {
  const [mode, setMode] = useState<ViewMode>(initialMode);

  useEffect(() => {
    onChange?.(mode);
  }, [mode, onChange]);

  const setSimple = useCallback(() => setMode("simple"), []);
  const setDetailed = useCallback(() => setMode("detailed"), []);

  return (
    <div className="inline-flex items-center gap-2">
      <Button
        variant={mode === "simple" ? "default" : "outline"}
        size="sm"
        onClick={setSimple}
      >
        Simple
      </Button>
      <Button
        variant={mode === "detailed" ? "default" : "outline"}
        size="sm"
        onClick={setDetailed}
      >
        Detailed
      </Button>
    </div>
  );
}
