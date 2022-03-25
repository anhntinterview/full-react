import { Dispatch, createContext } from 'react';
// STATE
import { initAuthState } from 'state/Auth/auth.state';

// TYPES
import {AuthAction, AuthState} from 'types/Auth.type';

export const AuthContext = createContext<{
    authState: AuthState;
    dispatch: Dispatch<AuthAction>;
}>({
    authState: initAuthState,
    dispatch: () => null,
});
