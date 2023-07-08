import { useContext, useState } from "react";
import { Button, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// contract context
import { SimpleStorageContext } from "@/providers/SimpleStorageProvider";

function index() {
    const { storedValue, setValue, valueStoredData } =
        useContext(SimpleStorageContext);
    const [inputValue, setInputValue] = useState(0);
    return (
        <>
            <ConnectButton />
            <Flex justify={"center"} mt={8}>
                <Heading>Stored value : {storedValue}</Heading>
            </Flex>

            <Flex justify={"center"} mt={8}>
                <Input
                    type="number"
                    placeholder="value to store"
                    w={"25%"}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <Button onClick={() => setValue(inputValue)}>
                    Store value
                </Button>
            </Flex>
            <Stack spacing={4} align="center" justify="center" mt={8}>
                {valueStoredData.map((log, index) => (
                    <Text key={index}>
                        {log.author} : {log.value}
                    </Text>
                ))}
            </Stack>
        </>
    );
}

export default index;
