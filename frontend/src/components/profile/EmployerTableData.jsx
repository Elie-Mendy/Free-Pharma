import { useContext } from "react";
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
import { FreePharmaContext } from "@/providers/FreePharmaProvider";
import { EditMissionModal } from "./EditMissionModal";

const TableData = ({ data }) => {
    const bg = useColorModeValue("white", "gray.700");
    return (
        <TableContainer rounded={"xl"} shadow={"xl"} w={"100%"} bg={bg}>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Début</Th>
                        <Th>Fin</Th>
                        <Th>Rémunération</Th>
                        <Th>Candidats</Th>
                        <Th>Détails</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {/* Open jobs / Candidatures pending */}
                    {/* started jobs / completed jobs */}
                    {/* paid jobs */}
                    {data?.map((jobOffer) => {
                        // format date
                        let startDate = moment(
                            new Date(
                                parseInt(jobOffer.startDate.toString()) * 1000
                            )
                        ).format("YYYY-MM-DD");
                        let endDate = moment(
                            new Date(
                                parseInt(jobOffer.endDate.toString()) * 1000
                            )
                        ).format("YYYY-MM-DD");

                        return (
                            <Tr key={jobOffer.id}>
                                <Td>{startDate}</Td>
                                <Td>{endDate}</Td>
                                <Td>{jobOffer.salary.toString()}</Td>
                                <Td>{jobOffer.candidates.length}</Td>
                                <Td>
                                    <EditMissionModal jobOffer={jobOffer} />
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export const EmployerTableData = () => {
    const { currentJobOffers, startedJobOffers, completedJobOffers } =
        useContext(FreePharmaContext);
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
                    <TableData data={currentJobOffers} tab={1}/>
                </TabPanel>
                <TabPanel>
                    <TableData data={startedJobOffers} tab={2}/>
                </TabPanel>
                <TabPanel>
                    <TableData data={completedJobOffers} tab={3}/>
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};
