declare module "*.svg" {
  import * as React from "react";
  const src: string;
  export default src;
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
}

