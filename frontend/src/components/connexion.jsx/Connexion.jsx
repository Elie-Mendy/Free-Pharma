import { Flex, Heading, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Connexion = () => {
    return (
        <Flex
            w={"100%"}
            h={"100vh"}
            justify={"center"}
            align={"center"}
            border={"1px"}
            direction={"column"}
        >
            <Heading>
                <Text fontSize={{ base: "2xl", md: "6xl" }} mb={2}>
                    Bienvenue sur Free Pharma
                </Text>

            </Heading>
            <ConnectButton />

        </Flex>
    );
};
