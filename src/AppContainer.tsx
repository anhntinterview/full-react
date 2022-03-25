import * as React from 'react';
// PACKAGE
import { BrowserRouter } from 'react-router-dom';
// COMPONENT
import Routes from './routes';
// UTILS
import {
    getLocalStorageAuthData,
    isLocalStorageAuth,
    getAttrLocalStorage,
    getCurrentEmail,
    getSessionStorageAuthData,
} from './utils/handleLocalStorage';
import { handleLogout } from './utils/handleLogout';
// CONTEXT
import { UserContext } from './contexts/User/UserContext';
import { AuthContext } from './contexts/Auth/AuthContext';
// MIDDLEWARE
import userMiddleware from './middleware/user.middleware';
import Modal from 'components/Modal';

import CancelChanges from 'assets/SVG/cancel.svg';
import axiosInstance from 'services/restful.service';
import { AuthAction } from 'types/Auth.type';
import { SET_AUTH } from 'actions/auth.action';
import { getLocalCookie } from 'utils/handleAuthorized';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { AUTH_CONST } from 'constant/auth.const';
export interface AppContainerProps {
    isAuthStorage: boolean;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContainer: React.FC<AppContainerProps> = ({
    isAuthStorage,
    setAuthStorage,
}) => {
    const storageUserInfo = getLocalStorageAuthData();
    const storageUserInfoSession = getSessionStorageAuthData();
    const [modalState, setModalState] = React.useState<{
        message: string;
        func: ((e: boolean) => void) | undefined;
    }>({
        message: '',
        func: undefined,
    });

    const handleClosePromptModal = () =>
        setModalState({ message: '', func: undefined });

    // HANDLE EXPIRED
    const userCtx = React.useContext(UserContext);
    const {
        dispatch: userDispatch,
        userState: { err },
    } = userCtx;
    const authCtx = React.useContext(AuthContext);
    const authDispatch = authCtx.dispatch;
    const currentEmail = getCurrentEmail();
    const token: string | undefined = getAttrLocalStorage(
        'access_token',
        `user_info_${currentEmail}`
    );

    // React.useEffect(() => {
    //     if (token) {
    //         userMiddleware.getUser(userDispatch, token);
    //     }
    // }, []);

    React.useEffect(() => {
        if (err?.error?.name === AUTH_CONST.UNAUTHORIZED) {
            handleLogout(authDispatch, setAuthStorage);
        }
        if (err?.error?.name === AUTH_CONST.TOKEN_EXPIRED) {
            localStorage.removeItem('user-data');
            setAuthStorage(false);
        }
    }, [err]);

    // }, [err]);

    const axiosInstanceIntceptorWithCookie = (config: AxiosRequestConfig) => {
        const cookieToken = getLocalCookie();
        // Do something before request is sent
        const { method } = config;
        const newHeaders = { ...config };
        if (method !== 'get' && cookieToken) {
            newHeaders.headers['X-CSRF-TOKEN'] = cookieToken;
        }

        return newHeaders;
    };

    React.useEffect(() => {
        let idInteceptor;
        if (isAuthStorage) {
            idInteceptor = axiosInstance.interceptors.request.use(
                axiosInstanceIntceptorWithCookie,
                function (error) {
                    // Do something with request error
                    return Promise.reject(error);
                }
            );
        } else {
            if (idInteceptor) {
                axiosInstance.interceptors.request.eject(idInteceptor);
            }
        }
        axiosInstance.interceptors.response.use(
            function (response) {
                // Any status code that lie within the range of 2xx cause this function to trigger
                // Do something with response data
                return response;
            },
            function (error: AxiosError) {
                // Any status codes that falls outside the range of 2xx cause this function to trigger
                // Do something with response error
                const { data, status } = error.response;
                if (
                    status === 401 &&
                    data?.error?.name === AUTH_CONST.UNAUTHORIZED
                ) {
                    authDispatch({
                        type: SET_AUTH.LOGIN_FAIL,
                        err: {
                            ...error.response.data,
                        },
                    } as AuthAction);
                }
                if (
                    status === 401 &&
                    data?.error?.name === AUTH_CONST.TOKEN_EXPIRED
                ) {
                    localStorage.removeItem('user-data');
                    setAuthStorage(false);
                }
                if (
                    status === 403 &&
                    data?.error?.name === AUTH_CONST.FORBIDDEN
                ) {
                }
                return Promise.reject(error);
            }
        );
    }, [isAuthStorage]);

    return (
        <BrowserRouter
            getUserConfirmation={(m, cb) => {
                setModalState({
                    message: m,
                    func: cb,
                });
            }}
        >
            <Modal
                imgSrc={CancelChanges}
                title={modalState.message}
                isOpen={!!modalState.message}
                onClose={() => handleClosePromptModal()}
                mainBtn={
                    <button
                        onClick={() => {
                            if (modalState.func) {
                                modalState.func(true);
                                handleClosePromptModal();
                            }
                        }}
                        className="bg-red-500 text-white text-ooolab_sm px-ooolab_p_3 py-ooolab_p_1_e rounded-lg focus:outline-none"
                    >
                        Confirm
                    </button>
                }
                subBtn={
                    <button
                        onClick={() => handleClosePromptModal()}
                        className="border text-ooolab_sm px-ooolab_p_3 py-ooolab_p_1_e rounded-lg focus:outline-none"
                    >
                        Cancel
                    </button>
                }
            />
            <Routes
                isAuthStorage={isAuthStorage}
                setAuthStorage={setAuthStorage}
                storageUserInfo={storageUserInfo}
                storageUserInfoSession={storageUserInfoSession}
            />
        </BrowserRouter>
    );
};

export default AppContainer;
