import {
    Heading,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import FreelancerForm from "../profile/FreelancerForm";
import EmployerForm from "../profile/EmployerForm";

function RegistrationForm() {
    return (
        <Stack
            bg={useColorModeValue("gray.50", "gray.700")}
            rounded={"xl"}
            p={{ base: 4, sm: 6, md: 8 }}
            spacing={{ base: 8 }}
            maxW={{ lg: "lg" }}
        >
            <Stack spacing={4}>
                <Heading
                    color={"gray.800"}
                    color={useColorModeValue("gray.800", "white")}
                    lineHeight={1.1}
                    fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
                >
                    Parlez nous de vous{" "}
                    <Text
                        as={"span"}
                        bgGradient="linear(to-r, red.400,pink.400)"
                        bgClip="text"
                    >
                        !
                    </Text>
                </Heading>
                <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Saepe veritatis adipisci architecto repudiandae rerum! Ut
                    aliquam dolor eveniet?
                </Text>
            </Stack>
            <Tabs isFitted variant="soft-rounded" colorScheme="blue">
                <TabList>
                    <Tab>Freelancer</Tab>
                    <Tab>Porteur de projet</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                       <FreelancerForm />
                    </TabPanel>
                    <TabPanel>
                        <EmployerForm />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Stack>
    );
}

export default RegistrationForm;
