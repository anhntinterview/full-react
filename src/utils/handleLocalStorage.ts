// PACKAGE
import _ from 'lodash';
import jwt from 'jwt-decode';
// CONSTANT
import { AUTH_CONST } from 'constant/auth.const';
// STATE
import { initAuthLocalStorage } from 'state/Auth/auth.state';
import { AuthLocalStorageType, AuthType, JWTDecodeType } from 'types/Auth.type';
import { CheckboxType, LessonFilterLocal } from 'types/Lesson.type';
import { CourseParam } from 'types/ApiData.type';
import { useHistory } from 'react-router-dom';

// *** ---------------------------------- *** //
// *** I. HANDLE API AUTH:                *** //
// *** ---------------------------------- *** //
export function updateLocalStorageAuthCreatePasswordApiData(result: AuthType) {
    console.log(`result: `, result);
    // Set user info of current email
    localStorage.setItem(
        `${AUTH_CONST.USER_INFO}_${result.email}`,
        JSON.stringify({ ...result, access_token: result.access_token })
    );
}

// export function setLocalStorageAuthApiData(result: AuthType) {
//     let listOfEmailAuthenticated: Array<string> = [];
//     let checkEmailExisted: Array<string> | undefined;
//     const listOfEmailAuthenticatedLS = localStorage.getItem(
//         AUTH_CONST.LIST_OF_EMAIL_AUTHENTICATED
//     );

//     const checkTemporaryJwt: JWTDecodeType = jwt(
//         (result.access_token as string) ||
//             (result.temporary_access_token as string)
//     );
//     console.log(checkTemporaryJwt);

//     if (checkTemporaryJwt.context.token_type !== 'temporary_token') {
//         // Set user info of current email
//         localStorage.setItem(
//             `${AUTH_CONST.USER_INFO}_${result.email}`,
//             JSON.stringify(result)
//         );
//         // Set isAuth of current email
//         localStorage.setItem(
//             `${AUTH_CONST.LOCAL_STORAGE_AUTH}_${result.email}`,
//             JSON.stringify(true)
//         );
//         // Remove temporay (if any)
//         if (
//             localStorage.getItem(
//                 `${AUTH_CONST.LOCAL_STORAGE_TEMPORARY_AUTH}_${result.email}`
//             )
//         ) {
//             localStorage.removeItem(
//                 `${AUTH_CONST.LOCAL_STORAGE_TEMPORARY_AUTH}_${result.email}`
//             );
//         }
//     } else {
//         delete result.access_token;
//         // Set user info of current email
//         localStorage.setItem(
//             `${AUTH_CONST.USER_INFO}_${result.email}`,
//             JSON.stringify(result)
//         );
//         // Set isAuth of current email
//         localStorage.setItem(
//             `${AUTH_CONST.LOCAL_STORAGE_TEMPORARY_AUTH}_${result.email}`,
//             JSON.stringify(true)
//         );
//     }

//     if (listOfEmailAuthenticatedLS) {
//         listOfEmailAuthenticated = JSON.parse(listOfEmailAuthenticatedLS);
//         checkEmailExisted = listOfEmailAuthenticated.filter(
//             (item) => item === result.email
//         );
//     }
//     // If not duplicate email. Add email to list email array
//     if (!checkEmailExisted || checkEmailExisted.length === 0) {
//         listOfEmailAuthenticated.push(result.email);

//         localStorage.setItem(
//             AUTH_CONST.LIST_OF_EMAIL_AUTHENTICATED,
//             JSON.stringify(listOfEmailAuthenticated)
//         );
//     }

//     // Set current email
//     localStorage.setItem(
//         `${AUTH_CONST.CURRENT_ACCOUNT}`,
//         JSON.stringify(result.email)
//     );
// }

