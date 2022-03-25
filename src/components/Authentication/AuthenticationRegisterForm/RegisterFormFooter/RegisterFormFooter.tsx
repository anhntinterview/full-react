import React from 'react';
import { Link } from 'react-router-dom';
import {useTranslation} from "react-i18next";

const RegisterFormFooter: React.FC = () => {
    const {t}=useTranslation();
    return (
        <Link to="/login" className="ooolab_text_sm text-ooolab_blue_1">
            {t('ALREADY_HAVE_AN_ACCOUNT')}
        </Link>
    );
};

export default RegisterFormFooter;
