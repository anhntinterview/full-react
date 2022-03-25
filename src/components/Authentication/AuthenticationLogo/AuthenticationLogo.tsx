import * as React from 'react';
import { Link } from 'react-router-dom';

import newLogo from 'assets/SVG/new_logo.svg';

const AuthenticationLogo: React.FC = () => {
    return (
        <Link to="/">
            <img src={newLogo} alt="_logo" />
        </Link>
    );
};

export default AuthenticationLogo;
