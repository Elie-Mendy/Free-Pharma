import { useContext, useState } from "react";
import { FreePharmaContext } from "@/providers/FreePharmaProvider";

import {
    Box,
    Button,
    Flex,
    Input,
    Stack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { useNotif } from "@/hooks/useNotif";
import moment from "moment";

export default function JobForm({ jobOffer }) {
    const { createJob, setJob } = useContext(FreePharmaContext);
    const { throwNotif } = useNotif();

    // States
    const [startDate, setStartDate] = useState(
        jobOffer
            ? moment(
                  new Date(parseInt(jobOffer.startDate.toString()) * 1000)
              ).format("YYYY-MM-DD")
            : ""
    );
    const [endDate, setEndDate] = useState(
        jobOffer
            ? moment(
                  new Date(parseInt(jobOffer.endDate.toString()) * 1000)
              ).format("YYYY-MM-DD")
            : ""
    );
    const [salary, setSalary] = useState(
        jobOffer ? parseInt(jobOffer.salary.toString()) : ""
    );
    const [location, setLocation] = useState(jobOffer ? jobOffer.location : "");

    // submit form
    const handleSubmit = () => {
        if (
            startDate === "" ||
            endDate === "" ||
            salary === "" ||
            location === ""
        ) {
            throwNotif(
                "error",
                "Veuillez renseigner tous les champs du formulaire."
            );
        } else {
            let startTimestamp = new Date(startDate).getTime() / 1000;
            let endTimestamp = new Date(endDate).getTime() / 1000;

            if (jobOffer) {
                setJob(
                    jobOffer.id,
                    salary,

                    location
                );
                throwNotif("success", "Mission modifiée avec succès !");
            } else {
                createJob(startTimestamp, endTimestamp, salary, location);
                throwNotif("success", "Mission créée avec succès !");
            }
        }
    };

    return (
        <Box as={"form"} mt={10}>
            <Stack spacing={4}>
                <Flex w={"full"}>
                    <Box w={"50%"} mr={2}>
                        <Text>Date de début</Text>
                        <Input
                            onChange={(e) => setStartDate(e.target.value)}
                            type="date"
                            value={startDate}
                            bg={useColorModeValue("gray.100", "gray.600")}
                            border={0}
                            color={useColorModeValue("gray.600", "gray.300")}
                            _placeholder={{
                                color: "gray.400",
                            }}
                        />
                    </Box>
                    <Box w={"50%"} ml={2}>
                        <Text>Date de fin</Text>
                        <Input
                            onChange={(e) => setEndDate(e.target.value)}
                            type="date"
                            value={endDate}
                            bg={useColorModeValue("gray.100", "gray.600")}
                            border={0}
                            color={useColorModeValue("gray.600", "gray.300")}
                            _placeholder={{
                                color: "gray.400",
                            }}
                        />
                    </Box>
                </Flex>

                <Input
                    onChange={(e) => setSalary(e.target.value)}
                    type="number"
                    placeholder="Salaire"
                    value={salary}
                    bg={useColorModeValue("gray.100", "gray.600")}
                    border={0}
                    color={useColorModeValue("gray.600", "gray.300")}
                    _placeholder={{
                        color: "gray.400",
                    }}
                />

                <Input
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Localisation"
                    value={location}
                    bg={useColorModeValue("gray.100", "gray.600")}
                    border={0}
                    color={useColorModeValue("gray.600", "gray.300")}
                    _placeholder={{
                        color: "gray.400",
                    }}
                />
            </Stack>
            <Button
                onClick={handleSubmit}
                fontFamily={"heading"}
                mt={8}
                w={"full"}
                bgGradient="linear(to-r, red.400,pink.400)"
                color={"white"}
                _hover={{
                    bgGradient: "linear(to-r, red.400,pink.400)",
                    boxShadow: "xl",
                }}
            >
                Enregistrer
            </Button>
        </Box>
    );
}
