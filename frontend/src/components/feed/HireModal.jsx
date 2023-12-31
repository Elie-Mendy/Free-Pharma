import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import { MissionsTableData } from "./MissionsTableData";

export const HireModal = ({available}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>  
            <Button disabled={!available} variant={"outline"} onClick={onOpen}>Recruter</Button>

            <Modal size={"5xl"} onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay
                    bg="blackAlpha.300"
                    backdropFilter="blur(10px) hue-rotate(1deg)"
                />
                <ModalContent>
                    <ModalHeader>Pour quelle mission ?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <MissionsTableData />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
