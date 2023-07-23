import { FreePharmaContext } from "@/providers/FreePharmaProvider";
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
    IconButton,
} from "@chakra-ui/react";
import { useContext } from "react";

import { MdAssignmentAdd } from "react-icons/md";

export const MissionsTableData = ({freelancerAddress}) => {
    const { currentJobOffers, hireFreelancer } = useContext(FreePharmaContext);

    const bg = useColorModeValue("white", "gray.700");
    return (
        <TableContainer rounded={"xl"} shadow={"xl"} w={"100%"} bg={bg}>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Début</Th>
                        <Th>Fin</Th>
                        <Th>Rémunération</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {/* Open jobs / Candidatures pending */}
                    {/* started jobs / completed jobs */}
                    {/* paid jobs */}
                    {currentJobOffers?.map((jobOffer, idx) => {
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
                            <Tr key={idx}>
                                <Td>{startDate}</Td>
                                <Td>{endDate}</Td>
                                <Td>{jobOffer.salary.toString()}</Td>
                                <Td>
                                    <IconButton
                                        onClick={() => hireFreelancer(jobOffer.id)}
                                        colorScheme="blue"
                                        w={7}
                                        h={7}
                                        icon={<MdAssignmentAdd />}
                                        aria-label="Edit"
                                    />
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    );
};
