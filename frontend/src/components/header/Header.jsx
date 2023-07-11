import {
    Center,
    Text,
    Flex,
    Avatar,
    HStack,
    Spacer,
    useColorModeValue,
    Box,
    Heading,
} from "@chakra-ui/react";
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
                    <Box color={useColorModeValue("blue.600", "green.300")}>
                        FREE
                    </Box>{" "}
                    <Box>PHARMA</Box>
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
                    bg={useColorModeValue("blue.600", "green.300")}
                    onClick={onShowSidebar}
                />
            </HStack>
        </Flex>
    );
};

export default Header;
