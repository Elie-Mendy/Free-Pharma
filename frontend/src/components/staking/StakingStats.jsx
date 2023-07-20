import {
    Box,
    Flex,
    SimpleGrid,
    Stack,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
} from "@chakra-ui/react";
import { FaEthereum } from "react-icons/fa";
import { BsCashCoin, BsCoin } from "react-icons/bs";
import { ApprovalModal } from "./ApprovalModal";
import { useContext } from "react";
import { StakingManagerContext } from "@/providers/StakingManagerProvider";
import { TokenPHARMContext } from "@/providers/TokenPHARMProvider";

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

export default function StakingStats() {
    const { allowanceForStackingManager } = useContext(TokenPHARMContext);
    const { currentUserStakingInfos } = useContext(StakingManagerContext);

    return (
        <Box mx={"auto"} mt={10} pt={5} w={"100%"}>
            <SimpleGrid
                columns={{ base: 1, md: 2, lg: 4 }}
                spacing={{ base: 5, lg: 8 }}
            >
                <StatsCard
                    title={"montant stacké"}
                    stat={`ETH: ${currentUserStakingInfos?.ETHStaked}`}
                    icon={<BsCoin size={"3em"} />}
                />
                <StatsCard
                    title={"montant stacké"}
                    stat={`PHARM: ${currentUserStakingInfos?.PHARMStaked}`}
                    icon={<FaEthereum size={"3em"} />}
                />
                <StatsCard
                    title={"transfert approuvé"}
                    stat={allowanceForStackingManager}
                    icon={<BsCashCoin size={"3em"} />}
                />
                <ApprovalModal />
            </SimpleGrid>
        </Box>
    );
}