import React, { useReducer } from 'react';
import { LeftMenuContext } from './LeftMenuContext';
import reducers from 'reducers';
import { initLeftMenuState } from 'state/LeftMenu/leftMenu.state';

const LeftMenuProvider: React.FC = ({ children }) => {
    const [leftMenuState, dispatch] = useReducer(
        reducers.leftMenuReducers,
        initLeftMenuState
    );
    return (
        <LeftMenuContext.Provider value={{ leftMenuState, dispatch }}>
            {children}
        </LeftMenuContext.Provider>
    );
};

export default LeftMenuProvider;
