import React, { useReducer } from 'react';
import { UserContext } from './UserContext';
import reducers from 'reducers';
import { initUserState } from 'state/User/user.state';

const UserProvider: React.FC = ({ children }) => {
    const [userState, dispatch] = useReducer(
        reducers.userReducer,
        initUserState
    );
    return (
        <UserContext.Provider value={{ userState, dispatch }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
