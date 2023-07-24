import {
    Text,
    Flex,
    Avatar,
    HStack,
    Spacer,
    Heading,
    Hide,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ColorModeSwitcher } from "../generic/ColorSwitcher";
import { useContext } from "react";
import { FreePharmaContext } from "@/providers/FreePharmaProvider";

const Header = ({ onShowSidebar }) => {
    const { userProfile } = useContext(FreePharmaContext);

    return (
        <>
            <Flex
                p={4}
                justifyContent={"space-evenly"}
                w={"100%"}
                align={"center"}
            >
                <Heading
                    ml={{ base: "2vh", lg: "5vh", xl: "5vh", "2xl": "5vh" }}
                    as="h1"
                    fontSize={"4xl"}
                >
                    <HStack>
                        <Text
                            as={"span"}
                            bgGradient="linear(to-r, red.400,pink.400)"
                            bgClip="text"
                            fontSize={{ base: "3xl", md: "4xl" }}
                            letterSpacing={{md:"0.2rem"}}
                        >
                            FREE PHARMA
                        </Text>{" "}
                    </HStack>
                </Heading>
                <Spacer />
                <HStack>
                    <Hide below="lg">
                        <ConnectButton />
                        <ColorModeSwitcher />
                    </Hide>

                    <Avatar
                        mx={"1.5rem"}
                        size="md"
                        name="J C"
                        src={
                            userProfile === "employer"
                                ? "https://bit.ly/sage-adebayo"
                                : "https://bit.ly/ryan-florence"
                        }
                        bgGradient="linear(to-r, red.400,pink.400)"
                        onClick={onShowSidebar}
                    />
                </HStack>
            </Flex>
            <Flex
                px={10}
                justifyContent={"space-between"}
                w={"100%"}
                align={"center"}
            >
                <Hide above="lg">
                    <ConnectButton />
                    <ColorModeSwitcher />
                </Hide>
            </Flex>
        </>
    );
};

export default Header;
