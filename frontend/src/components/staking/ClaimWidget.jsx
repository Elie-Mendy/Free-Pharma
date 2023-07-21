import { StakingManagerContext } from "@/providers/StakingManagerProvider";
import {
    Button,
    HStack,
    Heading,
    Icon,
    Stack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { useContext } from "react";
import { GoAlertFill } from "react-icons/go";

function ClaimWidget() {
    const {
        currentUserStakingInfos,
        bonusCoefficient,
        claimRewards,
        demoMode,
    } = useContext(StakingManagerContext);
    console.log("DemoMode", demoMode);
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
                {demoMode && (
                    <HStack alignSelf={"center"}>
                        <Icon color="yellow.400" as={GoAlertFill} w={6} h={6} />
                        <Text
                            as={"span"}
                            bgGradient="linear(to-r, red.400,pink.400)"
                            bgClip="text"
                            fontSize={"xl"}
                            fontWeight={"bold"}
                        >
                            MODE DEMO
                        </Text>
                        <Icon color="yellow.400" as={GoAlertFill} w={6} h={6} />
                    </HStack>
                )}

                <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
                    Compte tenu de votre participation au staking, votre
                    pourcentage annuel de récompense est de{" "}
                    <Text
                        as={"span"}
                        bgGradient="linear(to-r, red.400,pink.400)"
                        bgClip="text"
                        fontSize={"xl"}
                        fontWeight={"bold"}
                    >
                        {bonusCoefficient}%
                    </Text>{" "}
                    .
                </Text>
                <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
                    Vous avez actuellement{" "}
                    <Text
                        as={"span"}
                        bgGradient="linear(to-r, red.400,pink.400)"
                        bgClip="text"
                        fontSize={"xl"}
                        fontWeight={"bold"}
                    >
                        {currentUserStakingInfos.PHARMRewards}
                    </Text>{" "}
                    PHARM à réclamer !
                </Text>
                <Button
                    onClick={claimRewards}
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
