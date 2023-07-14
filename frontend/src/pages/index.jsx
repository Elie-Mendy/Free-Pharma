import { Box, Flex, SimpleGrid } from "@chakra-ui/react";

// contract context
import MainLayout from "@/layouts/MainLayout";
import { FreelancerCard } from "@/components/feed/FreelancerCard";
import SearchBar from "@/components/generic/Searchbar";
import BlurBackground from "@/components/generic/BlurBackground";
import { OfferCard } from "@/components/feed/OfferCard";
import { useState } from "react";


const freelancers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const offers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const Index = () => {
    const [searchMode, setSearchMode] = useState("");

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
                            ? freelancers.map((key) => <OfferCard key={key}/>)
                            : offers.map((key) => <FreelancerCard key={key}/>)}
                    </SimpleGrid>
                    
                </Flex>
                
            </Flex>
        </MainLayout>
    );
};

export default Index;
