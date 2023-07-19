import Sidebar from "@/components/sidebar/Sidebar";
import Header from "@/components/header/Header";
import { Box, Flex, Hide, useBreakpointValue } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { useWagmi } from "@/hooks/useWagmi";
import Connexion from "@/components/connexion.jsx/Connexion";
import Footer from "@/components/footer/Footer";
import BlurBackground from "@/components/generic/BlurBackground";
import { DataStorageContext } from "@/providers/DataStorageProvider";

const smVariant = { navigation: "drawer", navigationButton: true };
const mdVariant = { navigation: "sidebar", navigationButton: false };

export default function MainLayout({ children }) {
    // fetching connexions data from useWagmi hook
    const { isConnected } = useWagmi();
    const { userProfile } = useContext(DataStorageContext)

    // sidebars parameters
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const variants = useBreakpointValue({ base: smVariant, md: mdVariant });
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    
    const isRegistered = userProfile != "unknown" && userProfile != null;
    const showConnexion = !isConnected || !isRegistered;
    // if not connected, display the connexion page
    return (
        <Flex direction={"column"} h={"100vh"}>
            {showConnexion ? (
                <>
                    <Hide below="lg">
                        <Box>
                            <BlurBackground />
                        </Box>
                    </Hide>
                    <Connexion
                        isConnected={isConnected}
                        isRegistered={isRegistered}
                    />
                </>
            ) : (
                <>
                    <Sidebar
                        variant={variants?.navigation}
                        isOpen={isSidebarOpen}
                        onClose={toggleSidebar}
                    />
                    <Flex direction={"column"} align={"center"} h={"full"}>
                        <Header
                            showSidebarButton={variants?.navigationButton}
                            onShowSidebar={toggleSidebar}
                        />
                        <Box w={"full"}>
                            <Hide below="sm">
                                <Box>
                                    <BlurBackground />
                                </Box>
                            </Hide>
                            <Flex
                                h={"100%"}
                                w={"100%"}
                                direction={{ base: "column", xl: "row" }}
                                align="center"
                                justify={"center"}
                            >
                                <Flex
                                    direction={"column"}
                                    position={"relative"}
                                    w="95%"
                                    maxW="7xl"
                                    h={"100%"}
                                    gap={25}
                                    align={{ base: "stretch" }}
                                >
                                    {children}
                                </Flex>
                            </Flex>
                        </Box>
                        <Box w={"full"} h={"full"} >
                            <Footer />
                        </Box>
                    </Flex>
                </>
            )}
        </Flex>
    );
}
