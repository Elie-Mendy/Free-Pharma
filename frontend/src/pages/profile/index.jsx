import MainLayout from "@/layouts/MainLayout";

import { useContext } from "react";
import { DataStorageContext } from "@/providers/DataStorageProvider";

import { FreelancerTableData } from "../../components/profile/FreelancerTableData";
import FreelancerStats from "@/components/profile/FreelancerStats";
import EmployerStats from "@/components/profile/EmployerStats";
import { EmployerTableData } from "@/components/profile/EmployerTableData";

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
