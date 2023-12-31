import { useContext } from "react";
import { DataStorageContext } from "@/providers/DataStorageProvider";
import { FreePharmaContext } from "@/providers/FreePharmaProvider";
import moment from "moment";
import {
    Badge,
    Box,
    Button,
    Flex,
    Icon,
    Image,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";

import { MdLocationOn } from "react-icons/md";
import { BsFillBriefcaseFill, BsCashCoin, BsCalendar3 } from "react-icons/bs";

export const OfferCard = ({job}) => {
    const { applyForJob, userProfile} = useContext(FreePharmaContext);
    let startDate = moment(
        new Date(
            parseInt(job.startDate.toString()) *
                1000
        )
    ).format("YYYY-MM-DD");
    let endDate = moment(
        new Date(
            parseInt(job.endDate.toString()) * 1000
        )
    ).format("YYYY-MM-DD");
    return (
        <Box
            mt="auto"
            bg="white"
            _dark={{
                bg: "gray.700",
            }}
            shadow="xl"
            rounded="lg"
            overflow="hidden"
            w={"full"}
            minW={"xs"}
        >
            <Image
                w="full"
                h={"35%"}
                fit="cover"
                objectPosition="center"
                src="https://images-ext-1.discordapp.net/external/ayq6m2KZmnOIpeKvq23FMEuPewXW1kaT7avIhbE22OA/https/logo-marque.com/wp-content/uploads/2022/03/Sanofi-Logo.jpg?width=1532&height=862"
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
                    Animateur commerciale
                </Text>

                <Text
                    py={2}
                    color="gray.700"
                    _dark={{
                        color: "gray.400",
                    }}
                >
                    Assurer la promotion de deux gammes de produits...
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
                        2 ans d`&apos;expérience
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
                        {job.location}
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
                        {startDate} - {endDate}
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
                        {job.salary.toString()}€
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
                    {" "}
                    {userProfile === "freelancer" && (
                        <Button onClick={() => applyForJob(jobId)} variant={"outline"}>Postuler</Button>
                    )}
                </Flex>
            </Box>
        </Box>
    );
};
