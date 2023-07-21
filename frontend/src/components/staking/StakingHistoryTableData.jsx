import { StakingManagerContext } from "@/providers/StakingManagerProvider";
import moment from "moment";

import {
    useColorModeValue,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from "@chakra-ui/react";
import { useContext } from "react";
import { useWagmi } from "@/hooks/useWagmi";

const TableData = ({ data }) => {
    const bg = useColorModeValue("white", "gray.700");
    return (
        <TableContainer rounded={"xl"} shadow={"xl"} w={"100%"} bg={bg}>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>date</Th>
                        <Th>montant</Th>
                        <Th>token</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data?.map((transaction, idx) => {
                        // format date
                        let transactionDate = moment(
                            new Date(
                                parseInt(transaction.timestamp.toString()) * 1000
                            )
                        ).format("YYYY-MM-DD");
                        
                        return (
                            <Tr key={idx}>
                                <Td>{transactionDate}</Td>
                                <Td>{transaction.amount}</Td>
                                <Td>{transaction.token}</Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export const StakingHistoryTableData = () => {
    const { address } = useWagmi();
    const { pharmDeposits, ethDeposits, pharmWithdrawals, ethWithdrawals, stackingRewards } = useContext(StakingManagerContext);

    // process deposits
    const mergedDeposits = [...pharmDeposits, ...ethDeposits];
    const filteredOnaddressDeposits = mergedDeposits.filter(
        (deposit) => deposit.address === address
    );
    const sortedByTimestampDeposits = filteredOnaddressDeposits.sort(
        (a, b) => b.timestamp - a.timestamp
    );

    // process withdrawals
    const mergedWithdrawals = [...pharmWithdrawals, ...ethWithdrawals];
    const filteredOnaddressWithdrawals = mergedWithdrawals.filter(
        (withdrawal) => withdrawal.address === address
    );
    const sortedByTimestampWithdrawals = filteredOnaddressWithdrawals.sort(
        (a, b) => b.timestamp - a.timestamp
    );

    // process rewards
    const filteredOnaddressRewards = stackingRewards.filter(
        (reward) => reward.address === address
    );
    const sortedByTimestampRewards = filteredOnaddressRewards.sort(
        (a, b) => b.timestamp - a.timestamp
    );
    
    return (
        <Tabs isFitted colorScheme="twitter">
            <TabList>
                <Tab fontSize={"xl"} fontWeight={"bold"}>
                    Dépots
                </Tab>
                <Tab fontSize={"xl"} fontWeight={"bold"}>
                    Retraits
                </Tab>
                <Tab fontSize={"xl"} fontWeight={"bold"}>
                    Récompenses
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel px={0}>
                    <TableData data={sortedByTimestampDeposits} />
                </TabPanel>
                <TabPanel px={0}>
                    <TableData data={sortedByTimestampWithdrawals} />
                </TabPanel>
                <TabPanel px={0}>
                    <TableData data={sortedByTimestampRewards}/>
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};
