import MainLayout from "@/layouts/MainLayout";

import { useContext } from "react";

import { FreelancerTableData } from "../../components/profile/FreelancerTableData";
import FreelancerStats from "@/components/profile/FreelancerStats";
import EmployerStats from "@/components/profile/EmployerStats";
import { EmployerTableData } from "@/components/profile/EmployerTableData";
import { FreePharmaContext } from "@/providers/FreePharmaProvider";

function ProfilePage() {

    const { userProfile } = useContext(FreePharmaContext);
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
