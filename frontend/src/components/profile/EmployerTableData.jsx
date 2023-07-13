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

const TableData = ({ table }) => {
    const bg = useColorModeValue("white", "gray.700");
    return (
        <TableContainer rounded={"xl"} shadow={"xl"} w={"100%"} bg={bg}>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Porteur de projet</Th>
                        <Th>Début</Th>
                        <Th>Fin</Th>
                        <Th>Rémunération</Th>
                        <Th>Détail</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>Lafarge</Td>
                        <Td>15/07/2022</Td>
                        <Td>23/07/2022</Td>
                        <Td>780 € </Td>
                        <Td>actions</Td>
                    </Tr>
                    <Tr>
                        <Td>Lafarge</Td>
                        <Td>15/07/2022</Td>
                        <Td>23/07/2022</Td>
                        <Td>780 € </Td>
                        <Td>actions</Td>
                    </Tr>
                    <Tr>
                        <Td>Lafarge</Td>
                        <Td>15/07/2022</Td>
                        <Td>23/07/2022</Td>
                        <Td>780 € </Td>
                        <Td>actions</Td>
                    </Tr>
                    <Tr>
                        <Td>Lafarge</Td>
                        <Td>15/07/2022</Td>
                        <Td>23/07/2022</Td>
                        <Td>780 € </Td>
                        <Td>actions</Td>
                    </Tr>
                    <Tr>
                        <Td>Lafarge</Td>
                        <Td>15/07/2022</Td>
                        <Td>23/07/2022</Td>
                        <Td>780 € </Td>
                        <Td>actions</Td>
                    </Tr>
                    <Tr>
                        <Td>Lafarge</Td>
                        <Td>15/07/2022</Td>
                        <Td>23/07/2022</Td>
                        <Td>780 € </Td>
                        <Td>actions</Td>
                    </Tr>
                    <Tr>
                        <Td>Lafarge</Td>
                        <Td>15/07/2022</Td>
                        <Td>23/07/2022</Td>
                        <Td>780 € </Td>
                        <Td>actions</Td>
                    </Tr>
                    <Tr>
                        <Td>Lafarge</Td>
                        <Td>15/07/2022</Td>
                        <Td>23/07/2022</Td>
                        <Td>780 € </Td>
                        <Td>actions</Td>
                    </Tr>
                    <Tr>
                        <Td>Lafarge</Td>
                        <Td>15/07/2022</Td>
                        <Td>23/07/2022</Td>
                        <Td>780 € </Td>
                        <Td>actions</Td>
                    </Tr>
                    <Tr>
                        <Td>Lafarge</Td>
                        <Td>15/07/2022</Td>
                        <Td>23/07/2022</Td>
                        <Td>780 € </Td>
                        <Td>actions</Td>
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export const EmployerTableData = () => {
    return (
        <Tabs isFitted colorScheme="twitter">
            <TabList>
                <Tab fontSize={"xl"} fontWeight={"bold"}>
                    Offres postées
                </Tab>
                <Tab fontSize={"xl"} fontWeight={"bold"}>
                    Missions en cours
                </Tab>
                <Tab fontSize={"xl"} fontWeight={"bold"}>
                    Missions Archivées
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <TableData />
                </TabPanel>
                <TabPanel>
                    <TableData />
                </TabPanel>
                <TabPanel>
                    <TableData />
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};