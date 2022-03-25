import React from 'react';
import AuthenticationLogo from 'components/Authentication/AuthenticationLogo';
import LoginForm from 'components/Authentication/AuthenticationLoginForm';
import LoginFormFooter from 'components/Authentication/AuthenticationLoginForm/LoginFormFooter';
import LoginBackGround from 'assets/SVG/login_background.svg'

export interface LoginPageProps {
    isAuthStorage: boolean;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
    defaultPassword?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({
     setAuthStorage,
     defaultPassword,
 }) => {
    return (
        <div className={'h-screen p-ooolab_p_20'}>
            <div
                className={'flex flex-row items-center h-full bg-white shadow-ooolab_box_shadow_container_2 rounded-ooolab_radius_40px'}>
                <img src={LoginBackGround} alt={'_login_background'} className={'h-full w-ooolab_w_200 rounded-l-ooolab_radius_40px'} style={{
                    objectFit: 'cover'
                }}/>
                <div
                    className={'flex flex-col items-center justify-between h-full pt-ooolab_p_7 overflow-y-auto'}>
                    <div className={'flex flex-col items-center'}>
                        <AuthenticationLogo/>
                        <LoginForm
                            setAuthStorage={setAuthStorage}
                            defaultPassword={defaultPassword}
                        />
                    </div>
                    <div className={'mb-ooolab_m_10'}>
                        <LoginFormFooter/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
