import moment from "moment";

import { FreePharmaContext } from "@/providers/FreePharmaProvider";

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
    Icon,
} from "@chakra-ui/react";
import { useContext } from "react";
import { PiMagnifyingGlassLight } from "react-icons/pi";

const TableData = ({ data, tab }) => {
    const bg = useColorModeValue("white", "gray.700");
    return (
        <TableContainer rounded={"xl"} shadow={"xl"} w={"100%"} bg={bg}>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Porteur de missions</Th>
                        <Th>Début</Th>
                        <Th>Fin</Th>
                        <Th>Rémunération</Th>
                        <Th>details</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        /* Open jobs / Candidatures pending */
                        tab === 1 &&
                            data?.map((jobOffer) => {
                                // format date
                                let startDate = moment(
                                    new Date(
                                        parseInt(
                                            jobOffer.startDate.toString()
                                        ) * 1000
                                    )
                                ).format("YYYY-MM-DD");
                                let endDate = moment(
                                    new Date(
                                        parseInt(jobOffer.endDate.toString()) *
                                            1000
                                    )
                                ).format("YYYY-MM-DD");

                                return (
                                    <Tr key={jobOffer.id}>
                                        <Td>{jobOffer.employerAddress}</Td>
                                        <Td>{startDate}</Td>
                                        <Td>{endDate}</Td>
                                        <Td>{jobOffer.salary.toString()}</Td>
                                        <Td>
                                            <Icon as={PiMagnifyingGlassLight} h={"1.2rem"} w={"1.2rem"}/>
                                        </Td>
                                    </Tr>
                                );
                            })
                    }
                    {/* started jobs / completed jobs */}
                    {/* paid jobs */}
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export const FreelancerTableData = () => {
    const { currentJobOffers, startedJobOffers, completedJobOffers } =
        useContext(FreePharmaContext);

    return (
        <Tabs isFitted colorScheme="twitter">
            <TabList>
                <Tab fontSize={"xl"} fontWeight={"bold"}>
                    Candidatures envoyées
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
                    <TableData data={currentJobOffers} tab={1} />
                </TabPanel>
                <TabPanel>
                    <TableData data={startedJobOffers} tab={2} />
                </TabPanel>
                <TabPanel>
                    <TableData data={completedJobOffers} tab={3} />
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};
