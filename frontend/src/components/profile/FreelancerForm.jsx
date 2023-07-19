import { useContext, useState } from "react";
import { useNotif } from "@/hooks/useNotif";
import { FreePharmaContext } from "@/providers/FreePharmaProvider";
import { DataStorageContext } from "@/providers/DataStorageProvider";

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

export default function FreelancerForm() {
    const { userProfile, setUserProfile } = useContext(DataStorageContext);

    const { createFreelancer, setFreelancer, currentUser } =
        useContext(FreePharmaContext);

    const { throwNotif } = useNotif();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");
    const [averageDailyRate, setAverageDailyRate] = useState("");
    const [available, setAvailable] = useState(currentUser.available && currentUser.available);
    const [visible, setVisible] = useState(currentUser.visible && currentUser.visible);

    const handleSubmit = () => {
        if (name === "" || email === "" || location === "") {
            throwNotif(
                "error",
                "Veuillez renseigner tous les champs du formulaire."
            );
            return;
        }
        if (currentUser & (currentUser.created_at == 0)) {
            console.log("createFreelancer function !")
            createFreelancer(name, email, location, averageDailyRate,  available, visible);
        } else {
            console.log("setFreelancer function !")
            setFreelancer(name, email, location, averageDailyRate, available, visible);
        }
    };

    return (
        <Box as={"form"} mt={5}>
            <Stack spacing={4}>
                <Input
                    onChange={(e) => setName(e.target.value)}
                    placeholder={
                        currentUser.created_at ? currentUser.name : "Nom"
                    }
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
                    placeholder={
                        currentUser.created_at
                            ? currentUser.email
                            : "email@freepharma.fr"
                    }
                    bg={useColorModeValue("gray.100", "gray.600")}
                    border={0}
                    color={useColorModeValue("gray.600", "gray.300")}
                    _placeholder={{
                        color: "gray.400",
                    }}
                />

                
                <Input
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={
                        currentUser.created_at
                            ? currentUser.location
                            : "Lieu de résidence"
                    }
                    bg={useColorModeValue("gray.100", "gray.600")}
                    border={0}
                    color={useColorModeValue("gray.600", "gray.300")}
                    _placeholder={{
                        color: "gray.400",
                    }}
                />
                <Input
                    onChange={(e) => setAverageDailyRate(e.target.value)}
                    type="number"
                    placeholder={
                        currentUser.created_at
                            ? currentUser.averageDailyRate
                            : "Taux horaire journalier"
                    }
                    bg={useColorModeValue("gray.100", "gray.600")}
                    border={0}
                    color={useColorModeValue("gray.600", "gray.300")}
                    _placeholder={{
                        color: "gray.400",
                    }}
                />
                <HStack>
                    <Switch
                        onChange={() => setAvailable(!available)}
                        isChecked={available}
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
                        onChange={() => setVisible(!visible)}
                        isChecked={visible}
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
