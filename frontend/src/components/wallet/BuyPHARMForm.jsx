import { useWagmi } from "@/hooks/useWagmi";
import { config } from "@/config";

import {
    Button,
    Flex,
    HStack,
    Input,
    Stack,
    useColorModeValue,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { TokenPHARMContext } from "@/providers/TokenPHARMProvider";

export default function BuyPHARMForm() {
    const { address } = useWagmi();
    const [amount, setAmount] = useState(0);
    const { mint } = useContext(TokenPHARMContext);

    return (
        <Flex as={"form"} direction={"column"} align={"stretch"} gap={4}>
            <Stack spacing={4}>
                <Input
                    type={"number"}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Montant"
                    bg={useColorModeValue("gray.100", "gray.600")}
                    border={0}
                    color={useColorModeValue("gray.600", "gray.300")}
                    _placeholder={{
                        color: "gray.400",
                    }}
                />
            </Stack>
            <HStack w={"full"} gap={4}>
                <Button
                    onClick={() => mint(address, amount * 10 ** 18)}
                    fontFamily={"heading"}
                    w={"full"}
                    bgGradient="linear(to-r, red.300,pink.400)"
                    color={"white"}
                    _hover={{
                        bgGradient: "linear(to-r, red.400,pink.600)",
                        boxShadow: "xl",
                    }}
                >
                    Acheter
                </Button>
            </HStack>
        </Flex>
    );
}
