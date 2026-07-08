"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartLine = {
  slug: string;
  priceId: string;
  name: string;
  dose: string;
  unitPriceCents: number;
  image?: string;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  hydrated: boolean;
  isOpen: boolean;
};

type CartContextValue = CartState & {
  itemCount: number;
  subtotalCents: number;
  addItem: (item: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (priceId: string, quantity: number) => void;
  removeItem: (priceId: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const STORAGE_KEY = "peak.singles.cart.v1";
const MAX_QTY_PER_LINE = 20;

const CartContext = createContext<CartContextValue | null>(null);

function readStoredLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (l): l is CartLine =>
          !!l &&
          typeof l === "object" &&
          typeof (l as CartLine).priceId === "string" &&
          typeof (l as CartLine).slug === "string" &&
          typeof (l as CartLine).name === "string" &&
          typeof (l as CartLine).dose === "string" &&
          typeof (l as CartLine).unitPriceCents === "number" &&
          typeof (l as CartLine).quantity === "number",
      )
      .map((l) => ({
        ...l,
        quantity: Math.max(1, Math.min(MAX_QTY_PER_LINE, Math.floor(l.quantity))),
      }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Rehydrate the cart from localStorage exactly once after mount. This
    // pairs with `hydrated` so the initial client render matches the server
    // (both empty), and no consumer displays cart contents until `hydrated`
    // flips true — see ViewCartButton badge and CartDrawer contents.
    const stored = readStoredLines();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot rehydration from localStorage after mount; pairs with `hydrated` to avoid SSR mismatch
    if (stored.length > 0) setLines(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Storage unavailable (Safari private, quota, etc.) — cart still
      // works in-memory for the session.
    }
  }, [lines, hydrated]);

  const addItem = useCallback<CartContextValue["addItem"]>(
    (item, quantity = 1) => {
      setLines((prev) => {
        const existing = prev.find((l) => l.priceId === item.priceId);
        if (existing) {
          return prev.map((l) =>
            l.priceId === item.priceId
              ? {
                  ...l,
                  quantity: Math.min(
                    MAX_QTY_PER_LINE,
                    l.quantity + Math.max(1, quantity),
                  ),
                }
              : l,
          );
        }
        return [
          ...prev,
          { ...item, quantity: Math.min(MAX_QTY_PER_LINE, Math.max(1, quantity)) },
        ];
      });
    },
    [],
  );

  const setQuantity = useCallback<CartContextValue["setQuantity"]>(
    (priceId, quantity) => {
      const q = Math.floor(quantity);
      setLines((prev) => {
        if (q <= 0) return prev.filter((l) => l.priceId !== priceId);
        return prev.map((l) =>
          l.priceId === priceId
            ? { ...l, quantity: Math.min(MAX_QTY_PER_LINE, q) }
            : l,
        );
      });
    },
    [],
  );

  const removeItem = useCallback<CartContextValue["removeItem"]>((priceId) => {
    setLines((prev) => prev.filter((l) => l.priceId !== priceId));
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const itemCount = useMemo(
    () => lines.reduce((n, l) => n + l.quantity, 0),
    [lines],
  );
  const subtotalCents = useMemo(
    () => lines.reduce((n, l) => n + l.quantity * l.unitPriceCents, 0),
    [lines],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      hydrated,
      isOpen,
      itemCount,
      subtotalCents,
      addItem,
      setQuantity,
      removeItem,
      clear,
      openCart,
      closeCart,
    }),
    [
      lines,
      hydrated,
      isOpen,
      itemCount,
      subtotalCents,
      addItem,
      setQuantity,
      removeItem,
      clear,
      openCart,
      closeCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
