import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { CustomLine, CustomProduct, Product } from "../types";

export interface CustomDialogState {
  product: CustomProduct;
  /** Preenchido ao editar uma encomenda que já está no carrinho. */
  editLine?: CustomLine;
}

interface UIContextValue {
  selectedProduct: Product | null;
  openProduct: (product: Product) => void;
  closeProduct: () => void;
  customDialog: CustomDialogState | null;
  openCustom: (product: CustomProduct, editLine?: CustomLine) => void;
  closeCustom: () => void;
  toast: string | null;
  showToast: (message: string) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customDialog, setCustomDialog] = useState<CustomDialogState | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const value = useMemo(
    () => ({
      selectedProduct,
      openProduct: setSelectedProduct,
      closeProduct: () => setSelectedProduct(null),
      customDialog,
      openCustom: (product: CustomProduct, editLine?: CustomLine) => setCustomDialog({ product, editLine }),
      closeCustom: () => setCustomDialog(null),
      toast,
      showToast
    }),
    [selectedProduct, customDialog, toast, showToast]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI deve ser usado dentro de UIProvider");
  return ctx;
}
