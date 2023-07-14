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
import { FiEdit } from "react-icons/fi";
import ApprovalForm from "./ApprovalForm";

export const ApprovalModal = () => {
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
                            Approval
                        </StatLabel>
                        <StatNumber fontWeight={"medium"} isTruncated>
                            Modifier
                        </StatNumber>
                    </Box>
                    <Box
                        my={"auto"}
                        color={useColorModeValue("gray.800", "gray.200")}
                        alignContent={"center"}
                    >
                        <FiEdit size={"3em"} color="white" />
                    </Box>
                </Flex>
            </Stat>

            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay
                    bg="blackAlpha.300"
                    backdropFilter="blur(10px) hue-rotate(1deg)"
                />
                <ModalContent>
                    <ModalHeader>Modification de la l'approbation</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <ApprovalForm />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
