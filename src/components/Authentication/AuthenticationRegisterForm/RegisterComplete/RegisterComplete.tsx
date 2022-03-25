import * as React from 'react';
// PACKAGE
import { useHistory } from 'react-router-dom';
// COMPONENT
import ProgressBar from '../../../ProgressBar';
import logo from 'assets/SVG/logo.svg';
import { AUTH_CONST } from 'constant/auth.const';
// CONTEXT
import { RegisterContext } from 'contexts/Auth/RegisterContext';

export interface RegisterCompleteProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegisterComplete: React.FC<RegisterCompleteProps> = ({
    setAuthStorage,
}) => {
    const history = useHistory();
    const {
        registerState: { verifyEmailResult },
    } = React.useContext(RegisterContext);
    React.useEffect(() => {
        setAuthStorage(
            localStorage.getItem(
                `${AUTH_CONST.LOCAL_STORAGE_AUTH}_${verifyEmailResult?.email}`
            )
                ? true
                : false
        );
        setTimeout(() => {
            history.push('/password/create');
        }, 3000);
    }, []);
    return (
        <div className="flex items-center justify-center flex-col h-ooolab_body_2">
            <div className="md:w-1/2">
                <div className="mb-ooolab_m_7 w-full flex justify-center">
                    <img src={logo} alt="_logo" className="block" />
                </div>
                <ProgressBar />
                <p className="mb-ooolab_m_7 text-ooolab_base text-center">
                    Registration Completed. You will be redirect to update your
                    information after 3 seconds.
                </p>
            </div>
        </div>
    );
};

export default RegisterComplete;
