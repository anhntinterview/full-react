import * as React from 'react';

export interface AuthenticationHeaderProps {}

const AuthenticationHeader: React.FC<AuthenticationHeaderProps> = () => {
    return (
        <>
            <h1 className="text-black font-semibold  xl:text-ooolab_4xl lg:text-ooolab_4xl md:text-ooolab_4xl text-4xl mb-ooolab_m_5 leading-tigh">
                Welcome to Ooolab
            </h1>
            <span className="xl:text-ooolab_sm text-ooolab_gray_1">
                Please create account to access our services.
            </span>
        </>
    );
};

export default AuthenticationHeader;
