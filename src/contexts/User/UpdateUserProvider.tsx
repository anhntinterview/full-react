import React, { useReducer } from 'react';
import { UpdateUserContext } from './UserContext';
import reducers from 'reducers';
import { initUpdateUserState } from 'state/User/user.state';

const UpdateUserProvider: React.FC = ({ children }) => {
    const [updateUserState, dispatch] = useReducer(
        reducers.updateUserReducer,
        initUpdateUserState
    );
    return (
        <UpdateUserContext.Provider value={{ updateUserState, dispatch }}>
            {children}
        </UpdateUserContext.Provider>
    );
};

export default UpdateUserProvider;
