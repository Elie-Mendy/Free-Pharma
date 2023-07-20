import { useNotif } from "@/hooks/useNotif";
import { StakingManagerContext } from "@/providers/StakingManagerProvider";
import {
    Box,
    Button,
    Flex,
    HStack,
    Input,
    Radio,
    RadioGroup,
    Stack,
    useColorModeValue,
} from "@chakra-ui/react";
import { useContext, useState } from "react";

export default function StakingForm() {
    const { throwNotif } = useNotif();
    const { stakeETH, stakePHARM, unsakeETH, unstakePHARM } = useContext(
        StakingManagerContext
    );
    const [stackPHARM, setStackPHARM] = useState(true);
    const [amount, setAmount] = useState(0);

    const handleDeposit = () => {
        console.log(stackPHARM)
        if (stackPHARM) {
            stakePHARM(amount * 10 ** 18);
        } else {
            stakeETH(amount);
        }
    };
    const handleWithdraw = () => {
        if (stackPHARM) {
            unstakePHARM(amount * 10 ** 18);
        } else {
            unstakeETH(amount * 10 ** 18);
        }
    };

    return (
        <Flex as={"form"} direction={"column"} align={"stretch"} gap={4}>
            <HStack spacing={4}>
                <Input
                    type={"number"}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Montant"
                    bg={useColorModeValue("gray.100", "gray.600")}
                    border={0}
                    color={useColorModeValue("gray.600", "gray.300")}
                    _placeholder={{
                        color: "gray.400",
                    }}
                />
                <RadioGroup defaultValue="1" onChange={() => setStackPHARM(!stackPHARM)}>
                    <Stack spacing={4} direction="row">
                        <Radio
                            colorScheme="pink"
                            value="1"
                        >
                            PHARM
                        </Radio>
                        <Radio
                            colorScheme="pink"
                            value="2"
                        >
                            ETH
                        </Radio>
                    </Stack>
                </RadioGroup>
            </HStack>
            <HStack w={"full"} gap={4}>
                <Button
                    onClick={handleDeposit}
                    fontFamily={"heading"}
                    w={"full"}
                    bgGradient="linear(to-r, green.300,green.500)"
                    color={"white"}
                    _hover={{
                        bgGradient: "linear(to-r, green.400,green.600)",
                        boxShadow: "xl",
                    }}
                >
                    Déposer
                </Button>
                <Button
                    onClick={handleWithdraw}
                    fontFamily={"heading"}
                    w={"full"}
                    bgGradient="linear(to-r, red.300,red.500)"
                    color={"white"}
                    _hover={{
                        bgGradient: "linear(to-r, red.400,red.600)",
                        boxShadow: "xl",
                    }}
                >
                    Retirer
                </Button>
            </HStack>
        </Flex>
    );
}
