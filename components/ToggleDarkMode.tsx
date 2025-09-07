"use client";

import { useEffect, useId, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

const ToggleDarkMode = () => {
  const id = useId();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Hindari render sebelum theme siap → cegah hydration error
    return null;
  }

  const isDark = theme === "dark";

  return (
    <div
      className="group inline-flex items-center gap-2"
      data-state={isDark ? "checked" : "unchecked"}
    >
      <span
        id={`${id}-light`}
        className="cursor-pointer text-left text-sm font-medium group-data-[state=checked]:text-muted-foreground/70"
        aria-controls={id}
        onClick={() => setTheme("light")}
      >
        <SunIcon className="size-4" aria-hidden="true" />
      </span>

      <Switch
        id={id}
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-labelledby={`${id}-dark ${id}-light`}
        aria-label="Toggle between dark and light mode"
      />

      <span
        id={`${id}-dark`}
        className="cursor-pointer text-right text-sm font-medium group-data-[state=unchecked]:text-muted-foreground/70"
        aria-controls={id}
        onClick={() => setTheme("dark")}
      >
        <MoonIcon className="size-4" aria-hidden="true" />
      </span>
    </div>
  );
};

export default ToggleDarkMode;
