import { Dispatch, createContext } from 'react';
// STATE
import {
    initLeftMenuState
} from 'state/LeftMenu/leftMenu.state';

// TYPES
import { LeftMenuState } from 'types/LeftMenu.type';

export const LeftMenuContext = createContext<{
    leftMenuState: LeftMenuState;
    dispatch: Dispatch<any>;
}>({
    leftMenuState: initLeftMenuState,
    dispatch: () => null,
});
