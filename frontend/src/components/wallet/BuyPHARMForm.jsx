import {
    Button,
    Flex,
    HStack,
    Input,
    Stack,
    useColorModeValue,
} from "@chakra-ui/react";

export default function BuyPHARMForm() {
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
