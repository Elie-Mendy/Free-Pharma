import { Heading, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import BuyPHARMForm from "./BuyPHARMForm";

function BuyPHARMWidget() {
    return (
        <Stack
            bg={useColorModeValue("gray.50", "gray.700")}
            rounded={"xl"}
            p={{ base: 4, sm: 6, md: 8 }}
            spacing={4}
            shadow={"xl"}
        >
            <Stack spacing={4}>
                <Heading
                    color={useColorModeValue("gray.800", "white")}
                    fontSize={{ base: "2xl", sm: "3xl" }}
                >
                    Acheter des tokens{" "}
                    <Text
                        as={"span"}
                        bgGradient="linear(to-r, red.400,pink.400)"
                        bgClip="text"
                    >
                        PHARM{" "}
                    </Text>
                </Heading>
                <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Saepe veritatis adipisci
                </Text>
            </Stack>
            <BuyPHARMForm />
        </Stack>
    );
}

export default BuyPHARMWidget;
