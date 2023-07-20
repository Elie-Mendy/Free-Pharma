import { useState } from "react";
import { useToast } from "@chakra-ui/react";

export const useNotif = () => {
    const toast = useToast();
    const [info, setInfo] = useState(null);
    const [error, setError] = useState(null);

    const throwNotif = (level, message) => {
        switch (level) {
            case "info":
                toast({
                    title: "Confirmation:",
                    description: message,
                    status: "success",
                    duration: 9000,
                    position: "top",
                    isClosable: true,
                });
                break;

            case "error":
                toast({
                    title: "Erreur:",
                    description: message,
                    status: "error",
                    duration: 9000,
                    position: "top-right",
                    isClosable: true,
                });
                break;

            default:
                break;
        }
    };

    return {
        throwNotif,
        error,
        info,
        setInfo,
        setError,
    };
};
