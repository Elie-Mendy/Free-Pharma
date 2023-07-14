import { useContext, useState } from "react";
import {
    Button,
    Flex,
    HStack,
    Heading,
    Input,
    Stack,
    Text,
} from "@chakra-ui/react";

// contract context
import { SimpleStorageContext } from "@/providers/SimpleStorageProvider";
import MainLayout from "@/layouts/MainLayout";

const Index = () => {
    const { storedValue, setValue, valueStoredData } =
        useContext(SimpleStorageContext);
    const [inputValue, setInputValue] = useState(0);
    return (
        <MainLayout>
            <Flex
                justify={"space-evenly"}
                align={"center"}
                direction={"column"}
                w={"100%"}
                h={"100%"}
                gap={4}
            >
                <Stack gap={5} >
                    <Heading>
                        Stored value : {storedValue}
                        
                    </Heading>
                    <HStack>
                            <Input
                                type="number"
                                placeholder="value to store"
                                w={"80%"}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <Button onClick={() => setValue(inputValue)}>
                                Store value
                            </Button>
                        </HStack>
                </Stack>

                <Stack spacing={4} align="center" justify="center" mt={8}>
                    {valueStoredData.map((log, index) => (
                        <Text key={index}>
                            {log.author} : {log.value}
                        </Text>
                    ))}
                </Stack>
            </Flex>
        </MainLayout>
    );
};

export default Index;
