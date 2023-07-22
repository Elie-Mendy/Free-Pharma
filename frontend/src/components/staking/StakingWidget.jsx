import {
    HStack,
    Heading,
    Stack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import StakingForm from "./StakingForm";
import { StakingInfoModal } from "./StakingInfoModal";
function StakingWidget() {
    return (
        <Stack
            bg={useColorModeValue("gray.50", "gray.700")}
            rounded={"xl"}
            p={{ base: 4, sm: 6, md: 8 }}
            spacing={4}
            shadow={"xl"}
        >
            <Stack spacing={4}>
                <Heading
                    color={useColorModeValue("gray.800", "white")}
                    fontSize={{ base: "2xl", sm: "3xl" }}
                >
                    Déposer{" "}
                    <Text
                        as={"span"}
                        bgGradient="linear(to-r, red.400,pink.400)"
                        bgClip="text"
                    >
                        /{" "}
                    </Text>
                    Retirer
                </Heading>
                <HStack spacing={4}>
                    <Text
                        color={"gray.500"}
                        fontSize={{ base: "sm", sm: "md" }}
                    >
                        Le rendement annualisé est de 5%. un bonus s&apos;applique en
                        fonction du pourcentage de votre participation à la
                        valeur totale stackée.
                    </Text>
                    <StakingInfoModal />
                </HStack>
            </Stack>
            <StakingForm />
        </Stack>
    );
}

export default StakingWidget;
