// ACTIONS
import { SET_AUTH } from 'actions/auth.action';
import Cookies from 'js-cookie';
import authService from 'services/auth.service';
import { getLocalCookie } from './handleAuthorized';
// UTILS
import {
    isLocalStorageAuth,
    removeLocalStorageAuthData,
    sessionClear,
} from './handleLocalStorage';

export function handleLogout(
    authDispatch: React.Dispatch<any>,
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>> | undefined,
    successCallback?: () => void
) {
    authDispatch({ type: SET_AUTH.LOGOUT });
    authService
        .logout()
        .then((res) => {
            if (setAuthStorage && res) {
                setAuthStorage(false);
            }
            if (!res) {
                // error on api request (expired token ..)
                localStorage.removeItem('user-data');
                setAuthStorage(false);
            }
            if (successCallback) {
                successCallback();
            }
        })
        .catch((err) => {
            console.log('handleLogout catch');
        });
}

export function handleLogoutRegister(
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>> | undefined
) {
    setAuthStorage(false);
    sessionClear();
}
