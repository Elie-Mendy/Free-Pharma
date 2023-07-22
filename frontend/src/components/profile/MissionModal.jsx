import {
    Box,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";

import { MdAssignmentAdd } from "react-icons/md";

import JobForm from "./JobForm";
export const MissionModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Stat
                px={{ base: 2, md: 4 }}
                py={"5"}
                shadow={"xl"}
                rounded={"lg"}
                bgGradient="linear(to-r, red.300,pink.300)"
                color={"white"}
                onClick={onOpen}
            >
                <Flex justifyContent={"space-between"}>
                    <Box pl={{ base: 2, md: 4 }}>
                        <StatLabel fontWeight={"medium"} isTruncated>
                            nouvelle mission
                        </StatLabel>
                        <StatNumber fontWeight={"medium"} isTruncated>
                            Poster
                        </StatNumber>
                    </Box>
                    <Box
                        my={"auto"}
                        color={useColorModeValue("gray.800", "gray.200")}
                        alignContent={"center"}
                    >
                        <MdAssignmentAdd size={"3em"} color="white" />
                    </Box>
                </Flex>
            </Stat>

            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay
                    bg="blackAlpha.300"
                    backdropFilter="blur(10px) hue-rotate(1deg)"
                />
                <ModalContent>
                    <ModalHeader>Détail de la mission</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <JobForm />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
