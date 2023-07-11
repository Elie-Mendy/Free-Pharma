import MainLayout from "@/layouts/MainLayout";
import { Flex, Heading, Text } from "@chakra-ui/react";

function WalletPage() {
    return (
        <MainLayout>
            <Flex w={"100%"} h={"100vh"} justify={"center"} align={"center"}>
                <Heading>
                    <Text fontSize={{ base: "2xl", md: "5xl" }} mb={2}>
                        Espace portefeuille en construction ...
                    </Text>
                </Heading>
            </Flex>
        </MainLayout>
    );
}

export default WalletPage;
