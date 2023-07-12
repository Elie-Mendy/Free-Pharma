import { Text, Flex, Avatar, HStack, Spacer, Heading } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ColorModeSwitcher } from "../generic/ColorSwitcher";

const Header = ({ onShowSidebar }) => {
    return (
        <Flex p={4} justifyContent={"space-evenly"}>
            <Heading
                ml={{ base: "2vh", lg: "5vh", xl: "5vh", "2xl": "5vh" }}
                as="h1"
                fontSize={"2xl"}
            >
                <HStack>
                    <Text
                        as={"span"}
                        bgGradient="linear(to-r, red.400,pink.400)"
                        bgClip="text"
                    >
                        FREE PHARMA
                    </Text>{" "}
                </HStack>
            </Heading>
            <Spacer />
            <HStack>
                <ConnectButton />
                <ColorModeSwitcher />
                <Avatar
                    mx={"1.5rem"}
                    size="md"
                    name="J C"
                    src="https://bit.ly/sage-adebayo"
                    bgGradient="linear(to-r, red.400,pink.400)"
                    onClick={onShowSidebar}
                />
            </HStack>
        </Flex>
    );
};

export default Header;
