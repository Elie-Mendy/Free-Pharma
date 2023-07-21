import {
    Button,
    Icon,
    ListItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    UnorderedList,
    useDisclosure,
} from "@chakra-ui/react";
import { BiHelpCircle } from "react-icons/bi";
import { StakingManagerContext } from "@/providers/StakingManagerProvider";
import { useContext } from "react";

export const StakingInfoModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { switchDemoMode, demoMode } = useContext(StakingManagerContext);
    return (
        <>
            <Icon
                onClick={onOpen}
                color="pink.400"
                as={BiHelpCircle}
                w={6}
                h={6}
                alignSelf={"flex-start"}
            />
            <Modal onClose={onClose} isOpen={isOpen} isCentered size={"2xl"}>
                <ModalOverlay
                    bg="blackAlpha.300"
                    backdropFilter="blur(10px) hue-rotate(1deg)"
                />
                <ModalContent>
                    <ModalHeader>Modalités de staking:</ModalHeader>
                    <ModalBody>
                        <Stack spacing={4}>
                            <Text my={2}>
                                Le rendement annualisé est de 5%. un bonus
                                s'applique en fonction du pourcentage de votre
                                participation à la valeur totale stackée. Un
                                mode démo est proposé pour intéragir avec le
                                smart contract de stacking et générer des
                                récompenses rammenées en minutes.
                            </Text>
                            <Text fontWeight={"bold"}>
                                Deux seuils sont fixés:{" "}
                            </Text>
                            <UnorderedList>
                                <ListItem>
                                    participation à la valeur totale stackée de
                                    1% : bonus 1%
                                </ListItem>
                                <ListItem>
                                    participation à la valeur totale stackée de
                                    2% : bonus 2%
                                </ListItem>
                                <ListItem>
                                    Au dela de 5 % de participation à la valeur
                                    totale stackée : bonus 3%
                                </ListItem>
                            </UnorderedList>
                        </Stack>
                        <Button
                            my={8}
                            rounded={"full"}
                            onClick={switchDemoMode}
                            fontFamily={"heading"}
                            w={"full"}
                            bgGradient="linear(to-r, red.300,pink.500)"
                            color={"white"}
                            _hover={{
                                bgGradient: "linear(to-r, red.400,pink.600)",
                                boxShadow: "xl",
                            }}
                        >
                            {!demoMode ? "Passer en mode Démo": "Passer en mode Production"}
                        </Button>
                    </ModalBody>
                    <ModalCloseButton />
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
