import {
    Flex,
    Stack,
    Heading,
    Text,
    Container,
    SimpleGrid,
    Avatar,
    AvatarGroup,
    useBreakpointValue,
    HStack,
    Hide,
    Spacer,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "../generic/ColorSwitcher";
import ConnexionForm from "./ConnexionForm";
import RegistrationForm from "./RegistrationForm";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const avatars = [
    {
        name: "Ryan Florence",
        url: "https://bit.ly/ryan-florence",
    },
    {
        name: "Segun Adebayo",
        url: "https://bit.ly/sage-adebayo",
    },
    {
        name: "Kent Dodds",
        url: "https://bit.ly/kent-c-dodds",
    },
    {
        name: "Prosper Otemuyiwa",
        url: "https://bit.ly/prosper-baba",
    },
    {
        name: "Christian Nwamba",
        url: "https://bit.ly/code-beast",
    },
];

export default function Connexion({ isConnected, isRegistered }) {
    return (
        <Flex
            p={5}
            position={"relative"}
            direction={{ base: "column" }}
            h={{ sm: "100%" }}
            align={"center"}
            justify={"center"}
        >
            <HStack justifySelf={"flex-start"} alignSelf={"flex-end"}>
                {isConnected && <ConnectButton />}
                <ColorModeSwitcher />
            </HStack>
            <Spacer />
            <Container
                as={SimpleGrid}
                maxW={"7xl"}
                columns={{ base: 1, lg: 2 }}
                spacing={{ base: 10, lg: 32 }}
                py={{ base: 10, sm: 20, lg: 32 }}
            >
                <Stack spacing={{ base: 10, md: 20 }} justify={"center"}>
                    <Heading
                        zIndex={2}
                        lineHeight={1.1}
                        fontSize={{
                            base: "3xl",
                            sm: "4xl",
                            md: "5xl",
                            lg: "6xl",
                        }}
                    >
                        Freelancers{" "}
                        <Text
                            as={"span"}
                            bgGradient="linear(to-r, red.400,pink.400)"
                            bgClip="text"
                        >
                            &
                        </Text>{" "}
                        Porteurs de projets en{" "}
                        <Text
                            as={"span"}
                            bgGradient="linear(to-r, red.400,pink.400)"
                            bgClip="text"
                        >
                            pharmacie
                        </Text>{" "}
                    </Heading>
                    <Stack direction={"row"} spacing={4} align={"center"}>
                        <AvatarGroup>
                            {avatars.map((avatar) => (
                                <Avatar
                                    key={avatar.name}
                                    name={avatar.name}
                                    src={avatar.url}
                                    size={{
                                        base: "md",
                                        md: "lg",
                                    }}
                                    position={"relative"}
                                    zIndex={2}
                                    _before={{
                                        content: '""',
                                        width: "full",
                                        height: "full",
                                        rounded: "full",
                                        transform: "scale(1.125)",
                                        bgGradient:
                                            "linear(to-bl, red.400,pink.400)",
                                        position: "absolute",
                                        zIndex: -1,
                                        top: 0,
                                        left: 0,
                                    }}
                                />
                            ))}
                        </AvatarGroup>
                        <Text
                            fontFamily={"heading"}
                            fontSize={{ base: "4xl", md: "6xl" }}
                        >
                            +
                        </Text>
                        <Flex
                            align={"center"}
                            justify={"center"}
                            fontFamily={"heading"}
                            fontSize={{ base: "sm", md: "lg" }}
                            bg={"gray.800"}
                            color={"white"}
                            rounded={"full"}
                            minWidth={useBreakpointValue({
                                base: "44px",
                                md: "60px",
                            })}
                            minHeight={useBreakpointValue({
                                base: "44px",
                                md: "60px",
                            })}
                            position={"relative"}
                            _before={{
                                content: '""',
                                width: "full",
                                height: "full",
                                rounded: "full",
                                transform: "scale(1.125)",
                                bgGradient:
                                    "linear(to-bl, orange.400,yellow.400)",
                                position: "absolute",
                                zIndex: -1,
                                top: 0,
                                left: 0,
                            }}
                        >
                            VOUS
                        </Flex>
                    </Stack>
                </Stack>
                <HStack justifySelf={"flex-start"} justify={"center"}>
                    {isConnected ? <RegistrationForm /> : <ConnexionForm />}
                </HStack>
            </Container>
            <Spacer />
        </Flex>
    );
}