export function setStorageAuthApiData(result: AuthType) {
    let listOfEmailAuthenticated: Array<string> = [];
    let checkEmailExisted: Array<string> | undefined;
    const listOfEmailAuthenticatedLS = localStorage.getItem(
        AUTH_CONST.LIST_OF_EMAIL_AUTHENTICATED
    );

    let checkTemporaryJwt: JWTDecodeType;

    if (result?.access_token || result?.temporary_access_token) {
        checkTemporaryJwt = jwt(
            (result.access_token as string) ||
                (result.temporary_access_token as string)
        );
    }

    if (result) {
        if (checkTemporaryJwt?.type === 'temporary_token') {
            delete result.access_token;
            // Set user info of current email
            sessionStorage.setItem(
                `${AUTH_CONST.USER_INFO}_${result.email}`,
                JSON.stringify(result)
            );
            // Set isAuth of current email
            sessionStorage.setItem(
                `${AUTH_CONST.LOCAL_STORAGE_TEMPORARY_AUTH}_${result.email}`,
                JSON.stringify(true)
            );
        } else {
            // Set user info of current email
            localStorage.setItem(
                `${AUTH_CONST.USER_INFO}_${result.email}`,
                JSON.stringify(result)
            );
            // Set isAuth of current email
            localStorage.setItem(
                `${AUTH_CONST.LOCAL_STORAGE_AUTH}_${result.email}`,
                JSON.stringify(true)
            );
            // Remove temporay (if any)
            if (
                localStorage.getItem(
                    `${AUTH_CONST.LOCAL_STORAGE_TEMPORARY_AUTH}_${result.email}`
                )
            ) {
                localStorage.removeItem(
                    `${AUTH_CONST.LOCAL_STORAGE_TEMPORARY_AUTH}_${result.email}`
                );
            }
        }

        if (listOfEmailAuthenticatedLS) {
            listOfEmailAuthenticated = JSON.parse(listOfEmailAuthenticatedLS);
            checkEmailExisted = listOfEmailAuthenticated.filter(
                (item) => item === result.email
            );
        }
        // If not duplicate email. Add email to list email array
        if (!checkEmailExisted || checkEmailExisted.length === 0) {
            listOfEmailAuthenticated.push(result.email);

            localStorage.setItem(
                AUTH_CONST.LIST_OF_EMAIL_AUTHENTICATED,
                JSON.stringify(listOfEmailAuthenticated)
            );
        }

        // Set current email
        localStorage.setItem(
            `${AUTH_CONST.CURRENT_ACCOUNT}`,
            JSON.stringify(result.email)
        );
    }
}

export function removeLocalStorageAuthApiData(result: AuthType) {
    let listOfEmailAuthenticated: Array<string> = [];
    const listOfEmailAuthenticatedLS = localStorage.getItem(
        AUTH_CONST.LIST_OF_EMAIL_AUTHENTICATED
    );

    if (listOfEmailAuthenticatedLS) {
        listOfEmailAuthenticated = JSON.parse(listOfEmailAuthenticatedLS);
    }
    // Remove current email to list email array
    _.pull(listOfEmailAuthenticated, result.email);
    // debugger; // eslint-disable-line no-debugger
    // Set list email again
    localStorage.setItem(
        `${AUTH_CONST.LIST_OF_EMAIL_AUTHENTICATED}`,
        JSON.stringify(listOfEmailAuthenticated)
    );
    // Remove user info of current email
    localStorage.removeItem(`${AUTH_CONST.USER_INFO}_${result.email}`);
    // Remove isAuth of current email
    localStorage.removeItem(`${AUTH_CONST.LOCAL_STORAGE_AUTH}_${result.email}`);
    // Remove current email
    localStorage.removeItem(`${AUTH_CONST.CURRENT_ACCOUNT}`);
}

// *** ---------------------------------- *** //
// *** II. HANDLE LOCAL STORAGE AUTH:     *** //
// *** ---------------------------------- *** //
export const getCurrentEmail = () => {
    let currentEmail;
    const tempCurrentEmail = localStorage.getItem(
        `${AUTH_CONST.CURRENT_ACCOUNT}`
    );
    if (tempCurrentEmail) {
        currentEmail = JSON.parse(tempCurrentEmail);
    }
    return currentEmail;
};

export const isHasLoginAccount = () => {
    const currentEmail = getCurrentEmail();
    let temp;
    let isHasLoginAccount = false;
    const ls = localStorage.getItem(`${AUTH_CONST.USER_INFO}_${currentEmail}`);
    if (ls) {
        temp = JSON.parse(ls);
        isHasLoginAccount = temp.has_login_account;
    }
    return isHasLoginAccount;
};

export const isLocalStorageTemporaryAuth = () => {
    const currentEmail = getCurrentEmail();
    let temp;
    const ls = sessionStorage.getItem(
        `${AUTH_CONST.LOCAL_STORAGE_TEMPORARY_AUTH}_${currentEmail}`
    );
    if (ls) {
        temp = JSON.parse(ls);
    }
    return temp;
};

export const isLocalStorageAuth = () => {
    const currentEmail = getCurrentEmail();
    let temp;
    const ls = localStorage.getItem(
        `${AUTH_CONST.LOCAL_STORAGE_AUTH}_${currentEmail}`
    );
    if (ls) {
        temp = JSON.parse(ls);
    }
    return temp;
};

