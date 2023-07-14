import { Flex, SimpleGrid } from "@chakra-ui/react";

// contract context
import MainLayout from "@/layouts/MainLayout";
import { FreelancerCard } from "@/components/feed/FreelancerCard";
import SearchBar from "@/components/generic/Searchbar";
import BlurBackground from "@/components/generic/BlurBackground";
import { OfferCard } from "@/components/feed/OfferCard";

const searchMode = "offeers";
const freelancers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const offers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const Index = () => {
    return (
        <MainLayout>
            <Flex
                mt={"1vh"}
                mx={{ base: "1vh", lg: "5vh", xl: "10vh", "2xl": "50%" }}
                w={{base:"80%", lg: "90%", xl: "80%", "2xl": "70%"}}
                maxW={"1500px"}
                p="10px"
                flexDirection={"column"}
            >
                <SearchBar />

                <BlurBackground />
                <SimpleGrid columns={{ sm: 1, md: 2, xl: 3 }} gap={10}>
                    {searchMode === "offers"
                        ? freelancers.map(() => <OfferCard />)
                        : offers.map(() => <FreelancerCard />)}
                </SimpleGrid>
            </Flex>
        </MainLayout>
    );
};

export default Index;
