import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type ToothSelectionValue = {
  selected: string[];
  toggle: (label: string) => void;
  clear: () => void;
  isSelected: (label: string) => boolean;
};

const ToothSelectionContext = createContext<ToothSelectionValue | null>(null);

/**
 * The hero's tooth chart and the booking form sit in different branches of
 * the tree but describe the same thing: where it hurts. This carries the
 * selection between them.
 */
export function ToothSelectionProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = useCallback((label: string) => {
    setSelected((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    );
  }, []);

  const clear = useCallback(() => setSelected([]), []);

  const value = useMemo<ToothSelectionValue>(
    () => ({
      selected,
      toggle,
      clear,
      isSelected: (label) => selected.includes(label),
    }),
    [selected, toggle, clear],
  );

  return (
    <ToothSelectionContext.Provider value={value}>{children}</ToothSelectionContext.Provider>
  );
}

export function useToothSelection() {
  const context = useContext(ToothSelectionContext);
  if (!context) {
    throw new Error("useToothSelection must be used inside a ToothSelectionProvider");
  }
  return context;
}