export const isSessionStorageAuth = () => {
    const currentEmail = getCurrentEmail();
    let temp;
    const ls = sessionStorage.getItem(
        `${AUTH_CONST.LOCAL_STORAGE_AUTH}_${currentEmail}`
    );
    if (ls) {
        temp = JSON.parse(ls);
    }
    return temp;
};

export const sessionClear = () => {
    sessionStorage.clear();
};

export function updateLocalStorageUserInfoFields(
    keys: string[],
    values: any[]
) {
    const currentEmail = getCurrentEmail();
    let temp: AuthLocalStorageType;
    const ls = localStorage.getItem(`${AUTH_CONST.USER_INFO}_${currentEmail}`);
    if (ls) {
        temp = JSON.parse(ls);
        if (temp) {
            keys.map((key, index) => {
                if (key) {
                    temp[key] = values[index];
                }
            });
        }
        localStorage.setItem(
            `${AUTH_CONST.USER_INFO}_${currentEmail}`,
            JSON.stringify(temp)
        );
    }
}

export const getLocalStorageAuthData = () => {
    const currentEmail = getCurrentEmail();
    let temp;
    let authLocalStorage: AuthLocalStorageType = initAuthLocalStorage;
    const ls = localStorage.getItem(`${AUTH_CONST.USER_INFO}_${currentEmail}`);
    if (ls) {
        temp = JSON.parse(ls);
    }
    if (temp) {
        authLocalStorage = {
            country: temp.country,
            display_name: temp.display_name,
            first_name: temp.first_name,
            language: temp.language,
            last_name: temp.last_name,
            temporary_access_token: temp.temporary_access_token,
            access_token: temp.access_token,
            avatar_url: temp.avatar_url,
            email: temp.email,
            has_login_account: temp.access_token,
            id: temp.id,
            name: temp.name,
            time_zone: temp.time_zone,
            dob: temp.dob,
        };
    }
    return authLocalStorage;
};

export const getSessionStorageAuthData = () => {
    const currentEmail = getCurrentEmail();
    let temp;
    let authLocalStorage: AuthLocalStorageType = initAuthLocalStorage;
    const ls = sessionStorage.getItem(
        `${AUTH_CONST.USER_INFO}_${currentEmail}`
    );
    if (ls) {
        temp = JSON.parse(ls);
    }
    if (temp) {
        authLocalStorage = {
            country: temp.country,
            display_name: temp.display_name,
            first_name: temp.first_name,
            language: temp.language,
            last_name: temp.last_name,
            temporary_access_token: temp.temporary_access_token,
            access_token: temp.access_token,
            avatar_url: temp.avatar_url,
            email: temp.email,
            has_login_account: temp.access_token,
            id: temp.id,
            name: temp.name,
            time_zone: temp.time_zone,
            dob: temp.dob,
        };
    }
    return authLocalStorage;
};

export const getAttrLocalStorageAuthData = (attrName: string) => {
    const authData = getLocalStorageAuthData();
    return authData[`${attrName}`];
    // return Object.keys(authData).map((item) => {
    //     if (item === attrName) {
    //         return authData[item];
    //     }
    // })[0];
};

export function removeLocalStorageAuthData(currentPath?: string) {
    const currentEmail = getCurrentEmail();
    let listOfEmailAuthenticated: Array<string> = [];
    const listOfEmailAuthenticatedLS = localStorage.getItem(
        AUTH_CONST.LIST_OF_EMAIL_AUTHENTICATED
    );

    if (listOfEmailAuthenticatedLS) {
        listOfEmailAuthenticated = JSON.parse(listOfEmailAuthenticatedLS);
    }
    // Remove current email to list email array
    _.pull(listOfEmailAuthenticated, currentEmail);
    // debugger; // eslint-disable-line no-debugger
    // Set list email again
    // localStorage.setItem(
    //     `${AUTH_CONST.LIST_OF_EMAIL_AUTHENTICATED}`,
    //     JSON.stringify(listOfEmailAuthenticated)
    // );
    // Remove user info of current email
    localStorage.removeItem(`${AUTH_CONST.USER_INFO}_${currentEmail}`);
    // Remove temporaryIsAuth of current email
    localStorage.removeItem(
        `${AUTH_CONST.LOCAL_STORAGE_TEMPORARY_AUTH}_${currentEmail}`
    );
    // Remove isAuth of current email
    localStorage.removeItem(`${AUTH_CONST.LOCAL_STORAGE_AUTH}_${currentEmail}`);
    // Remove current email
    localStorage.removeItem(`${AUTH_CONST.CURRENT_ACCOUNT}`);
    if (currentPath) {
        localStorage.setItem(AUTH_CONST.CURRENT_PATH, currentPath);
    }
}

