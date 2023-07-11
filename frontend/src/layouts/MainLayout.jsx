import Sidebar from "@/components/sidebar/Sidebar";
import Header from "@/components/header/Header";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useState } from "react";
import { useWagmi } from "@/hooks/useWagmi";
import { Connexion } from "@/components/connexion.jsx/Connexion";

const smVariant = { navigation: "drawer", navigationButton: true };
const mdVariant = { navigation: "sidebar", navigationButton: false };

export default function MainLayout({ children }) {
    // fetching connexions data from useWagmi hook
    const { isConnected, address, chain } = useWagmi();

    // sidebars parameters
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const variants = useBreakpointValue({ base: smVariant, md: mdVariant });
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    // if not connected, display the connexion page
    return !isConnected ? (
        <Connexion />
    ) : (
        <Flex direction={"column"} h={"100vh"}>
            <Sidebar
                variant={variants?.navigation}
                isOpen={isSidebarOpen}
                onClose={toggleSidebar}
            />
            <Flex direction={"column"} h={"100%"}>
                <Header
                    showSidebarButton={variants?.navigationButton}
                    onShowSidebar={toggleSidebar}
                />
                {children}
            </Flex>
        </Flex>
    );
}
