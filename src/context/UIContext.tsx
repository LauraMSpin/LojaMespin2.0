import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { CustomLine, CustomProduct, KitGroup, Product } from "../types";

export interface CustomDialogState {
  product: CustomProduct;
  /** Preenchido ao editar uma encomenda que já está no carrinho. */
  editLine?: CustomLine;
}

/** Edição de um grupo de kits que já está no carrinho. */
export interface KitEditState {
  group: KitGroup;
  /** Unidade a destacar ao abrir. */
  focusUnitId?: string;
  /** Abre com uma unidade nova em branco no fim. */
  addUnit?: boolean;
}

interface UIContextValue {
  selectedProduct: Product | null;
  kitEdit: KitEditState | null;
  openProduct: (product: Product) => void;
  openKitEdit: (product: Product, edit: KitEditState) => void;
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
  const [kitEdit, setKitEdit] = useState<KitEditState | null>(null);
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
      kitEdit,
      openProduct: (product: Product) => {
        setKitEdit(null);
        setSelectedProduct(product);
      },
      openKitEdit: (product: Product, edit: KitEditState) => {
        setKitEdit(edit);
        setSelectedProduct(product);
      },
      closeProduct: () => {
        setSelectedProduct(null);
        setKitEdit(null);
      },
      customDialog,
      openCustom: (product: CustomProduct, editLine?: CustomLine) => setCustomDialog({ product, editLine }),
      closeCustom: () => setCustomDialog(null),
      toast,
      showToast
    }),
    [selectedProduct, kitEdit, customDialog, toast, showToast]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI deve ser usado dentro de UIProvider");
  return ctx;
}
