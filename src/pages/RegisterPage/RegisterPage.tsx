import React from 'react';
// PACKAGE
import { withRouter } from 'react-router-dom';
import { RouteComponentProps, useHistory } from 'react-router';
// COMPONENT
import {
    RegisterForm,
    SendCodeFromEmailForm,
    RegisterComplete,
} from 'components/Authentication/AuthenticationRegisterForm';
import AuthenticationLogo from 'components/Authentication/AuthenticationLogo';
import Footer from 'components/Footer';
import RegisterFormFooter from 'components/Authentication/AuthenticationRegisterForm/RegisterFormFooter';
import SendCodeFromEmailFormFooter from 'components/Authentication/AuthenticationRegisterForm/SendCodeFromEmailForm/SendCodeFromEmailFormFooter';
// TYPES
import { RegisterCreateTemporaryUserBodyType } from 'types/Register.type';
// CONTEXT
import RegisterProvider from 'contexts/Auth/RegisterProvider';
import LoginBackGround from 'assets/SVG/login_background.svg';
import { AUTH_CONST } from 'constant/auth.const';
import { RegisterContext } from 'contexts/Auth/RegisterContext';

export interface RegisterPageProps extends RouteComponentProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ setAuthStorage }) => {
    const history = useHistory();
    const [
        emailState,
        setEmailState,
    ] = React.useState<RegisterCreateTemporaryUserBodyType>();

    // Step 1: Create temporary user
    const [isEmailRegisted, setEmailRegisted] = React.useState<boolean>(false);
    // Step 2: Email verify
    const [isEmailVerfied, setEmailVerified] = React.useState<boolean>(false);
    const {
        registerState: { verifyEmailResult },
    } = React.useContext(RegisterContext);

    React.useEffect(() => {
        if (isEmailVerfied) {
            setAuthStorage(
                !!localStorage.getItem(
                    `${AUTH_CONST.LOCAL_STORAGE_AUTH}_${verifyEmailResult?.email}`
                )
            );
            history.push('/password/create');
        }
    }, [isEmailVerfied]);

    return (
        <>
            {isEmailRegisted ? (
                <div className={'h-screen p-ooolab_p_20'}>
                    <div
                        className={
                            'flex flex-col items-center h-full bg-white shadow-ooolab_box_shadow_container_2 rounded-ooolab_radius_40px justify-between'
                        }
                    >
                        <ul className="ooolab_pagination_parent_1 mt-ooolab_m_12">
                            <li className="ooolab_pagination_item_active_1" />
                            <li className="ooolab_pagination_item_1" />
                            <li className="ooolab_pagination_item_1" />
                        </ul>
                        <div className="w-ooolab_w_127">
                            <SendCodeFromEmailForm
                                setEmailVerified={setEmailVerified}
                            />
                        </div>
                        <div className={'mb-ooolab_m_10'}>
                            <SendCodeFromEmailFormFooter
                                emailState={emailState}
                                setEmailState={setEmailState}
                                setEmailRegisted={setEmailRegisted}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className={'h-screen p-ooolab_p_20'}>
                    <div
                        className={
                            'flex flex-row items-center h-full bg-white shadow-ooolab_box_shadow_container_2 rounded-ooolab_radius_40px'
                        }
                    >
                        <img
                            src={LoginBackGround}
                            alt={'_login_background'}
                            className={
                                'h-full w-ooolab_w_200 rounded-l-ooolab_radius_40px'
                            }
                            style={{
                                objectFit: 'cover',
                            }}
                        />
                        <div
                            className={
                                'flex flex-col items-center justify-between h-full pt-ooolab_p_7'
                            }
                        >
                            <div className={'flex flex-col items-center'}>
                                <AuthenticationLogo />
                                <RegisterForm
                                    setEmailRegisted={setEmailRegisted}
                                    setEmailState={setEmailState}
                                    emailState={emailState}
                                />
                            </div>
                            <div className={'mb-ooolab_m_10'}>
                                <RegisterFormFooter />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default withRouter(RegisterPage);
