import { BarType, NewBarType } from 'constant/setupBars.const';
import React from 'react';
import { PrivateRouteContext } from './PrivateRouteContext';

const PrivateRouteProvider: React.FC<{
    barType?: BarType;
    newBarType?: NewBarType;
}> = ({ barType, newBarType, children }) => (
    <PrivateRouteContext.Provider value={{ barType, newBarType }}>
        {children}
    </PrivateRouteContext.Provider>
);

export default PrivateRouteProvider;
