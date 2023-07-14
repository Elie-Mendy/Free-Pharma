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
            alignItems={"center"}
            gap={{base:2, md:3}}
            w={"100%"}
        >   
            <Flex gap={3} w={{base:"100%", md:"md"}}>
            <Button w={"50%"} h={{base:"2.5rem", md: "3.5rem"}}>Offres</Button>
            <Button w={"50%"} h={{base:"2.5rem", md: "3.5rem"}}>Freelances</Button>
            </Flex>
            <Flex w="100%">
                <Input
                    type="text"
                    placeholder={isEmplorer ? "Rechercher un freelance" :  "Rechercher une mission"}
                    h={"3.5rem"}
                    borderRadius={"lg"}
                    borderWidth={3}
                    fontSize={"lg"}
                    fontWeight={"bold"}
                    mr={{base:2, md:3}}
                />
                <Button h={"3.5rem"} w={"3.5rem"} borderRadius={"lg"}>
                    <Icon as={BiSearchAlt} w={9} h={9} color="blue.500" />
                </Button>
            </Flex>
        </Flex>
    );
}
