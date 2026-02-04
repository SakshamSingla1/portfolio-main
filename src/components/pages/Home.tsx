import React, { useState , useEffect } from "react";
import { useDefaultColorTheme } from "../../hooks/useDefaultColorTheme";
import { useProfileMasterService } from "../../services/useProfileMasterService";
import { HTTP_STATUS } from "../../utils/constants";
import type { ProfileMaster } from "../../utils/types";
import ProfileCard from "../templates/ProfileCard.template";

const Home: React.FC = () => {
    const { setDefaultTheme , setProfileId } = useDefaultColorTheme();
    const profileMasterService = useProfileMasterService();
    const [profileMaster, setProfileMaster] = useState<ProfileMaster | null>(null);

    const fetchProfile = async () => {
        try{
            const response = await profileMasterService.get();
            if(response.status === HTTP_STATUS.OK){
                setProfileMaster(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };
    
    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        setDefaultTheme(profileMaster?.colorTheme || null);
        setProfileId(profileMaster?.profile?.id || null);
    },[profileMaster])
    
    return (
        <div>
            <ProfileCard
                profile={profileMaster?.profile!}
                socialLinks={profileMaster?.socialLinks!}
            />
        </div>
    );
};

export default Home;