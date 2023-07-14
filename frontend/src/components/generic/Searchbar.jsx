import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spacer,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { BiChevronDown, BiSearchAlt } from "react-icons/bi";

const isEmplorer = false;

export default function SearchBar() {
    const themeCardColor = useColorModeValue("white", "gray.700");
    const themeShadow = "0 5px 25px rgba(9,17,53,.18823529411764706)";
    return (
        <Flex
            direction={{ base: "column", md: "row" }}
            p="10px"
            borderRadius="lg"
            bg={themeCardColor}
            boxShadow={themeShadow}
            mb={12}
            alignItems={"stretch"}
            gap={"1"}
            w={"100%"}
        >
            <Box display={"flex"} w={{ base: "100%", md: "50%" }}>
                <Input
                    type="text"
                    placeholder={isEmplorer ? "Rechercher un freelance" :  "Rechercher une mission"}
                    h={"3.5rem"}
                    borderRadius={"lg"}
                    borderWidth={3}
                    fontSize={"lg"}
                    fontWeight={"bold"}
                    mr={2}
                />
                <Button h={"3.5rem"} w={"3.5rem"} borderRadius={"lg"}>
                    <Icon as={BiSearchAlt} w={9} h={9} color="blue.500" />
                </Button>
            </Box>
            <Spacer />
            <HStack w={{ base: "100%", md: "50%" }} justifyContent={"end"}>
                <Text fontSize={"lg"} fontWeight={"bold"}>
                    9 Résultats
                </Text>
                <Menu>
                    <MenuButton
                        as={Button}
                        rightIcon={<BiChevronDown />}
                        h={"3.5rem"}
                        borderRadius={"lg"}
                        fontSize={"lg"}
                        ml={"1.5rem"}
                    >
                        Actions
                    </MenuButton>
                    <MenuList>
                        <MenuItem>Download</MenuItem>
                        <MenuItem>Create a Copy</MenuItem>
                        <MenuItem>Mark as Draft</MenuItem>
                        <MenuItem>Delete</MenuItem>
                        <MenuItem>Attend a Workshop</MenuItem>
                    </MenuList>
                </Menu>
            </HStack>
        </Flex>
    );
}
