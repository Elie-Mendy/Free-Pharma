import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";

export const useNotif = () => {
    const toast = useToast();
    const [info, setInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (info)
            toast({
                title: "Confirmation !",
                description: info,
                status: "info",
                duration: 4000,
                position: "top-right",
                isClosable: true,
            });
        if (error)
            toast({
                title: "Une erreur est survenue !",
                description: error,
                status: "error",
                duration: 9000,
                position: "top-right",
                isClosable: true,
            });
    }, [info, error]);

    return {
        error,
        setInfo,
        setError,
    };
};
