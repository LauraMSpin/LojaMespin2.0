import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode
} from "react";
import { PRODUCTS } from "../data/products";
import { STORE_CONFIG } from "../data/settings";
import {
  CART_STORAGE_KEY,
  cartCount,
  cartReducer,
  cartTotal,
  getCartDetails,
  parseStoredCart
} from "../services/cart";
import {
  CUSTOM_CART_STORAGE_KEY,
  customCartReducer,
  customHasPending,
  customTotalCents,
  getCustomDetails,
  parseStoredCustomCart
} from "../services/customOrders";
import type { CartItemDetail, CartLine, CustomLine, CustomOrderDetail } from "../types";

export interface CartContextValue {
  lines: CartLine[];
  items: CartItemDetail[];
  customLines: CustomLine[];
  customItems: CustomOrderDetail[];
  /** Soma dos valores conhecidos das encomendas personalizadas, em centavos. */
  customTotalCents: number;
  /** True quando o total dos personalizados é estimativa ("a partir de" ou sem valor). */
  customHasPending: boolean;
  /** Unidades de produtos comuns + número de encomendas personalizadas. */
  count: number;
  total: number;
  isEmpty: boolean;
  isOpen: boolean;
  /** Incrementa a cada adição; usado para animar o ícone do carrinho. */
  addedPulse: number;
  openCart: () => void;
  closeCart: () => void;
  addLines: (lines: CartLine[]) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeLine: (key: string) => void;
  addCustom: (line: CustomLine) => void;
  replaceCustom: (key: string, line: CustomLine) => void;
  removeCustom: (key: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

function loadInitial(): CartLine[] {
  try {
    return parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY));
  } catch {
    return [];
  }
}

function loadInitialCustom(): CustomLine[] {
  try {
    return parseStoredCustomCart(window.localStorage.getItem(CUSTOM_CART_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, undefined, loadInitial);
  const [customLines, dispatchCustom] = useReducer(customCartReducer, undefined, loadInitialCustom);
  const [isOpen, setIsOpen] = useState(false);
  const [addedPulse, setAddedPulse] = useState(0);
  const max = STORE_CONFIG.maxQuantityPerLine;
  const skipFirstSave = useRef(true);
  const skipFirstCustomSave = useRef(true);

  useEffect(() => {
    if (skipFirstSave.current) {
      skipFirstSave.current = false;
      return;
    }
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* armazenamento indisponível: o carrinho continua funcionando em memória */
    }
  }, [lines]);

  useEffect(() => {
    if (skipFirstCustomSave.current) {
      skipFirstCustomSave.current = false;
      return;
    }
    try {
      window.localStorage.setItem(CUSTOM_CART_STORAGE_KEY, JSON.stringify(customLines));
    } catch {
      /* armazenamento indisponível */
    }
  }, [customLines]);

  // Mantém várias abas sincronizadas.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY) {
        dispatch({ type: "replace", lines: parseStoredCart(event.newValue) });
      } else if (event.key === CUSTOM_CART_STORAGE_KEY) {
        dispatchCustom({ type: "load", lines: parseStoredCustomCart(event.newValue) });
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const items = useMemo(() => getCartDetails(lines, PRODUCTS), [lines]);
  const customItems = useMemo(() => getCustomDetails(customLines), [customLines]);

  const addLines = useCallback(
    (newLines: CartLine[]) => {
      dispatch({ type: "add", lines: newLines, max });
      setAddedPulse((n) => n + 1);
    },
    [max]
  );

  const addCustom = useCallback((line: CustomLine) => {
    dispatchCustom({ type: "add", line });
    setAddedPulse((n) => n + 1);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      items,
      customLines,
      customItems,
      customTotalCents: customTotalCents(customItems),
      customHasPending: customHasPending(customItems),
      count: cartCount(items) + customItems.length,
      total: cartTotal(items),
      isEmpty: items.length === 0 && customItems.length === 0,
      isOpen,
      addedPulse,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addLines,
      setQuantity: (key, quantity) => dispatch({ type: "setQuantity", key, quantity, max }),
      removeLine: (key) => dispatch({ type: "remove", key }),
      addCustom,
      replaceCustom: (key, line) => dispatchCustom({ type: "replace", key, line }),
      removeCustom: (key) => dispatchCustom({ type: "remove", key }),
      clearCart: () => {
        dispatch({ type: "clear" });
        dispatchCustom({ type: "clear" });
      }
    }),
    [lines, items, customLines, customItems, isOpen, addedPulse, addLines, addCustom, max]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
