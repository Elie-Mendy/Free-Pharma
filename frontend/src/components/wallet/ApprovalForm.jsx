import {
    Button,
    Flex,
    HStack,
    Input,
    Stack,
    useColorModeValue,
} from "@chakra-ui/react";
import { config } from "@/config";
import { useContext, useState } from "react";
import { TokenPHARMContext } from "@/providers/TokenPHARMProvider";

export default function ApprovalForm() {
    const [amount, setAmount] = useState(0);
    const contractAddress = config.contracts.FreePharma.address;
    const { increaseAllowance, decreaseAllowance } =
        useContext(TokenPHARMContext);

    return (
        <Flex as={"form"} mt={4} direction={"column"} align={"stretch"}>
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
            <HStack mt={4} w={"full"} gap={4}>
                <Button
                    onClick={() =>
                        increaseAllowance(contractAddress, amount * 10 ** 18)
                    }
                    fontFamily={"heading"}
                    w={"full"}
                    bgGradient="linear(to-r, green.300,green.500)"
                    color={"white"}
                    _hover={{
                        bgGradient: "linear(to-r, green.400,green.600)",
                        boxShadow: "xl",
                    }}
                >
                    Augmenter
                </Button>
                <Button
                    onClick={() =>
                        decreaseAllowance(contractAddress, amount * 10 ** 18)
                    }
                    fontFamily={"heading"}
                    w={"full"}
                    bgGradient="linear(to-r, red.300,red.500)"
                    color={"white"}
                    _hover={{
                        bgGradient: "linear(to-r, red.400,red.600)",
                        boxShadow: "xl",
                    }}
                >
                    Abaisser
                </Button>
            </HStack>
        </Flex>
    );
}
