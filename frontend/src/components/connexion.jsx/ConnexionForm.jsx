import { Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

function ConnexionForm() {
    return (
        <Stack
            bg={"gray.50"}
            rounded={"xl"}
            p={{ base: 4, sm: 6, md: 8 }}
            spacing={{ base: 8 }}
            maxW={{ lg: "lg" }}
        >
            <Stack spacing={4} gap={5}>
                <Heading
                    color={"gray.800"}
                    lineHeight={1.1}
                    fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
                >
                    Rejoignez la communauté{" "}
                    <Text
                        as={"span"}
                        bgGradient="linear(to-r, red.400,pink.400)"
                        bgClip="text"
                    >
                        Free Pharma !
                    </Text>
                </Heading>
                <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Nobis dolore autem obcaecati molestiae enim amet mollitia in
                    nesciunt at aspernatur!.
                </Text>
            </Stack>
            <Flex justify={"center"} mt={5}>
                <Heading as="h1" fontSize={"2xl"}>
                    <ConnectButton />
                </Heading>
            </Flex>
        </Stack>
    );
}

export default ConnexionForm;
