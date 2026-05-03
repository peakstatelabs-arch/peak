import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "paypal-add-to-cart-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { "data-id"?: string },
        HTMLElement
      >;
      "paypal-cart-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { "data-id"?: string },
        HTMLElement
      >;
    }
  }
}
