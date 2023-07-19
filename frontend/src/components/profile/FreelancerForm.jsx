import {
    Box,
    Button,
    HStack,
    Input,
    Stack,
    Switch,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { useContext, useState } from "react";

import { FreePharmaContext } from "@/providers/FreePharmaProvider";
import { useNotif } from "@/hooks/useNotif";

export default function FreelancerForm() {
    const { throwNotif} = useNotif();
    const { createFreelancer } = useContext(FreePharmaContext);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");
    const [available, setAvailable] = useState(false);
    const [visible, setVisible] = useState(false);

    const handleSubmit = () => {
        if (
            name === "" ||
            email === "" ||
            location === "" 
        ) {
            throwNotif("error", "Veuillez renseigner tous les champs du formulaire.");
            return;
        }

        createFreelancer(name, email, location, available, visible);
    };

    return (
        <Box as={"form"} mt={5}>
            <Stack spacing={4}>
                <Input
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Pseudonyme"
                    bg={useColorModeValue("gray.100", "gray.600")}
                    border={0}
                    color={useColorModeValue("gray.600", "gray.300")}
                    _placeholder={{
                        color: "gray.400",
                    }}
                />
                <Input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="email@freepharma.fr"
                    bg={useColorModeValue("gray.100", "gray.600")}
                    border={0}
                    color={useColorModeValue("gray.600", "gray.300")}
                    _placeholder={{
                        color: "gray.400",
                    }}
                />

                <Input
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Région parisienne"
                    bg={useColorModeValue("gray.100", "gray.600")}
                    border={0}
                    color={useColorModeValue("gray.600", "gray.300")}
                    _placeholder={{
                        color: "gray.400",
                    }}
                />
                <HStack>
                    <Switch onChange={() => setAvailable(!available)} colorScheme="cyan" id="availablility" size={"lg"} />
                    <Text
                        color={"gray.500"}
                        fontSize={{ base: "sm", sm: "md" }}
                    >
                        Disponible
                    </Text>
                </HStack>
                <HStack>
                    <Switch onChange={() => setVisible(!visible)} colorScheme="pink" id="visibility" size={"lg"} />
                    <Text
                        color={"gray.500"}
                        fontSize={{ base: "sm", sm: "md" }}
                    >
                        Visibile par les recruteurs
                    </Text>
                </HStack>
            </Stack>
            <Button
                onClick={handleSubmit}
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
