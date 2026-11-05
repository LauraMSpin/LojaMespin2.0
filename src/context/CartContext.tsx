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
  parseStoredCart,
  roundMoney
} from "../services/cart";
import {
  CUSTOM_CART_STORAGE_KEY,
  customCartReducer,
  customHasPending,
  customTotalCents,
  getCustomDetails,
  parseStoredCustomCart
} from "../services/customOrders";
import {
  KIT_CART_STORAGE_KEY,
  getKitDetails,
  isKit,
  kitCartReducer,
  kitTotal,
  kitUnitCount,
  parseStoredKitCart
} from "../services/kits";
import type {
  CartItemDetail,
  CartLine,
  CustomLine,
  CustomOrderDetail,
  KitGroup,
  KitGroupDetail
} from "../types";

export interface CartContextValue {
  lines: CartLine[];
  items: CartItemDetail[];
  kitGroups: KitGroup[];
  kitItems: KitGroupDetail[];
  customLines: CustomLine[];
  customItems: CustomOrderDetail[];
  /** Soma dos valores conhecidos das encomendas personalizadas, em centavos. */
  customTotalCents: number;
  /** True quando o total dos personalizados é estimativa ("a partir de" ou sem valor). */
  customHasPending: boolean;
  /** Unidades de produtos comuns + unidades de kits + número de encomendas personalizadas. */
  count: number;
  /** Total dos produtos comuns e kits (sem os personalizados), em reais. */
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
  addKitGroup: (group: KitGroup) => void;
  replaceKitGroup: (key: string, group: KitGroup) => void;
  removeKitUnit: (key: string, unitId: string) => void;
  removeKitGroup: (key: string) => void;
  addCustom: (line: CustomLine) => void;
  replaceCustom: (key: string, line: CustomLine) => void;
  removeCustom: (key: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

function loadInitial(): CartLine[] {
  try {
    // Kits têm carrinho próprio: linhas antigas de kits (sem escolha por item) são descartadas.
    return parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY)).filter(
      (line) => !isKit(PRODUCTS.find((p) => p.id === line.productId))
    );
  } catch {
    return [];
  }
}

function loadInitialKits(): KitGroup[] {
  try {
    return parseStoredKitCart(window.localStorage.getItem(KIT_CART_STORAGE_KEY));
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

function usePersist<T>(key: string, value: T) {
  const skipFirst = useRef(true);
  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* armazenamento indisponível: o carrinho continua funcionando em memória */
    }
  }, [key, value]);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, undefined, loadInitial);
  const [kitGroups, dispatchKit] = useReducer(kitCartReducer, undefined, loadInitialKits);
  const [customLines, dispatchCustom] = useReducer(customCartReducer, undefined, loadInitialCustom);
  const [isOpen, setIsOpen] = useState(false);
  const [addedPulse, setAddedPulse] = useState(0);
  const max = STORE_CONFIG.maxQuantityPerLine;

  usePersist(CART_STORAGE_KEY, lines);
  usePersist(KIT_CART_STORAGE_KEY, kitGroups);
  usePersist(CUSTOM_CART_STORAGE_KEY, customLines);

  // Mantém várias abas sincronizadas.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY) {
        dispatch({ type: "replace", lines: parseStoredCart(event.newValue) });
      } else if (event.key === KIT_CART_STORAGE_KEY) {
        dispatchKit({ type: "load", groups: parseStoredKitCart(event.newValue) });
      } else if (event.key === CUSTOM_CART_STORAGE_KEY) {
        dispatchCustom({ type: "load", lines: parseStoredCustomCart(event.newValue) });
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const items = useMemo(() => getCartDetails(lines, PRODUCTS), [lines]);
  const kitItems = useMemo(() => getKitDetails(kitGroups), [kitGroups]);
  const customItems = useMemo(() => getCustomDetails(customLines), [customLines]);

  const addLines = useCallback(
    (newLines: CartLine[]) => {
      dispatch({ type: "add", lines: newLines, max });
      setAddedPulse((n) => n + 1);
    },
    [max]
  );

  const addKitGroup = useCallback((group: KitGroup) => {
    dispatchKit({ type: "add", group });
    setAddedPulse((n) => n + 1);
  }, []);

  const addCustom = useCallback((line: CustomLine) => {
    dispatchCustom({ type: "add", line });
    setAddedPulse((n) => n + 1);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      items,
      kitGroups,
      kitItems,
      customLines,
      customItems,
      customTotalCents: customTotalCents(customItems),
      customHasPending: customHasPending(customItems),
      count: cartCount(items) + kitUnitCount(kitItems) + customItems.length,
      total: roundMoney(cartTotal(items) + kitTotal(kitItems)),
      isEmpty: items.length === 0 && kitItems.length === 0 && customItems.length === 0,
      isOpen,
      addedPulse,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addLines,
      setQuantity: (key, quantity) => dispatch({ type: "setQuantity", key, quantity, max }),
      removeLine: (key) => dispatch({ type: "remove", key }),
      addKitGroup,
      replaceKitGroup: (key, group) => dispatchKit({ type: "replace", key, group }),
      removeKitUnit: (key, unitId) => dispatchKit({ type: "removeUnit", key, unitId }),
      removeKitGroup: (key) => dispatchKit({ type: "removeGroup", key }),
      addCustom,
      replaceCustom: (key, line) => dispatchCustom({ type: "replace", key, line }),
      removeCustom: (key) => dispatchCustom({ type: "remove", key }),
      clearCart: () => {
        dispatch({ type: "clear" });
        dispatchKit({ type: "clear" });
        dispatchCustom({ type: "clear" });
      }
    }),
    [lines, items, kitGroups, kitItems, customLines, customItems, isOpen, addedPulse, addLines, addKitGroup, addCustom, max]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
