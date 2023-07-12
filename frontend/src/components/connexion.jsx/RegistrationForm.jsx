import {
    Box,
    Button,
    HStack,
    Heading,
    Input,
    Stack,
    Switch,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
} from "@chakra-ui/react";

function RegistrationForm() {
    return (
        <Stack
            bg={"gray.50"}
            rounded={"xl"}
            p={{ base: 4, sm: 6, md: 8 }}
            spacing={{ base: 8 }}
            maxW={{ lg: "lg" }}
        >
            <Stack spacing={4}>
                <Heading
                    color={"gray.800"}
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
            <Tabs isFitted variant="soft-rounded" colorScheme="cyan">
                <TabList>
                    <Tab>Freelancer</Tab>
                    <Tab>Porteur de projet</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <p>one!</p>
                    </TabPanel>
                    <TabPanel>
                        <p>two!</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Box as={"form"} mt={10}>
                <Stack spacing={4}>
                    <Input
                        placeholder="Pseudonyme"
                        bg={"gray.100"}
                        border={0}
                        color={"gray.500"}
                        _placeholder={{
                            color: "gray.400",
                        }}
                    />
                    <Input
                        placeholder="email@freepharma.fr"
                        bg={"gray.100"}
                        border={0}
                        color={"gray.500"}
                        _placeholder={{
                            color: "gray.400",
                        }}
                    />

                    <Input
                        placeholder="Région parisienne"
                        bg={"gray.100"}
                        border={0}
                        color={"gray.500"}
                        _placeholder={{
                            color: "gray.400",
                        }}
                    />
                    <HStack>
                        <Switch
                            colorScheme="cyan"
                            id="availablility"
                            size={"lg"}
                        />
                        <Text
                            color={"gray.500"}
                            fontSize={{ base: "sm", sm: "md" }}
                        >
                            Disponible
                        </Text>
                    </HStack>
                    <HStack>
                        <Switch
                            colorScheme="pink"
                            id="visibility"
                            size={"lg"}
                        />
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
                    Submit
                </Button>
            </Box>
            form
        </Stack>
    );
}

export default RegistrationForm;