// *** ---------------------------------- *** //
// *** III. HANDLE INVITE LINK FROM EMAIL *** //
// *** ---------------------------------- *** //

export function changeFalseForLocalStorageCurrentAccount() {
    const currentEmail = getCurrentEmail();
    const currentEmailLs = localStorage.getItem(
        `${AUTH_CONST.CURRENT_ACCOUNT}`
    );
    if (currentEmailLs) {
        localStorage.setItem(
            `${AUTH_CONST.LOCAL_STORAGE_AUTH}_${currentEmail}`,
            JSON.stringify(false)
        );
    }
}

export function setLocalStorageAuthEmailData(emailParam: string) {
    let listOfEmailAuthenticated: Array<string> = [];
    let checkEmailExisted: Array<string> | undefined;
    const listOfEmailAuthenticatedLS = localStorage.getItem(
        AUTH_CONST.LIST_OF_EMAIL_AUTHENTICATED
    );

    if (listOfEmailAuthenticatedLS) {
        listOfEmailAuthenticated = JSON.parse(listOfEmailAuthenticatedLS);
        checkEmailExisted = listOfEmailAuthenticated.filter(
            (item) => item === emailParam
        );
    }
    // If not duplicate email. Add email to list email array
    if (!checkEmailExisted) {
        listOfEmailAuthenticated.push(emailParam);

        localStorage.setItem(
            AUTH_CONST.LIST_OF_EMAIL_AUTHENTICATED,
            JSON.stringify(listOfEmailAuthenticated)
        );
    }

    // Set isAuth of current email
    localStorage.setItem(
        `${AUTH_CONST.LOCAL_STORAGE_AUTH}_${emailParam}`,
        JSON.stringify(false)
    );
    // Set current email
    localStorage.setItem(
        `${AUTH_CONST.CURRENT_ACCOUNT}`,
        JSON.stringify(emailParam)
    );
    // debugger; // eslint-disable-line no-debugger
}

export const isLocalStorageEmail = (encode: string) => {
    const currentEmail = getCurrentEmail();
    const encodeEmail = window
        .btoa(currentEmail)
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .toLowerCase();
    const isEmail = encode === encodeEmail;
    return isEmail;
};

// *** ---------------------------------- *** //
// *** IV. GOOGLE DRIVE *** //
// *** ---------------------------------- *** //

export const getGoogleAuthLocal = () => {
    const local = localStorage.getItem('google_auth');
    if (local) {
        const parseLocal = JSON.parse(local);
        return parseLocal;
    }
    return null;
};

export const getAttrLocalStorage = (
    attrName: string,
    localStorageName: string
) => {
    let localStorageItem: any;
    const ls = localStorage.getItem(localStorageName);
    if (ls) {
        localStorageItem = JSON.parse(ls);
    }

    let attrValue;

    if (localStorageItem) {
        Object.keys(localStorageItem).map((item) => {
            if (item === attrName) {
                attrValue = localStorageItem[item];
            }
        })[0];
    }

    return attrValue;
};

export const getLessonFilterLocal = (): LessonFilterLocal => {
    const item = localStorage.getItem('selected');
    if (item) {
        return JSON.parse(item);
    }
    return {
        authors: [],
        tags: [],
    };
};

export const getCourseFilterLocal = (): {
    title: string;
    selectedTags: CheckboxType[];
    selectedAuthors: CheckboxType[];
} => {
    const item = localStorage.getItem('course-filter');
    let parsedItem;
    if (item) {
        parsedItem = JSON.parse(item);
    }

    return {
        title: parsedItem ? parsedItem.title : '',
        selectedTags: parsedItem ? parsedItem.selectedTags : [],
        selectedAuthors: parsedItem ? parsedItem.selectedAuthors : [],
    };
};

export const getPreviousPath = (): string | null => {
    return localStorage.getItem(AUTH_CONST.CURRENT_PATH);
};

export const removePreviousPath = () => {
    localStorage.removeItem(AUTH_CONST.CURRENT_PATH);
};

export const getUserLocalData = () => {
    const userData = localStorage.getItem('user-data');
    if (userData) {
        return JSON.parse(userData);
    }
    return null;
};
