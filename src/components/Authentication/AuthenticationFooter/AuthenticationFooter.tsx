import * as React from 'react';

export interface AuthenticationFooterProps {}

const AuthenticationFooter: React.FC<AuthenticationFooterProps> = () => {
    return (
        <>
            <div
                className="static md:bottom-ooolab_inset_20 md:mt-0 mt-ooolab_m_40 top-16 flex flex-col md:items-start items-center">
                <h3 className="text-ooolab_gray_3">LXP Portal</h3>
                <p className="text-ooolab_gray_4 text-center">
                    © 2018 - 2021 OOOLAB. All rights reserved
                </p>
            </div>
        </>
    );
};

export default AuthenticationFooter;
