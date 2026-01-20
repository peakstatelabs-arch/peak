"use client";

import { useState } from "react";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQProps {
  items: FAQItem[];
}

export function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl border border-[var(--border)] bg-white shadow-sm overflow-hidden card-hover"
        >
          <button
            onClick={() => toggle(index)}
            className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-[var(--muted)]/50"
          >
            <span className="text-base font-semibold text-[var(--primary)] pr-4">
              {item.q}
            </span>
            <span
              className={`faq-icon flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent-dark)] font-bold transition-transform duration-300 ${
                openIndex === index ? "rotate-45" : ""
              }`}
            >
              +
            </span>
          </button>
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              openIndex === index
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <p className="px-6 pb-6 text-sm leading-7 text-[var(--primary)]/70">
                {item.a}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
