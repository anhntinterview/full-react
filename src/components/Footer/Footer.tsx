import * as React from 'react';

export interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
    return (
        <div className="flex justify-center items-center h-ooolab_h_16 md:h-ooolab_h_28 border-t border-gray-200">
            <p className="text-ooolab_gray_4 text-sm md:text-sm lg:text-ooolab_base">
                © 2018 - 2021 OOOLAB. All rights reserved
            </p>
        </div>
    );
};

export default Footer;
