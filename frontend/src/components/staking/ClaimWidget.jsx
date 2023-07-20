import { StakingManagerContext } from "@/providers/StakingManagerProvider";
import {
    Button,
    Heading,
    Stack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { useContext } from "react";

function ClaimWidget() {
    const { currentUserStakingInfos } = useContext(StakingManagerContext);

    return (
        <Stack
            bg={useColorModeValue("gray.50", "gray.700")}
            rounded={"xl"}
            p={{ base: 4, sm: 6, md: 8 }}
            spacing={8}
            shadow={"xl"}
        >
            <Stack spacing={4}>
                <Heading
                    color={useColorModeValue("gray.800", "white")}
                    fontSize={{ base: "2xl", sm: "3xl" }}
                >
                    Réclamer vos{" "}
                    <Text
                        as={"span"}
                        bgGradient="linear(to-r, red.400,pink.400)"
                        bgClip="text"
                    >
                        Récompenses !
                    </Text>
                </Heading>
                <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
                    Vous avez actuellement{" "}
                    <Text
                        as={"span"}
                        bgGradient="linear(to-r, red.400,pink.400)"
                        bgClip="text"
                    >
                        {currentUserStakingInfos.PHARMRewards}
                    </Text>{" "}
                    PHARM à réclamer !
                </Text>
                <Button
                    fontFamily={"heading"}
                    w={"full"}
                    bgGradient="linear(to-r, red.300,pink.400)"
                    color={"white"}
                    _hover={{
                        bgGradient: "linear(to-r, red.400,pink.600)",
                        boxShadow: "xl",
                    }}
                >
                    Recevoir
                </Button>
            </Stack>
        </Stack>
    );
}

export default ClaimWidget;
