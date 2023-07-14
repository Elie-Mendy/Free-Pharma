import {
    Badge,
    Box,
    Flex,
    Icon,
    Image,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { MdHeadset, MdLocationOn, MdEmail } from "react-icons/md";
import { BsFillBriefcaseFill, BsCashCoin } from "react-icons/bs";

export const FreelancerCard = () => {
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
            minW={{base: "xs" , md: "sm"}}
        >
            <Image
                w="full"
                h={56}
                fit="cover"
                objectPosition="center"
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"
                alt="avatar"
            />
            <Flex
                alignItems="center"
                px={6}
                py={3}
                bg={useColorModeValue("gray.50", "gray.800")}
            >
                <Flex
                    mx={3}
                    color={useColorModeValue("gray.700", "gray.100")}
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
                    Pseudonyme
                </Text>

                <Text
                    py={2}
                    color="gray.700"
                    _dark={{
                        color: "gray.400",
                    }}
                >
                    Description du profil... 
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
                        Préparateur en pharmacie
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
                    <Icon as={MdEmail} h={6} w={6} mr={2} />

                    <Text px={2} fontSize="sm">
                        freelance@example.com
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
                        140€/jour
                    </Text>
                
                </Flex>
            </Box>
        </Box>
    );
};
