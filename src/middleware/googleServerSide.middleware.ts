// ACTION
import { result } from 'lodash';
import { SET_GOOGLE_SERVER_SIDE } from 'actions/google.action';
// SERVICE
import { GoogleServerSide } from 'services';
// TYPE
import {
    GetDriveAuthentiacteUrlOAuth2ArgsType,
    AuthentiacteWithDriveOAuth2ArgsType,
    GetDriveCredentialOfWorkspaceOAuth2ArgsType,
} from 'types/GoogleType';
// UTILS
import { removeLocalStorageAuthData } from 'utils/handleLocalStorage';

const getDriveAuthenticateUrlOAuth2 = (
    dispatch: React.Dispatch<any>,
    args: GetDriveAuthentiacteUrlOAuth2ArgsType
) => {
    dispatch({
        type: SET_GOOGLE_SERVER_SIDE.REQ_GOOGLE_SERVER_SIDE_API_AND_SERVICES,
    });
    try {
        GoogleServerSide.getDriveAuthenticateUrlOAuth2(args).then((result) => {
            console.log(`getDriveAuthenticateUrlOAuth2 result: `, result);

            if (result.error) {
                dispatch({
                    type:
                        SET_GOOGLE_SERVER_SIDE.REQ_GET_DRIVE_AUTHENTICATE_URL_OAUTH2_FAIL,
                    getDriveAuthentiacteUrlResponseError: result,
                });
            }
            if (result.validation_error) {
                dispatch({
                    type:
                        SET_GOOGLE_SERVER_SIDE.REQ_GET_DRIVE_AUTHENTICATE_URL_OAUTH2_FAIL,
                    getDriveAuthentiacteUrlResponseValidateError: result,
                });
            }
            dispatch({
                type:
                    SET_GOOGLE_SERVER_SIDE.REQ_GET_DRIVE_AUTHENTICATE_URL_OAUTH2_SUCCESS,
                getDriveAuthentiacteUrlResult: result,
            });
        });
    } catch (err) {
        dispatch({
            type:
                SET_GOOGLE_SERVER_SIDE.REQ_GET_DRIVE_AUTHENTICATE_URL_OAUTH2_FAIL,
            err: err.toJSON().message,
        });
    }
};

const authenticateWithDrivelOAuth2 = (
    dispatch: React.Dispatch<any>,
    args: AuthentiacteWithDriveOAuth2ArgsType
) => {
    dispatch({
        type: SET_GOOGLE_SERVER_SIDE.REQ_GOOGLE_SERVER_SIDE_API_AND_SERVICES,
    });
    try {
        GoogleServerSide.authenticateWithDrivelOAuth2(args).then((result) => {
            console.log(`authenticateWithDrivelOAuth2 result: `, result);
            if (result) {
                const rs = result.json();
                if (result.status === 204) {
                    dispatch({
                        type:
                            SET_GOOGLE_SERVER_SIDE.REQ_AUTHENTICATE_WITH_DRIVE_OAUTH2_SUCCESS,
                        authentiacteWithDriveResult: result.status,
                    });
                }
                // if (result.status === 401) {
                //     alert(
                //         'You called the authenticateWithDrivelOAuth2 API too many time. Please wait 60s after that continue!'
                //     );
                //     // removeLocalStorageAuthData();
                // }
                dispatch({
                    type:
                        SET_GOOGLE_SERVER_SIDE.REQ_AUTHENTICATE_WITH_DRIVE_OAUTH2_FAIL,
                    authentiacteWithDriveResponseError: result,
                });
                rs.then((r) => {
                    if (r.error) {
                        dispatch({
                            type:
                                SET_GOOGLE_SERVER_SIDE.REQ_AUTHENTICATE_WITH_DRIVE_OAUTH2_FAIL,
                            getDriveCredentialOfWorkspaceResponseError: r,
                        });
                    }
                    if (r.validation_error) {
                        dispatch({
                            type:
                                SET_GOOGLE_SERVER_SIDE.REQ_AUTHENTICATE_WITH_DRIVE_OAUTH2_FAIL,
                            authentiacteWithDriveResponseValidateError: r,
                        });
                    }
                });
            }
        });
    } catch (err) {
        dispatch({
            type:
                SET_GOOGLE_SERVER_SIDE.REQ_AUTHENTICATE_WITH_DRIVE_OAUTH2_FAIL,
            err: err.toJSON().message,
        });
    }
};

const getDriveCredentialsOfWorkspaceOAuth2 = (
    dispatch: React.Dispatch<any>,
    args: GetDriveCredentialOfWorkspaceOAuth2ArgsType
) => {
    dispatch({
        type: SET_GOOGLE_SERVER_SIDE.REQ_GOOGLE_SERVER_SIDE_API_AND_SERVICES,
    });
    try {
        GoogleServerSide.getDriveCredentialsOfWorkspaceOAuth2(args).then(
            (result) => {
                console.log(
                    `getDriveCredentialsOfWorkspaceOAuth2 result: `,
                    result
                );
                if (result.error) {
                    dispatch({
                        type:
                            SET_GOOGLE_SERVER_SIDE.REQ_GET_DRIVE_CREDENTIALS_OF_WORKSPACE_OAUTH2_FAIL,
                        getDriveCredentialOfWorkspaceResponseError: result,
                    });
                }
                if (result.validation_error) {
                    dispatch({
                        type:
                            SET_GOOGLE_SERVER_SIDE.REQ_GET_DRIVE_CREDENTIALS_OF_WORKSPACE_OAUTH2_FAIL,
                        getDriveCredentialOfWorkspaceResponseValidateError: result,
                    });
                }
                dispatch({
                    type:
                        SET_GOOGLE_SERVER_SIDE.REQ_GET_DRIVE_CREDENTIALS_OF_WORKSPACE_OAUTH2_SUCCESS,
                    getDriveCredentialOfWorkspaceResult: result,
                });
            }
        );
    } catch (err) {
        dispatch({
            type:
                SET_GOOGLE_SERVER_SIDE.REQ_GET_DRIVE_CREDENTIALS_OF_WORKSPACE_OAUTH2_FAIL,
            err: err.toJSON().message,
        });
    }
};

export default {
    getDriveAuthenticateUrlOAuth2,
    authenticateWithDrivelOAuth2,
    getDriveCredentialsOfWorkspaceOAuth2,
};
