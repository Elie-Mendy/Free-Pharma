import MainLayout from "@/layouts/MainLayout";
import { Flex, Box } from "@chakra-ui/react";

import StackingStats from "@/components/stacking/StackingStats";
import ClaimWidget from "@/components/stacking/ClaimWidget";
import { StackingHistoryTableData } from "@/components/stacking/StackingHistoryTableData";
import StackingWidget from "@/components/stacking/StackingWidget";

function StackingPage() {
    return (
        <MainLayout>
            <StackingStats />
            <Flex
                direction={{ base: "column", xl: "row" }}
                gap={10}
                align={{ base: "flex-start", md: "center", xl: "flex-start" }}
            >
                <Box w="full">
                    <StackingHistoryTableData />
                </Box>
                <Flex
                    direction={{ base: "column", md: "row", xl: "column" }}
                    w={{ base: "full", md: "full", xl: "md" }}
                    gap={10}
                >
                    <StackingWidget />
                    <ClaimWidget />
                </Flex>
            </Flex>
        </MainLayout>
    );
}

export default StackingPage;
