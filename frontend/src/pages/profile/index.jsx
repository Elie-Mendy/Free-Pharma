import MainLayout from "@/layouts/MainLayout";

import { useContext } from "react";
import { DataStorageContext } from "@/providers/DataStorageProvider";

import {
    Flex,
    Stack,
    Heading,
    Text,
    Box,
    useColorModeValue,
} from "@chakra-ui/react";
import FreelancerForm from "@/components/profile/FreelancerForm";
import { FreelancerTableData } from "../../components/profile/FreelancerTableData";
import FreelancerStats from "@/components/profile/FreelancerStats";
import EmployerStats from "@/components/profile/EmployerStats";
import { EmployerTableData } from "@/components/profile/EmployerTableData";
import EmployerForm from "@/components/profile/EmployerForm";

const isEmployer = false;

function ProfilePage() {

    const { userProfile } = useContext(DataStorageContext);

    return (
        <MainLayout>
            {userProfile == "employer" ? (
                <>
                    <EmployerStats />
                    <EmployerTableData />
                </>
            ) : userProfile == "freelancer" && (
                <>
                    <FreelancerStats />
                    <FreelancerTableData />
                </>
            )}
        </MainLayout>
    );
}

export default ProfilePage;
