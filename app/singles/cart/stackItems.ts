import { RECOVERY_STACK_PRICE_IDS } from "./priceCatalog";
import type { CartLine } from "./CartContext";

/** Stack name, used in page copy. Change it here. */
export const RECOVERY_STACK_NAME = "FULL REPAIR";

type StackItem = Omit<CartLine, "quantity">;

// The two FULL REPAIR stack sizes as cart items (mirror the Stripe Prices).
export const STACK_ONE: StackItem = {
  slug: "full-repair-one",
  priceId: RECOVERY_STACK_PRICE_IDS.one,
  name: `${RECOVERY_STACK_NAME} Stack — One Stack`,
  dose: "1 vial each: BPC-157 + TB-500, KPV, GHK-Cu",
  unitPriceCents: 24900,
  image: "/Recovery%20Stack%201.png",
};

export const STACK_TWO: StackItem = {
  slug: "full-repair-two",
  priceId: RECOVERY_STACK_PRICE_IDS.two,
  name: `${RECOVERY_STACK_NAME} Stack — Two Stacks`,
  dose: "2 vials each: BPC-157 + TB-500, KPV, GHK-Cu",
  unitPriceCents: 44900,
  image: "/Recovery%20Stack%202%20.png",
};

/**
 * Two One Stacks cost more than one Two Stacks ($498 vs $449), so every pair
 * of One Stacks in the cart becomes a Two Stacks. Returns the lines unchanged
 * when there's nothing to combine.
 */
export function combineStacks(lines: CartLine[], maxPerLine: number): CartLine[] {
  const one = lines.find((l) => l.priceId === STACK_ONE.priceId);
  if (!one || one.quantity < 2) return lines;

  const two = lines.find((l) => l.priceId === STACK_TWO.priceId);
  const pairs = Math.floor(one.quantity / 2);
  const twoQty = Math.min(maxPerLine, (two?.quantity ?? 0) + pairs);
  const oneQty = one.quantity % 2;

  const next: CartLine[] = [];
  for (const l of lines) {
    if (l.priceId === STACK_ONE.priceId) {
      // The Two Stacks line takes the One Stack's place if it's new.
      if (!two) next.push({ ...STACK_TWO, quantity: twoQty });
      if (oneQty > 0) next.push({ ...l, quantity: oneQty });
    } else if (l.priceId === STACK_TWO.priceId) {
      next.push({ ...l, quantity: twoQty });
    } else {
      next.push(l);
    }
  }
  return next;
}
