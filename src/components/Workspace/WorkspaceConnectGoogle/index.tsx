import { oauth2Submit } from 'components/MasterPage/LeftNavigation/LeftMenuFN';
import { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
    getGoogleAuthLocal,
    getLocalStorageAuthData,
} from 'utils/handleLocalStorage';

const WorkspaceConnectGoogle = () => {
    const param: { id: string; type?: string; folderId: string } = useParams();
    const history = useHistory();
    const authGoogleLocal = getGoogleAuthLocal();

    useEffect(() => {
        if (!authGoogleLocal) {
            const userDataLocalStorage = getLocalStorageAuthData();
            setTimeout(
                () =>
                    oauth2Submit(
                        {
                            id: param.id,
                        },
                        userDataLocalStorage.email
                    )(),
                1000
            );
        } else {
            setTimeout(
                () => history.push(`/workspace/${param.id}/my-drive`),
                2000
            );
        }
    }, []);

    return (
        <div className="h-screen w-full px-ooolab_p_4 py-ooolab_p_4">
            <div className="w-full h-full p-ooolab_p_2 rounded-lg border shadow-ooolab_box_shadow_container flex flex-col items-center justify-center">
                <p className="inline-flex items-center text-ooolab_32px font-extralight">
                    {(!authGoogleLocal && (
                        <>
                            Navigate to login to drive, please wait
                            <span className="animate-bounce mr-ooolab_m_1">
                                !
                            </span>
                        </>
                    )) ||
                        'Already login, go back to my drive!'}
                </p>
            </div>
        </div>
    );
};

export default WorkspaceConnectGoogle;
