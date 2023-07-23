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
import { BsCheck2Circle, BsCashCoin } from "react-icons/bs";
import { FcCancel } from "react-icons/fc";
const TableData = ({ data, tab }) => {
    const { confirmCandidature, completeFreelancerJob, claimSalary } =
        useContext(FreePharmaContext);
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
                        data?.map((jobOffer, idx) => {
                            // format date
                            let startDate = moment(
                                new Date(
                                    parseInt(jobOffer.startDate.toString()) *
                                        1000
                                )
                            ).format("YYYY-MM-DD");
                            let endDate = moment(
                                new Date(
                                    parseInt(jobOffer.endDate.toString()) * 1000
                                )
                            ).format("YYYY-MM-DD");
                            let employerAddress =
                                jobOffer.employerAddress.substring(0, 5) +
                                "..." +
                                jobOffer.employerAddress.substring(38);

                            return (
                                <Tr key={idx}>
                                    <Td>{employerAddress}</Td>
                                    <Td>{startDate}</Td>
                                    <Td>{endDate}</Td>
                                    <Td>{jobOffer.salary.toString()}</Td>
                                    <Td>
                                        <Icon
                                            as={PiMagnifyingGlassLight}
                                            h={"1.2rem"}
                                            w={"1.2rem"}
                                            mr={4}
                                        />
                                        {tab === 1 ? (
                                            jobOffer.status < 1 ? (
                                                <Icon
                                                    onClick={() =>
                                                        confirmCandidature(
                                                            jobOffer.id
                                                        )
                                                    }
                                                    ml={2}
                                                    as={BsCheck2Circle}
                                                    h={"1.2rem"}
                                                    w={"1.2rem"}
                                                />
                                            ) : (
                                                <Icon
                                                    ml={2}
                                                    as={FcCancel}
                                                    h={"1.2rem"}
                                                    w={"1.2rem"}
                                                />
                                            )
                                        ) : tab === 2 ? (
                                            jobOffer.status === 2 ? (
                                                <Icon
                                                    onClick={() =>
                                                        completeFreelancerJob(
                                                            jobOffer.id
                                                        )
                                                    }
                                                    ml={2}
                                                    as={BsCheck2Circle}
                                                    h={"1.2rem"}
                                                    w={"1.2rem"}
                                                />
                                            ) : (
                                                jobOffer.status === 3 && (
                                                    <Icon
                                                        onClick={() =>
                                                            claimSalary(
                                                                jobOffer.id
                                                            )
                                                        }
                                                        ml={2}
                                                        as={BsCashCoin}
                                                        h={"1.2rem"}
                                                        w={"1.2rem"}
                                                    />
                                                )
                                            )
                                        ) : (
                                            <></>
                                        )}
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
