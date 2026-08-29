"use client";

import {
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { readClientContact } from "@/app/lib/clientContact";

type GatedShopLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  /** Where a signed-up (returning) visitor should land. Defaults to the shop home. */
  shopHref?: string;
  /** Where an un-authed visitor is routed to create an account. */
  gateHref?: string;
  children: ReactNode;
};

/**
 * A link into the shop that respects the research-access gate. On the server
 * and before hydration it points at the account wall (`gateHref`) so a visitor
 * who never signed up can't slip into the shop. Once mounted, if this browser
 * already has a saved account (captured at /research-access), it upgrades the
 * href to the real shop target (`shopHref`) so returning members aren't
 * re-walled.
 */
export function GatedShopLink({
  shopHref = "/",
  gateHref = "/research-access",
  children,
  ...rest
}: GatedShopLinkProps) {
  const [href, setHref] = useState(gateHref);

  useEffect(() => {
    try {
      const { email } = readClientContact();
      if (email) setHref(shopHref);
    } catch {
      // localStorage/posthog unavailable — stay gated.
    }
  }, [shopHref]);

  return (
    <a {...rest} href={href}>
      {children}
    </a>
  );
}
