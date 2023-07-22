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
    useDisclosure,
} from "@chakra-ui/react";

import { FiEdit } from "react-icons/fi";

import JobForm from "./JobForm";
export const EditMissionModal = ({jobOffer}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <FiEdit onClick={onOpen} size={"1.2rem"} color="red.600" />

            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay
                    bg="blackAlpha.300"
                    backdropFilter="blur(10px) hue-rotate(1deg)"
                />
                <ModalContent>
                    <ModalHeader>Détail de la mission</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <JobForm jobOffer={jobOffer} />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
