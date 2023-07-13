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

function StatsCard(props) {
    const { title, stat, icon } = props;
    const bg = useColorModeValue("white", "gray.700");
    return (
        <Stat
            px={{ base: 2, md: 4 }}
            py={"5"}
            shadow={"xl"}
            borderColor={useColorModeValue("gray.800", "gray.500")}
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

export default function EmployerStats() {
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
                Ensemble de vos missions
            </chakra.h1>
            <SimpleGrid
                columns={{ base: 1, md: 3 }}
                spacing={{ base: 5, lg: 8 }}
            >
                <StatsCard
                    title={"Offres postées"}
                    stat={"7"}
                    icon={<CgFileDocument size={"3em"} />}
                />
                <StatsCard
                    title={"Freelancers engagés"}
                    stat={"1"}
                    icon={<AiOutlineFileDone size={"3em"} />}
                />
                <StatsCard
                    title={"Budjet total"}
                    stat={"€780"}
                    icon={<BsCashCoin size={"3em"} />}
                />
            </SimpleGrid>
        </Box>
    );
}
