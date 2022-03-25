import * as React from 'react';

// COMPONENT
import Header from 'components/Header';
import Footer from 'components/Footer';
import ForgotPasswordForm from 'components/Authentication/AuthenticationForgotPasswordForm';
import { Link } from 'react-router-dom';

// TYPES

export interface ForgotPasswordPageProps {
    tokenParam?: string;
    emailParam?: string;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
    tokenParam,
    emailParam,
}) => {
    return (
        <ForgotPasswordForm tokenParam={tokenParam} emailParam={emailParam} />
    );
};

export default ForgotPasswordPage;
