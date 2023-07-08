import { ChakraProvider } from "@chakra-ui/react";

export default function ChakraUIProvider({ children }) {
    return <ChakraProvider>{children}</ChakraProvider>;
}
