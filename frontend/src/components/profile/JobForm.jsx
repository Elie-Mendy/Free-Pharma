import {
    Box,
    Button,
    Flex,
    HStack,
    Input,
    Stack,
    Switch,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";

export default function JobForm() {
    return (
        <Box as={"form"} mt={10}>
            <Stack spacing={4}>
                <Flex w={"full"}>
                    <Box w={"50%"} mr={2}>
                        <Text>Date de début</Text>
                        <Input
                            type="date"
                            bg={useColorModeValue("gray.100", "gray.600")}
                            border={0}
                            color={useColorModeValue("gray.600", "gray.300")}
                            _placeholder={{
                                color: "gray.400",
                            }}
                        />
                    </Box>
                    <Box w={"50%"} ml={2}>
                        <Text>Date de fin</Text>
                        <Input
                            type="date"
                            bg={useColorModeValue("gray.100", "gray.600")}
                            border={0}
                            color={useColorModeValue("gray.600", "gray.300")}
                            _placeholder={{
                                color: "gray.400",
                            }}
                        />
                    </Box>
                </Flex>

                <Input
                    type="number"
                    placeholder="Salaire"
                    bg={useColorModeValue("gray.100", "gray.600")}
                    border={0}
                    color={useColorModeValue("gray.600", "gray.300")}
                    _placeholder={{
                        color: "gray.400",
                    }}
                />

                <Input
                    type="number"
                    placeholder="Localisation"
                    bg={useColorModeValue("gray.100", "gray.600")}
                    border={0}
                    color={useColorModeValue("gray.600", "gray.300")}
                    _placeholder={{
                        color: "gray.400",
                    }}
                />
            </Stack>
            <Button
                fontFamily={"heading"}
                mt={8}
                w={"full"}
                bgGradient="linear(to-r, red.400,pink.400)"
                color={"white"}
                _hover={{
                    bgGradient: "linear(to-r, red.400,pink.400)",
                    boxShadow: "xl",
                }}
            >
                Enregistrer
            </Button>
        </Box>
    );
}
