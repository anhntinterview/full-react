import { Dispatch, createContext } from 'react';
import { initH5PState } from 'state/H5P/H5P.state';
import { IH5PState } from 'types/H5P.type';

export const H5PContext = createContext<{
    H5PState: IH5PState;
    dispatch: Dispatch<any>;
}>({
    H5PState: initH5PState,
    dispatch: () => null,
});
