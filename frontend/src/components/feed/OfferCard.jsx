import {
    Badge,
    Box,
    Flex,
    Icon,
    Image,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { MdLocationOn } from "react-icons/md";
import { BsFillBriefcaseFill, BsCashCoin, BsCalendar3 } from "react-icons/bs";


export const OfferCard = () => {
    return (
        <Box
            mx="auto"
            bg="white"
            _dark={{
                bg: "gray.700",
            }}
            shadow="lg"
            rounded="lg"
            overflow="hidden"
            minW={"xs"}
        >
            <Image
                w="full"
                h={56}
                fit="cover"
                objectPosition="center"
                src="https://www.ladn.eu/wp-content/uploads/2018/04/loreal.jpg"
                alt="avatar"
            />
            <Flex
                alignItems="center"
                px={6}
                py={3}
                bg={useColorModeValue("gray.100", "gray.800")}
            >
                <Flex
                    mx={3}
                    color={"white"}
                    fontWeight="bold"
                    fontSize="lg"
                    gap={2}
                >
                    <Badge
                        px={2}
                        py={1}
                        bg="red.300"
                        fontWeight={"bold"}
                        color={"white"}
                    >
                        SKILL 1
                    </Badge>
                    <Badge
                        px={2}
                        py={1}
                        bg="blue.300"
                        fontWeight={"bold"}
                        color={"white"}
                    >
                        SKILL 2
                    </Badge>
                    <Badge
                        px={2}
                        py={1}
                        bg="orange.300"
                        fontWeight={"bold"}
                        color={"white"}
                    >
                        SKILL 3
                    </Badge>
                </Flex>
            </Flex>

            <Box py={4} px={6}>
                <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color="gray.800"
                    _dark={{
                        color: "white",
                    }}
                >
                    Titre du poste
                </Text>

                <Text
                    py={2}
                    color="gray.700"
                    _dark={{
                        color: "gray.400",
                    }}
                >
                    Description du poste... 
                </Text>

                <Flex
                    alignItems="center"
                    mt={4}
                    color="gray.700"
                    _dark={{
                        color: "gray.200",
                    }}
                >
                    <Icon as={BsFillBriefcaseFill} h={6} w={6} mr={2} />

                    <Text px={2} fontSize="sm">
                        Préparateur en pharlacie
                    </Text>
                </Flex>

                <Flex
                    alignItems="center"
                    mt={4}
                    color="gray.700"
                    _dark={{
                        color: "gray.200",
                    }}
                >
                    <Icon as={MdLocationOn} h={6} w={6} mr={2} />

                    <Text px={2} fontSize="sm">
                        Toulouse
                    </Text>
                </Flex>

                <Flex
                    alignItems="center"
                    mt={4}
                    color="gray.700"
                    _dark={{
                        color: "gray.200",
                    }}
                >
                    <Icon as={BsCalendar3} h={6} w={6} mr={2} />

                    <Text px={2} fontSize="sm">
                        01/01/2021 - 05/02/2021
                    </Text>
                </Flex>

                <Flex
                    alignItems="center"
                    mt={4}
                    color="gray.700"
                    _dark={{
                        color: "gray.200",
                    }}
                >
                    <Icon as={BsCashCoin} h={6} w={6} mr={2} />

                    <Text px={2} fontSize="md" fontWeight={"bold"}>
                        540€
                    </Text>
                </Flex>
            </Box>
        </Box>
    );
};
