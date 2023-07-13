import MainLayout from "@/layouts/MainLayout";
import {
    Flex,
    Stack,
    Heading,
    Text,
    Box,
    useColorModeValue,
    Hide,
    Show,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
} from "@chakra-ui/react";
import BlurBackground from "@/components/generic/BlurBackground";
import FreelancerForm from "@/components/profile/FreelancerForm";
import { FreelancerTableData } from "../../components/profile/FreelancerTableData";
import FreelancerStats from "@/components/profile/FreelancerStats";
import EmployerStats from "@/components/profile/EmployerStats";
import { EmployerTableData } from "@/components/profile/EmployerTableData";
import EmployerForm from "@/components/profile/EmployerForm";

const isEmployer = true;

const data = {
    title: isEmployer
        ? "Mettez à jour les informations de votre entreprise."
        : "Mettez à jour vos informations personnels.",
    helpText:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe veritatis adipisci architecto repudiandae rerum! Ut aliquam dolor eveniet?",
};

const EditProfile = () => {
    return (
        <Stack
            bg={useColorModeValue("gray.50", "gray.700")}
            rounded={"xl"}
            p={{ base: 4, sm: 6, md: 8 }}
            spacing={{ base: 8 }}
            maxW={{ base: "100%", xl: "md" }}
        >
            <Stack spacing={4}>
                <Heading
                    color={useColorModeValue("gray.800", "white")}
                    lineHeight={1.1}
                    fontSize={{
                        base: "2xl",
                        sm: "3xl",
                        md: "4xl",
                    }}
                >
                    {data.title}
                </Heading>
                <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
                    {data.helpText}
                </Text>
            </Stack>
            {isEmployer ? <EmployerForm /> : <FreelancerForm />}
        </Stack>
    );
};

function ProfilePage() {
    return (
        <MainLayout>
            <Box>
                <BlurBackground />
            </Box>
            <Flex
                h={"100%"}
                w={"100%"}
                direction={{ base: "column", xl: "row" }}
                align={{ base: "center", xl: "stretch" }}
            >
                <Flex
                    direction={"column"}
                    position={"relative"}
                    w={{ base: "100%", lg: "95%" }}
                    h={"100%"}
                    gap={25}
                    justify={{ base: "flex-start" }}
                >
                    {isEmployer ? <EmployerStats /> : <FreelancerStats />}

                    <Show above="xl">
                        {isEmployer ? (
                            <EmployerTableData />
                        ) : (
                            <FreelancerTableData />
                        )}
                    </Show>
                    <Hide above="xl">
                        <Accordion allowMultiple>
                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box
                                            as="span"
                                            flex="1"
                                            textAlign="center"
                                            fontSize={"xl"}
                                        >
                                            <Heading>
                                                Détails de vos missions
                                            </Heading>
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel>
                                    <FreelancerTableData />
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                        <Box pb={10}>
                            <EditProfile />
                        </Box>
                    </Hide>
                </Flex>
                <Show above="xl">
                    <EditProfile />
                </Show>
            </Flex>
        </MainLayout>
    );
}

export default ProfilePage;
