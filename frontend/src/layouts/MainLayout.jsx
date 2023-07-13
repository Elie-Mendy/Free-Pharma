import Sidebar from "@/components/sidebar/Sidebar";
import Header from "@/components/header/Header";
import { Flex, useBreakpointValue } from "@chakra-ui/react";
import { useState } from "react";
import { useWagmi } from "@/hooks/useWagmi";
import Connexion from "@/components/connexion.jsx/Connexion";

const smVariant = { navigation: "drawer", navigationButton: true };
const mdVariant = { navigation: "sidebar", navigationButton: false };

export default function MainLayout({ children }) {
    // fetching connexions data from useWagmi hook
    const { isConnected } = useWagmi();
    const isFreelance = false;
    const isEmployer = true;

    // sidebars parameters
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const variants = useBreakpointValue({ base: smVariant, md: mdVariant });
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const isRegistered = isFreelance || isEmployer;
    const showConnexion = !isConnected || !isRegistered;
    const showApp = !isConnected & !isRegistered;
    // if not connected, display the connexion page

    return (
        <Flex direction={"column"} h={"100vh"}>
            {showConnexion ? (
                <Connexion isConnected={isConnected} isRegistered={isRegistered} />
            ) :(
                <>
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
                </>
            )}
        </Flex>
    );
}
