import { useContext } from "react";
import { DataStorageContext } from "@/providers/DataStorageProvider";

import {
    Badge,
    Box,
    Flex,
    Icon,
    Image,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { MdLocationOn, MdEmail } from "react-icons/md";
import { BsFillBriefcaseFill, BsCashCoin } from "react-icons/bs";
import { HireModal } from "./HireModal";

export const FreelancerCard = ({freelancer}) => {
    const { userProfile } = useContext(DataStorageContext);
    return (
        <Box
            bg="white"
            _dark={{
                bg: "gray.700",
            }}
            shadow="xl"
            rounded="lg"
            overflow="hidden"
        >
            <Image
                w="full"
                h={56}
                fit="cover"
                objectPosition="center"
                src="https://blog.mieux-etre.fr/wp-content/uploads/2023/01/role_pharmacienne-1080x675.jpg"
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
                        PHARMA
                    </Badge>
                    <Badge
                        px={2}
                        py={1}
                        bg="blue.300"
                        fontWeight={"bold"}
                        color={"white"}
                    >
                        VENTE
                    </Badge>
                    <Badge
                        px={2}
                        py={1}
                        bg="orange.300"
                        fontWeight={"bold"}
                        color={"white"}
                    >
                        ANIMATION
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
                    {freelancer.name}
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
                        {freelancer.location}
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
                        {freelancer.email}
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
                        {freelancer.averageDailyRate.toString()}€/jour
                    </Text>
                </Flex>
                <Flex
                    justify={"flex-end"}
                    alignItems="center"
                    mt={4}
                    color="gray.700"
                    _dark={{
                        color: "gray.200",
                    }}
                >
                    {userProfile == "employer" && <HireModal available={freelancer.available} />}
                </Flex>
            </Box>
        </Box>
    );
};
