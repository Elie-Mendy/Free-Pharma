import {
    Box,
    chakra,
    Flex,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
} from "@chakra-ui/react";
import { CgFileDocument } from "react-icons/cg";
import { AiOutlineFileDone } from "react-icons/ai";
import { BsCashCoin } from "react-icons/bs";
import { ProfileModal } from "./EmployerProfileModal";
import { FreelancerProfileModal } from "./FreelancerProfileModal";

function StatsCard(props) {
    const { title, stat, icon } = props;
    const bg = useColorModeValue("white", "gray.700");
    return (
        <Stat
            px={{ base: 2, md: 4 }}
            py={"5"}
            shadow={"xl"}
            rounded={"lg"}
            bg={bg}
        >
            <Flex justifyContent={"space-between"}>
                <Box pl={{ base: 2, md: 4 }}>
                    <StatLabel fontWeight={"medium"} isTruncated>
                        {title}
                    </StatLabel>
                    <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
                        {stat}
                    </StatNumber>
                </Box>
                <Box
                    my={"auto"}
                    color={useColorModeValue("gray.800", "gray.200")}
                    alignContent={"center"}
                >
                    {icon}
                </Box>
            </Flex>
        </Stat>
    );
}

export default function FreelancerStats() {
    return (
        <Box
            maxW="7xl"
            mx={"auto"}
            pt={5}
            px={{ base: 2, sm: 12, md: 17 }}
            w={"100%"}
        >
            <chakra.h1
                textAlign={"center"}
                fontSize={"4xl"}
                py={10}
                fontWeight={"bold"}
            >
                Récapitulatif de votre parcours
            </chakra.h1>
            <SimpleGrid
                columns={{ base: 1, md: 2, lg: 4 }}
                spacing={{ base: 5, lg: 8 }}
            >
                <StatsCard
                    title={"Candidatures"}
                    stat={"7"}
                    icon={<CgFileDocument size={"3em"} />}
                />
                <StatsCard
                    title={"Missions effectuées"}
                    stat={"1"}
                    icon={<AiOutlineFileDone size={"3em"} />}
                />
                <StatsCard
                    title={"Gains totaux"}
                    stat={"€780"}
                    icon={<BsCashCoin size={"3em"} />}
                />
                <FreelancerProfileModal />
            </SimpleGrid>
        </Box>
    );
}
