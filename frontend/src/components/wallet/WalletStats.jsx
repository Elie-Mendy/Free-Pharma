import {
    Box,
    Flex,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
} from "@chakra-ui/react";
import { AiOutlineBarChart } from "react-icons/ai";
import { FaWallet } from "react-icons/fa";
import { BiTransfer } from "react-icons/bi";
import { ApprovalModal } from "./ApprovalModal";
import { useContext } from "react";
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

export default function WalletStats() {
    const {
        totalSupplyInfo,
        balanceOfUser,
        allowanceForFreePharma,
        allowanceForStackingManager,
    } = useContext(TokenPHARMContext);
    return (
        <Box mx={"auto"} mt={10} pt={5} w={"100%"}>
            <SimpleGrid
                columns={{ base: 1, md: 2, lg: 4 }}
                spacing={{ base: 5, lg: 8 }}
            >
                <StatsCard
                    title={"Supply totale"}
                    stat={totalSupplyInfo}
                    icon={<AiOutlineBarChart size={"3em"} />}
                />
                <StatsCard
                    title={"balance"}
                    stat={balanceOfUser}
                    icon={<FaWallet size={"3em"} />}
                />
                <StatsCard
                    title={"transfert approuvé"}
                    stat={allowanceForFreePharma}
                    icon={<BiTransfer size={"3em"} />}
                />
                <ApprovalModal />
            </SimpleGrid>
        </Box>
    );
}
