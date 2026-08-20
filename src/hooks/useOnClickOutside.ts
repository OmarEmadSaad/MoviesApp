import { useEffect, type RefObject } from "react";

export function useOnClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    const listener = (event: Event) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener("pointerdown", listener);
    document.addEventListener("focusin", listener);
    return () => {
      document.removeEventListener("pointerdown", listener);
      document.removeEventListener("focusin", listener);
    };
  }, [ref, handler, enabled]);
}
