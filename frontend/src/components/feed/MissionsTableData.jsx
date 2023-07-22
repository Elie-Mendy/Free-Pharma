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

import { MdAssignmentAdd } from "react-icons/md";

export const MissionsTableData = ({ table }) => {
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
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>Sanofi</Td>
                        <Td>15/07/2022</Td>
                        <Td>23/07/2022</Td>
                        <Td>780 € </Td>
                        <Td>
                            <IconButton
                                colorScheme="blue"
                                w={7}
                                h={7}
                                icon={<MdAssignmentAdd />}
                                aria-label="Edit"
                            />
                        </Td>
                    </Tr>
                    <Tr>
                        <Td>Sanofi</Td>
                        <Td>15/07/2022</Td>
                        <Td>23/07/2022</Td>
                        <Td>780 € </Td>
                        <Td>actions</Td>
                    </Tr>
                    <Tr>
                        <Td>Sanofi</Td>
                        <Td>15/07/2022</Td>
                        <Td>23/07/2022</Td>
                        <Td>780 € </Td>
                        <Td>actions</Td>
                    </Tr>
                    <Tr>
                        <Td>Sanofi</Td>
                        <Td>15/07/2022</Td>
                        <Td>23/07/2022</Td>
                        <Td>780 € </Td>
                        <Td>actions</Td>
                    </Tr>
                    <Tr>
                        <Td>Sanofi</Td>
                        <Td>15/07/2022</Td>
                        <Td>23/07/2022</Td>
                        <Td>780 € </Td>
                        <Td>actions</Td>
                    </Tr>
                    <Tr>
                        <Td>Sanofi</Td>
                        <Td>15/07/2022</Td>
                        <Td>23/07/2022</Td>
                        <Td>780 € </Td>
                        <Td>actions</Td>
                    </Tr>
                    <Tr>
                        <Td>Sanofi</Td>
                        <Td>15/07/2022</Td>
                        <Td>23/07/2022</Td>
                        <Td>780 € </Td>
                        <Td>actions</Td>
                    </Tr>
                    <Tr>
                        <Td>Sanofi</Td>
                        <Td>15/07/2022</Td>
                        <Td>23/07/2022</Td>
                        <Td>780 € </Td>
                        <Td>actions</Td>
                    </Tr>
                    <Tr>
                        <Td>Sanofi</Td>
                        <Td>15/07/2022</Td>
                        <Td>23/07/2022</Td>
                        <Td>780 € </Td>
                        <Td>actions</Td>
                    </Tr>
                    <Tr>
                        <Td>Sanofi</Td>
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
