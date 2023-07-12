import { Box, Button, HStack, Input, Stack, Switch, Text, useColorModeValue } from "@chakra-ui/react";

export default function FreelancerForm() {
    return (
        <Box as={"form"} mt={10}>
            <Stack spacing={4}>
                <Input
                    placeholder="Pseudonyme"
                    bg={useColorModeValue("gray.100", "gray.600")}
                    border={0}
                    color={useColorModeValue("gray.600", "gray.300")}
                    _placeholder={{
                        color: "gray.400",
                    }}
                />
                <Input
                    placeholder="email@freepharma.fr"
                    bg={useColorModeValue("gray.100", "gray.600")}
                    border={0}
                    color={useColorModeValue("gray.600", "gray.300")}
                    _placeholder={{
                        color: "gray.400",
                    }}
                />

                <Input
                    placeholder="Région parisienne"
                    bg={useColorModeValue("gray.100", "gray.600")}
                    border={0}
                    color={useColorModeValue("gray.600", "gray.300")}
                    _placeholder={{
                        color: "gray.400",
                    }}
                />
                <HStack>
                    <Switch colorScheme="cyan" id="availablility" size={"lg"} />
                    <Text
                        color={"gray.500"}
                        fontSize={{ base: "sm", sm: "md" }}
                    >
                        Disponible
                    </Text>
                </HStack>
                <HStack>
                    <Switch colorScheme="pink" id="visibility" size={"lg"} />
                    <Text
                        color={"gray.500"}
                        fontSize={{ base: "sm", sm: "md" }}
                    >
                        Visibile par les recruteurs
                    </Text>
                </HStack>
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
