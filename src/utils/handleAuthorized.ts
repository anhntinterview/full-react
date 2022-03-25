import Cookies from 'js-cookie';
import { getUserLocalData } from './handleLocalStorage';

export const getLocalCookie = () => {
    
    return Cookies.withAttributes({
        secure: true,
    }).get('fai');
};

export const isUserLoggedIn = () => {
    const isLoggedIn = getLocalCookie();
    const localUser = getUserLocalData();
    return !!isLoggedIn && localUser
};
