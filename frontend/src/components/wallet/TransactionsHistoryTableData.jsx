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
                        <Th>destinataire</Th>
                        <Th>date</Th>
                        <Th>montant</Th>
                    </Tr>
                </Thead>
                <Tbody>
                <Tr>
                        <Td>0x0a9ae5B1207F91b0b5EE53ae947427E1AfaAEAD9</Td>
                        <Td>15/07/2022</Td>
                        <Td>50</Td>
                    </Tr><Tr>
                        <Td>0x0a9ae5B1207F91b0b5EE53ae947427E1AfaAEAD9</Td>
                        <Td>15/07/2022</Td>
                        <Td>50</Td>
                    </Tr><Tr>
                        <Td>0x0a9ae5B1207F91b0b5EE53ae947427E1AfaAEAD9</Td>
                        <Td>15/07/2022</Td>
                        <Td>50</Td>
                    </Tr><Tr>
                        <Td>0x0a9ae5B1207F91b0b5EE53ae947427E1AfaAEAD9</Td>
                        <Td>15/07/2022</Td>
                        <Td>50</Td>
                    </Tr><Tr>
                        <Td>0x0a9ae5B1207F91b0b5EE53ae947427E1AfaAEAD9</Td>
                        <Td>15/07/2022</Td>
                        <Td>50</Td>
                    </Tr><Tr>
                        <Td>0x0a9ae5B1207F91b0b5EE53ae947427E1AfaAEAD9</Td>
                        <Td>15/07/2022</Td>
                        <Td>50</Td>
                    </Tr><Tr>
                        <Td>0x0a9ae5B1207F91b0b5EE53ae947427E1AfaAEAD9</Td>
                        <Td>15/07/2022</Td>
                        <Td>50</Td>
                    </Tr><Tr>
                        <Td>0x0a9ae5B1207F91b0b5EE53ae947427E1AfaAEAD9</Td>
                        <Td>15/07/2022</Td>
                        <Td>50</Td>
                    </Tr><Tr>
                        <Td>0x0a9ae5B1207F91b0b5EE53ae947427E1AfaAEAD9</Td>
                        <Td>15/07/2022</Td>
                        <Td>50</Td>
                    </Tr><Tr>
                        <Td>0x0a9ae5B1207F91b0b5EE53ae947427E1AfaAEAD9</Td>
                        <Td>15/07/2022</Td>
                        <Td>50</Td>
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export const TransactionsHistoryTableData = () => {
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
