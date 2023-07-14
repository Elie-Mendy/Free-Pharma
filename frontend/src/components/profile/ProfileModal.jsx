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
import FreelancerForm from "./FreelancerForm";
import EmployerForm from "./EmployerForm";

const isEmployer = false;

export const ProfileModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const data = {
        title: isEmployer
            ? "Mettez à jour les informations de votre entreprise."
            : "Mettez à jour vos informations personnels.",
        helpText:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe veritatis adipisci architecto repudiandae rerum! Ut aliquam dolor eveniet?",
    };

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
                            {isEmployer
                                ? "Infos entreprise"
                                : "Infos personnelles"}
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
                    <ModalHeader>{data.title}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {isEmployer ? <EmployerForm /> : <FreelancerForm />}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
