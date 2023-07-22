import { Box, Flex, SimpleGrid } from "@chakra-ui/react";

// contract context
import MainLayout from "@/layouts/MainLayout";
import { FreelancerCard } from "@/components/feed/FreelancerCard";
import SearchBar from "@/components/generic/Searchbar";
import BlurBackground from "@/components/generic/BlurBackground";
import { OfferCard } from "@/components/feed/OfferCard";
import { useContext, useState } from "react";
import { FreePharmaContext } from "@/providers/FreePharmaProvider";

const Index = () => {
    const [searchMode, setSearchMode] = useState("");

    const { freelancers } = useContext(FreePharmaContext);
    const { jobs } = useContext(FreePharmaContext);
    return (
        <MainLayout>
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
                    
                    <SearchBar searchMode={searchMode} setSearchMode={setSearchMode}/>

                    <SimpleGrid columns={{ sm: 1, md: 2, xl: 3 }} gap={10}>
                        {searchMode === "offers"
                            ? jobs.map((job, index) => <OfferCard job={job} jobId={index} key={index}/>)
                            : freelancers.map((freelancer, index) => <FreelancerCard freelancer={freelancer} jobId={index} key={index}/>)}
                    </SimpleGrid>
                    
                </Flex>
                
            </Flex>
        </MainLayout>
    );
};

export default Index;
