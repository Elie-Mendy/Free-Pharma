import {
    Button,
    Flex,
    HStack,
    Input,
    Stack,
    useColorModeValue,
} from "@chakra-ui/react";

export default function BuySellForm() {
    return (
        <Flex as={"form"} direction={"column"} align={"stretch"} gap={4}>
            <Stack spacing={4}>
                <Input
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
                    fontFamily={"heading"}
                    w={"full"}
                    bgGradient="linear(to-r, green.300,green.500)"
                    color={"white"}
                    _hover={{
                        bgGradient: "linear(to-r, green.400,green.600)",
                        boxShadow: "xl",
                    }}
                >
                    Déposer
                </Button>
                <Button
                    fontFamily={"heading"}
                    w={"full"}
                    bgGradient="linear(to-r, red.300,red.500)"
                    color={"white"}
                    _hover={{
                        bgGradient: "linear(to-r, red.400,red.600)",
                        boxShadow: "xl",
                    }}
                >
                    Retirer
                </Button>
            </HStack>
        </Flex>
    );
}
