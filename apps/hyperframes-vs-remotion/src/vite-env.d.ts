/// <reference types="vite/client" />

import type * as React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "hyperframes-player": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          controls?: boolean;
          muted?: boolean;
          loop?: boolean;
          autoplay?: boolean;
          width?: number | string;
          height?: number | string;
          "playback-rate"?: number | string;
        },
        HTMLElement
      >;
    }
  }
}
