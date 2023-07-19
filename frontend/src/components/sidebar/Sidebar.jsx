import {
    Button,
    Drawer,
    DrawerOverlay,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    DrawerContent,
    Flex,
} from "@chakra-ui/react";
import Link from "next/link";

const SidebarContent = ({ onClick }) => (
    <Flex direction={"column"} gap={3}>
        <Link href="/">
            <Button onClick={onClick} w="100%">
                Acceuil
            </Button>
        </Link>
        <Link href="/profile">
            <Button onClick={onClick} w="100%">
                Profil
            </Button>
        </Link>
        <Link href="/wallet">
            <Button onClick={onClick} w="100%">
                Portefeuille
            </Button>
        </Link>

        <Link href="/stacking">
            <Button onClick={onClick} w="100%">
                Rendements
            </Button>
        </Link>

        <Link href="/voting">
            <Button onClick={onClick} w="100%">
                Vote
            </Button>
        </Link>
    </Flex>
);

const Sidebar = ({ isOpen, variant, onClose }) => {
    return (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay>
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Chakra-UI</DrawerHeader>
                    <DrawerBody>
                        <SidebarContent onClick={onClose} />
                    </DrawerBody>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
    );
};

export default Sidebar;
