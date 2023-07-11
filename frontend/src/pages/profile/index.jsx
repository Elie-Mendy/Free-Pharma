import MainLayout from "@/layouts/MainLayout";
import { Flex, Heading, Text } from "@chakra-ui/react";

function ProfilePage() {
    return (
        <MainLayout>
            <Flex w={"100%"} h={"100%"} justify={"center"} align={"center"}>
                <Heading>
                    <Text fontSize={{ base: "2xl", md: "5xl" }} mb={2}>
                        Espace personnel en construction ...
                    </Text>
                </Heading>
            </Flex>
        </MainLayout>
    );
}

export default ProfilePage;
