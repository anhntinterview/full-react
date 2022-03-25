import React from 'react';
import { Link } from 'react-router-dom';
import {useTranslation} from "react-i18next";

const LoginFormFooter: React.FC = () => {
    const {t} = useTranslation();

    return (
        <Link
            to="/password/forgot"
            className="ooolab_text_sm text-ooolab_blue_1"
        >
            {t('FORGOT_PASSWORD')}
        </Link>
    );
};

export default LoginFormFooter;
