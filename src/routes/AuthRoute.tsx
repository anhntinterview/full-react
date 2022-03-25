import * as React from 'react';
// PACKAGE
import { Redirect, Route, useHistory } from 'react-router-dom';
// UTILS
import { isHasLoginAccount } from 'utils/handleLocalStorage';
// CONSTANTS
import { LOCAL_STORAGE_GOOGLE } from 'constant/google.const';
// UTILS
import { convertHashParamObjFromUrl } from 'utils/handleString';
// TYPES
import { GoogleAuthLocal } from 'types/GoogleType';
import lodash from 'lodash';

const AuthRoute: React.ComponentType<any> = ({
    path,
    isAuthStorage,
    setAuthStorage,
    storageUserInfo,
    // setHeader,
    component: Component,
    ...rest
}) => {
    // *** TEST: Google API link:
    // http://localhost:3000/google/login?state=HgILXlKhmbKZkd3JDo7WeyO71sK1AN&code=4/0AY0e-g7X7BAwqBLLuHw7-YCVQ1Pi12fEGC5D6h6VtvUtzsWnbWpSUeod5UgONpDpKRbJYw&scope=https://www.googleapis.com/auth/drive.appdata%20https://www.googleapis.com/auth/drive.metadata.readonly%20https://www.googleapis.com/auth/drive.file%20openid&authuser=1&prompt=consent
    // http://localhost:3000/google/login#state=13&access_token=ya29.a0ARrdaM_SSrcAPymsSzhYQutwU5NhMtDPDqYk9dhcMEvY5bXGp0dnuqrAk7kXQV3QYPiMAz7tvZdq9kmhW0E-o0O_-v8QdgCoXMx1p_wINgr61fTBy6wOWrPT79jPfhpEbu2UtdmbkPkAAJXmGmt4EuRyfyoc&token_type=Bearer&expires_in=3599&scope=https://www.googleapis.com/auth/drive
    const history = useHistory();
    const pathName = history.location.pathname;
    const hashParams = history.location.hash;
    let redirectUrl = '';

    // CATCH ROUTE: "/workspace/create" - should be redirect to HOME PAGE
    const hasLoginAccount = isHasLoginAccount();
    let isNoHasLoginAccountAndAccessCreateWorkspace = false;
    if (pathName.indexOf('/password/create') > -1 && hasLoginAccount) {
        isNoHasLoginAccountAndAccessCreateWorkspace = true;
    }

    // GOOGLE API: REDIRECT CASE:
    const googleAuthLocal: GoogleAuthLocal = {
        access_token: undefined,
        expires: undefined,
        scope: undefined,
        state: undefined,
        token_type: undefined,
    };
    if (pathName.indexOf('/google/login') > -1) {
        const hashParamsObj = convertHashParamObjFromUrl(hashParams);

        // AUTO UPDATE IF AVAILABLE REFRESH TOKEN FROM GOOGLE
        if (hashParamsObj) {
            const redirectState = JSON.parse(hashParamsObj.state);
            googleAuthLocal.access_token = hashParamsObj.access_token;
            googleAuthLocal.expires = hashParamsObj.expires_in;
            googleAuthLocal.scope = hashParamsObj.scope;
            googleAuthLocal.token_type = hashParamsObj.token_type;
            localStorage.setItem(
                LOCAL_STORAGE_GOOGLE.OAUTH2_PARAMS,
                JSON.stringify(googleAuthLocal)
            );
            
            // set redirect page
            redirectUrl = `/workspace/${redirectState.id}/my-drive`;
            if (redirectState.path) {
                redirectUrl = redirectState.path;
            }
        }
    }

    return (
        <Route
            path={path}
            {...rest}
            exact
            render={(props) => {
                return isAuthStorage ? (
                    redirectUrl ? (
                        <Redirect
                            to={{
                                pathname: redirectUrl,
                                state: {
                                    from: props.location,
                                    to: {
                                        googleAuthLocal,
                                    },
                                },
                            }}
                        />
                    ) : (
                        <Component
                            {...props}
                            setAuthStorage={setAuthStorage}
                            storageUserInfo={storageUserInfo}
                        />
                    )
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: props.location },
                        }}
                    />
                );
            }}
        />
    );
};

export default AuthRoute;
