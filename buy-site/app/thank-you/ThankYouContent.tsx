"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/app/lib/CartContext";

export function ThankYouContent() {
  const searchParams = useSearchParams();
  const { clear } = useCart();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <>
      <h1>Thank You For Your Order</h1>
      <p>
        Your payment was successful. A receipt has been emailed to you, and
        we&rsquo;ll send tracking information as soon as your order ships.
      </p>
      <p>
        Questions in the meantime? Email us at{" "}
        <a href="mailto:paigespierce@gmail.com">paigespierce@gmail.com</a>.
      </p>
      <Link href="/#products" className="btn-primary thank-you__cta">
        Continue Shopping
      </Link>
    </>
  );
}
