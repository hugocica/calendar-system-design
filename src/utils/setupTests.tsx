import { render, RenderOptions } from "@testing-library/react";
import { PropsWithChildren, ReactNode } from "react";
import Providers from "../providers";

const AllTheProviders = ({ children }: PropsWithChildren<{}>) => {
  return <Providers>{children}</Providers>;
};

const customRender = (ui: ReactNode, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
