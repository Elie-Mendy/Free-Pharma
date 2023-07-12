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
    Box,
} from "@chakra-ui/react";
import BlurBackground from "../generic/BlurBackground";
import { ColorModeSwitcher } from "../generic/ColorSwitcher";
import ConnexionForm from "./ConnexionForm";
import RegistrationForm from "./RegistrationForm";

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

export default function Connexion({isConnected, isRegistered}) {
    console.log("isRegistered", isRegistered)
    console.log("isConnected", isConnected)
    return (
        <Flex p={5} position={"relative"} h={"100%"} align={"center"}>
            <BlurBackground />
            <Container
                as={SimpleGrid}
                maxW={"7xl"}
                columns={{ base: 1, md: 2 }}
                spacing={{ base: 10, lg: 32 }}
                py={{ base: 10, sm: 20, lg: 32 }}
            >
                <Stack spacing={{ base: 10, md: 20 }}  justify={"center"}>
                    <Heading
                        zIndex={9999}
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
                        Porteurs de projets
                    </Heading>
                    <Stack direction={"row"} spacing={4} align={"center"}>
                        <AvatarGroup>
                            {avatars.map((avatar) => (
                                <Avatar
                                    key={avatar.name}
                                    name={avatar.name}
                                    src={avatar.url}
                                    size={useBreakpointValue({
                                        base: "md",
                                        md: "lg",
                                    })}
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
                { isConnected ?  <RegistrationForm /> : <ConnexionForm /> }
            </Container>
            <Box alignSelf={"flex-start"}>
                <ColorModeSwitcher />
            </Box>
        </Flex>
    );
}
