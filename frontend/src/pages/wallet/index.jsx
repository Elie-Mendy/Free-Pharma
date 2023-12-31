import MainLayout from "@/layouts/MainLayout";
import { Flex, Box } from "@chakra-ui/react";

import WalletStats from "@/components/wallet/WalletStats";
import TransferWidget from "@/components/wallet/TransferWidget";
import { TransactionsHistoryTableData } from "@/components/wallet/TransactionsHistoryTableData";
import BuyPHARMWidget from "@/components/wallet/BuyPHARMWidget";

function WalletPage() {
    return (
        <MainLayout>
            <WalletStats />
            <Flex
                direction={{ base: "column", xl: "row" }}
                gap={10}
                align={{ base: "flex-start", md: "center", xl: "flex-start" }}
            >
                <Box w="full">
                    <TransactionsHistoryTableData />
                </Box>
                <Flex
                    direction={{ base: "column", md: "row", xl: "column" }}
                    w={{ base: "full", md: "full", xl: "md" }}
                    gap={10}
                >
                    <BuyPHARMWidget />
                    <TransferWidget />
                </Flex>
            </Flex>
        </MainLayout>
    );
}

export default WalletPage;
