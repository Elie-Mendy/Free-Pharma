import { useContext, useState } from "react";
import { useNotif } from "@/hooks/useNotif";
import { FreePharmaContext } from "@/providers/FreePharmaProvider";

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

export default function EmployerForm() {
    const { setEmployer, currentUser } = useContext(FreePharmaContext);
    console.log("EmployerForm currentUser: ", currentUser);
    const { throwNotif } = useNotif();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [visible, setVisible] = useState(currentUser.visible && currentUser.visible);

    const handleSubmit = () => {
        if (name === "" || email === "" || location === "") {
            throwNotif(
                "error",
                "Veuillez renseigner tous les champs du formulaire."
            );
            return;
        }
        setEmployer(name, email, visible);
    };

    return (
        <Box as={"form"} mt={10}>
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
                    placeholder={
                        currentUser.created_at ? currentUser.email : "Email"
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
                        Visibile sur la plateforme
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
