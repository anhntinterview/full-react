import { Dispatch, createContext } from 'react';
// STATE
import { initGoogleState, initGoogleServerSideState } from 'state/Google/google.state';

// TYPES
import { GoogleState, GoogleServerSideState } from 'types/GoogleType';

export const GoogleAPIAndServicesContext = createContext<{
    googleState: GoogleState;
    dispatch: Dispatch<any>;
}>({
    googleState: initGoogleState,
    dispatch: () => null,
});

export const GoogleAPIAndServicesServerSideContext = createContext<{
    googleServerSideState: GoogleServerSideState;
    dispatch: Dispatch<any>;
}>({
    googleServerSideState: initGoogleServerSideState,
    dispatch: () => null,
});
