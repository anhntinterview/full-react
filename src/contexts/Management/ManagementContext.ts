import { Dispatch, createContext } from 'react';
import { initH5PState } from 'state/H5P/H5P.state';
import { IH5PState } from 'types/H5P.type';

export const ManagementContext = createContext<{
    ManagementState: IH5PState;
    dispatch: Dispatch<any>;
}>({
    ManagementState: initH5PState,
    dispatch: () => null,
});
