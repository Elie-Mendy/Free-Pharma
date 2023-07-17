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

const TableData = () => {
    const bg = useColorModeValue("white", "gray.700");
    return (
        <TableContainer rounded={"xl"} shadow={"xl"} w={"100%"} bg={bg}>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>date</Th>
                        <Th>montant</Th>
                        <Th>token</Th>
                        <Th>durée</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>15/07/2022</Td>
                        <Td>0.3</Td>
                        <Td>ETH</Td>
                        <Td>6 mois</Td>
                    </Tr>
                    <Tr>
                        <Td>15/07/2022</Td>
                        <Td>1045</Td>
                        <Td>PHARM</Td>
                        <Td>6 mois</Td>
                    </Tr>
                    <Tr>
                        <Td>15/07/2022</Td>
                        <Td>457</Td>
                        <Td>PHARM</Td>
                        <Td>6 mois</Td>
                    </Tr>
                    <Tr>
                        <Td>15/07/2022</Td>
                        <Td>0.3</Td>
                        <Td>ETH</Td>
                        <Td>6 mois</Td>
                    </Tr>
                    <Tr>
                        <Td>15/07/2022</Td>
                        <Td>1045</Td>
                        <Td>PHARM</Td>
                        <Td>6 mois</Td>
                    </Tr>
                    <Tr>
                        <Td>15/07/2022</Td>
                        <Td>457</Td>
                        <Td>PHARM</Td>
                        <Td>6 mois</Td>
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export const StackingHistoryTableData = () => {
    return (
        <Tabs isFitted colorScheme="twitter">
            <TabList>
                <Tab fontSize={"xl"} fontWeight={"bold"}>
                    Dépots
                </Tab>
                <Tab fontSize={"xl"} fontWeight={"bold"}>
                    Retraits
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel px={0}>
                    <TableData />
                </TabPanel>
                <TabPanel px={0}>
                    <TableData />
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};
