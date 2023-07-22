import MainLayout from "@/layouts/MainLayout";
import { Flex, Box } from "@chakra-ui/react";

import StakingStats from "@/components/staking/StakingStats";
import ClaimWidget from "@/components/staking/ClaimWidget";
import { StakingHistoryTableData } from "@/components/staking/StakingHistoryTableData";
import StakingWidget from "@/components/staking/StakingWidget";

function StakingPage() {
    return (
        <MainLayout>
            <StakingStats />
            <Flex
                direction={{ base: "column", xl: "row" }}
                gap={10}
                align={{ base: "flex-start", md: "center", xl: "flex-start" }}
            >
                <Box w="full">
                    <StakingHistoryTableData />
                </Box>
                <Flex
                    direction={{ base: "column", md: "row", xl: "column" }}
                    w={{ base: "full", md: "full", xl: "md" }}
                    gap={10}
                >
                    <StakingWidget />
                    <ClaimWidget />
                </Flex>
            </Flex>
        </MainLayout>
    );
}

export default StakingPage;
