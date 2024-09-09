import { ChakraProvider } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export default function Providers({ children }: PropsWithChildren<object>) {
  return <ChakraProvider>{children}</ChakraProvider>;
}
