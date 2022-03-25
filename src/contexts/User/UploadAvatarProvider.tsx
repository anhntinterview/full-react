import React, { useReducer } from 'react';
import { UploadAvatarContext } from './UserContext';
import reducers from 'reducers';
import { initUploadAvatarState } from 'state/User/user.state';

const UploadAvatarProvider: React.FC = ({ children }) => {
    const [uploadAvatarState, dispatch] = useReducer(
        reducers.uploadAvatarReducer,
        initUploadAvatarState
    );
    return (
        <UploadAvatarContext.Provider value={{ uploadAvatarState, dispatch }}>
            {children}
        </UploadAvatarContext.Provider>
    );
};

export default UploadAvatarProvider;
