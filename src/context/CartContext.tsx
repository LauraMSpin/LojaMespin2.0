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
import type { CartItemDetail, CartLine } from "../types";

export interface CartContextValue {
  lines: CartLine[];
  items: CartItemDetail[];
  count: number;
  total: number;
  isOpen: boolean;
  /** Incrementa a cada adição; usado para animar o ícone do carrinho. */
  addedPulse: number;
  openCart: () => void;
  closeCart: () => void;
  addLines: (lines: CartLine[]) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeLine: (key: string) => void;
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, undefined, loadInitial);
  const [isOpen, setIsOpen] = useState(false);
  const [addedPulse, setAddedPulse] = useState(0);
  const max = STORE_CONFIG.maxQuantityPerLine;
  const skipFirstSave = useRef(true);

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

  // Mantém várias abas sincronizadas.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY) {
        dispatch({ type: "replace", lines: parseStoredCart(event.newValue) });
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const items = useMemo(() => getCartDetails(lines, PRODUCTS), [lines]);

  const addLines = useCallback(
    (newLines: CartLine[]) => {
      dispatch({ type: "add", lines: newLines, max });
      setAddedPulse((n) => n + 1);
    },
    [max]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      items,
      count: cartCount(items),
      total: cartTotal(items),
      isOpen,
      addedPulse,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addLines,
      setQuantity: (key, quantity) => dispatch({ type: "setQuantity", key, quantity, max }),
      removeLine: (key) => dispatch({ type: "remove", key }),
      clearCart: () => dispatch({ type: "clear" })
    }),
    [lines, items, isOpen, addedPulse, addLines, max]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
