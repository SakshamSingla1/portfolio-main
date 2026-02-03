import React, { useState , useEffect } from "react";
import { useDefaultColorTheme } from "../../hooks/useDefaultColorTheme";
import { useProfileMasterService } from "../../services/useProfileMasterService";
import { HTTP_STATUS } from "../../utils/constants";

const Home: React.FC = () => {
    const { defaultTheme, setDefaultTheme } = useDefaultColorTheme();
    const profileMasterService = useProfileMasterService();
    const [profile, setProfile] = useState<any>(null);

    const fetchProfile = async () => {
        try{
            const response = await profileMasterService.get();
            if(response.status === HTTP_STATUS.OK){
                setProfile(response.data);
                setDefaultTheme(response.data.colorTheme);
            }
        } catch (error) {

        }
    };
    
    useEffect(() => {
        fetchProfile();
    }, []);
    
    return (
        <div>
            <h1>Home</h1>
        </div>
    );
};

export default Home;